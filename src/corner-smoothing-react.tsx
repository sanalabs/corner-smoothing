import React, {
  ComponentType,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactHTML,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { Options, squircleObserver } from "./corner-smoothing-vanilla";

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

type Props = {
  children: ReactNode;
  as?: keyof ReactHTML | ComponentType<any>;
} & Options &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Squircle = forwardRef<unknown, Props>(
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
      borderWidth,
      ...rest
    },
    forwardedRef
  ): ReactElement => {
    const funcRef = useRef<ReturnType<typeof squircleObserver>>();

    const refCallback = useCallback(
      (el: HTMLElement | null) => {
        const opts = omitUndefined({
          cornerRadius,
          topLeftCornerRadius,
          topRightCornerRadius,
          bottomRightCornerRadius,
          bottomLeftCornerRadius,
          cornerSmoothing,
          preserveSmoothing,
          borderWidth,
        });

        funcRef.current?.disconnect();

        if (el) {
          funcRef.current = squircleObserver(el, opts);
        }

        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef) {
          forwardedRef.current = el;
        }
      },
      [
        cornerRadius,
        topLeftCornerRadius,
        topRightCornerRadius,
        bottomRightCornerRadius,
        bottomLeftCornerRadius,
        cornerSmoothing,
        preserveSmoothing,
        borderWidth,
      ]
    );

    return (
      <Component ref={refCallback} {...rest}>
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

    const refCallback = useCallback(
      (el: HTMLElement | null) => {
        funcRef.current?.disconnect();

        if (el) {
          funcRef.current = squircleObserver(el, opts);
        }

        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef) {
          forwardedRef.current = el;
        }
      },
      [opts]
    );

    // @ts-ignore
    return <Component ref={refCallback} {...props} />;
  });
