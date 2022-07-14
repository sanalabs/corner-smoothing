import React, {
  ComponentType,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  PropsWithoutRef,
  ReactElement,
  ReactHTML,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { getSvgPath, FigmaSquircleParams } from "figma-squircle";

type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type Options = Require<
  Omit<FigmaSquircleParams, "width" | "height">,
  "cornerRadius"
>;

const vanillaSquircle = (el: HTMLElement, opts: Options) => {
  const width = el.clientWidth;
  const height = el.clientHeight;
  const opts2 = {
    preserveSmoothing: true, // Default to true, contrary to the default of figma-squircle.
    width,
    height,
    ...opts,
  }
  console.log('vanillaSquircle', opts2, opts)
  const path = getSvgPath(opts2);
  el.style.clipPath = `path('${path}')`;
};

const squircleObserver = (el: HTMLElement, opts: Options) => {
  console.log('squircleObserver init')
  
  // Initialize as `undefined` to always run directly when instantiating.
  let dimensions: [number, number] | undefined = undefined;

  const func = (newOpts?: Options) => {
    if (newOpts !== undefined) {
      opts = newOpts;
    }

    return vanillaSquircle(el, opts);
  };

  const resizeObserver = new ResizeObserver(() => {
    console.log('squircleObserver observing')
    
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
  func.disconnect = () => resizeObserver.disconnect();

  return func;
};

type Props = {
  children: ReactNode;
  as?: keyof ReactHTML | ComponentType<any>;
} & Options &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

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
      ...rest
    }: PropsWithoutRef<Props>,
    forwardedRef
  ): ReactElement => {
    const opts = {
      cornerRadius,
      topLeftCornerRadius,
      topRightCornerRadius,
      bottomRightCornerRadius,
      bottomLeftCornerRadius,
      cornerSmoothing,
      preserveSmoothing,
    };

    // Remove keys with value `undefined` since they may receive default
    ;(Object.keys(opts) as (keyof typeof opts)[]).forEach((key) => {
      if (opts[key] === undefined) {
        delete opts[key];
      }
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
