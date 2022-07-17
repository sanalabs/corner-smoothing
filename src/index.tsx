import React, {
  ComponentType,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  PropsWithoutRef,
  ReactElement,
  ReactHTML,
  ReactNode,
  useRef,
} from "react";
import { getSvgPath, FigmaSquircleParams } from "figma-squircle";

type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };
type Optional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

type Options = Optional<
  Require<Omit<FigmaSquircleParams, "width" | "height">, "cornerRadius">,
  "cornerSmoothing"
> & { borderWidthPx?: number };

/** CSS id must start with a letter. */
const createCssId = (length: number = 8): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `squircle-${result}`;
};

const setCss = (css: string, el: HTMLElement, id: string): void => {
  const styleId = `style-${id}`;

  let styleEl = document.getElementById(styleId);

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css.replace(/&/g, `.${id}`);
};

function asNonNullable<T>(val: T): NonNullable<T> {
  if (val === undefined || val === null)
    throw new Error("Expeced non-nullable");
  return val as NonNullable<T>;
}

const getContentWidth = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element);
  return (
    element.clientWidth -
    parseFloat(computedStyle.paddingLeft) -
    parseFloat(computedStyle.paddingRight)
  );
};

const getContentHeight = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element);
  return (
    element.clientHeight -
    parseFloat(computedStyle.paddingTop) -
    parseFloat(computedStyle.paddingBottom)
  );
};

const vanillaSquircle = (el: HTMLElement, opts: Options, id: string): void => {
  el.style.clipPath = 'unset';

  const width = el.clientWidth;
  const height = el.clientHeight;
  // const width = getContentWidth(el);
  // const height = getContentHeight(el);

  const opts2 = {
    preserveSmoothing: true, // Default to true, contrary to the default of figma-squircle.
    cornerSmoothing: 1,
    width,
    height,
    ...opts,
  };

  console.log("vanillaSquircle", width, height);

  if (!opts.borderWidthPx) {
    el.style.clipPath = `path('${getSvgPath(opts2)}')`;
  } else {
    const firstRender = !el.classList.contains(id);
    let innerEl: HTMLElement;

    if (firstRender) {
      el.classList.add(id);
      innerEl = document.createElement("div");
      innerEl.classList.add(`squircle-inner`);
      innerEl.append(...el.childNodes);
      el.append(innerEl);
    } else {
      innerEl = asNonNullable(el.querySelector(".squircle-inner"));
    }

    Object.assign(el.style, {
      position: "relative",
      clipPath: `path('${getSvgPath(opts2)}')`,
    });

    // TODO: Move to ::before approach to avoid the problems that come with
    // nesting another div. Namely, difficulty to adjust to content dimensions
    // and the drag handle loses focus.
    
    Object.assign(innerEl.style, {
      // position: "absolute",
      // inset: `${opts.borderWidthPx}px`,
      width: `${getContentWidth(el) - opts.borderWidthPx * 2}px`,
      height: `${getContentHeight(el) - opts.borderWidthPx * 2}px`,
      margin: `${opts.borderWidthPx}px`,
      clipPath: `path('${getSvgPath({
        ...opts2,
        width: width - opts.borderWidthPx * 2,
        height: height - opts.borderWidthPx * 2,
        cornerRadius: opts2.cornerRadius - opts.borderWidthPx,
      })}')`,
    });

    // setCss(`
    //   & {
    //     position: relative;
    //     clip-path: path('${getSvgPath(opts2)}');
    //   }

    //   & > div {
    //     position: absolute;
    //     background-color: white;
    //     clip-path: path('${getSvgPath({ ...opts2, width: width - opts.borderWidthPx * 2, height: height - opts.borderWidthPx * 2, cornerRadius: opts2.cornerRadius - opts.borderWidthPx })}');
    //     inset: ${opts.borderWidthPx}px;
    //     display: block;
    //   }
    // `, el, id)
  }
};

const squircleObserver = (el: HTMLElement, opts: Options) => {
  console.log("squircleObserver init");

  const id = createCssId();

  // Initialize as `undefined` to always run directly when instantiating.
  let dimensions: [number, number] | undefined = undefined;

  const func = (newOpts?: Options) => {
    if (newOpts !== undefined) {
      opts = newOpts;
    }

    return vanillaSquircle(el, opts, id);
  };

  const resizeObserver = new ResizeObserver(() => {
    console.log("squircleObserver observing");

    const prevDimemsions = dimensions;
    dimensions = [el.clientWidth, el.clientHeight];

    // Run only if dimensions changed, for performance.
    if (
      prevDimemsions?.[0] !== dimensions[0] ||
      prevDimemsions?.[1] !== dimensions[1]
    ) {
      func();
    }
  });

  // It calls the callback directly.
  resizeObserver.observe(el);

  // The native code `resizeObserver.disconnect` needs the correct context.
  // Retain the context by wrapping in arrow function. Read more about this:
  // https://stackoverflow.com/a/9678166/19306180
  func.disconnect = () => {
    el.classList.remove(id);

    const innerEl = el.querySelector(".squircle-inner");
    if (innerEl) {
      el.append(...innerEl.childNodes);
      innerEl.remove();
    }

    resizeObserver.disconnect();
  };

  return func;
};

type Props = {
  children: ReactNode;
  as?: keyof ReactHTML | ComponentType<any>;
} & Options &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const omitUndefined = <T,>(
  obj: T
): { [key in keyof T]: Exclude<T[key], undefined> } => {
  const result = {} as { [key in keyof T]: Exclude<T[key], undefined> };

  for (const key in obj) {
    if (obj[key] !== undefined) {
      // @ts-ignore
      result[key] = obj[key];
    }
  }

  return result;
};

export const SquircleTodo = forwardRef(
  (
    {
      children,
      as: Component = "div",
      cornerRadius,
      topLeftCornerRadius,
      topRightCornerRadius,
      bottomRightCornerRadius,
      bottomLeftCornerRadius,
      cornerSmoothing,
      preserveSmoothing,
      borderWidthPx,
      ...rest
    }: PropsWithoutRef<Props>,
    forwardedRef
  ): ReactElement => {
    const opts = omitUndefined({
      cornerRadius,
      topLeftCornerRadius,
      topRightCornerRadius,
      bottomRightCornerRadius,
      bottomLeftCornerRadius,
      cornerSmoothing,
      preserveSmoothing,
      borderWidthPx,
    });

    const funcRef = useRef<ReturnType<typeof squircleObserver>>();

    // const WrappedComponent = squircle(Component, opts);

    // return (
    //   <WrappedComponent ref={forwardedRef} {...rest}>
    //     {children}
    //   </WrappedComponent>
    // );

    // useEffect(
    //   () => {
    //     console.log('rerunning', cornerSmoothing)

    //     return funcRef.current?.();
    //   },
    //   [
    //     cornerRadius,
    //     topLeftCornerRadius,
    //     topRightCornerRadius,
    //     bottomRightCornerRadius,
    //     bottomLeftCornerRadius,
    //     cornerSmoothing,
    //     preserveSmoothing,
    //   ]
    // );

    return (
      <Component
        ref={(el: HTMLElement | null) => {
          funcRef.current?.disconnect();

          if (el) {
            funcRef.current = squircleObserver(el, opts);
          }

          if (typeof forwardedRef === "function") {
            forwardedRef(el);
          } else if (forwardedRef) {
            forwardedRef.current = el;
          }
        }}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

/**
 * HOC that wraps `Component` and injects the squircle style.
 */
export const squircle = <P,>(
  Component: keyof ReactHTML | ComponentType<P>,
  opts: Options
) =>
  forwardRef((props: P, forwardedRef): ReactElement => {
    const funcRef = useRef<ReturnType<typeof squircleObserver>>();

    return (
      <Component
        // @ts-ignore
        ref={(el: HTMLElement | null) => {
          funcRef.current?.disconnect();

          if (el) {
            funcRef.current = squircleObserver(el, opts);
          }

          if (typeof forwardedRef === "function") {
            forwardedRef(el);
          } else if (forwardedRef) {
            forwardedRef.current = el;
          }
        }}
        {...props}
      />
    );
  });

// /**
//  * HOC that wraps `Component` and injects the squircle style.
//  */
// export const squircleBorder = <P extends { children: ReactElement },>(
//   Component: keyof ReactHTML | ComponentType<P>,
//   opts: Options & { borderWidth: string }
// ) =>
//   forwardRef(({ children, ...props }: P, ref): ReactElement => {
//     const Outer = squircle('div', opts);
//     const Inner = squircle(Component, { ...opts });

//     return (
//       <Outer {...props} ref={ref} >
//         {/* @ts-ignore */}
//         <Inner>{children}</Inner>
//       </Outer>
//     );
//   });
