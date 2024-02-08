import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const withParentDimensions = <Props extends ParentDimensionsProps>(Component: React.ComponentType<Props>) => {
  const ReturnComponent = (props: Omit<Props, keyof ParentDimensionsProps>) => {
    const [targetRef, parentDimensions] = useParentDimensions();
    const componentProps = { ...props, parentDimensions };
    return (
      <div ref={targetRef} style={{ width: '100%', boxSizing: 'border-box' }}>
        <Component {...(componentProps as Props)} />
      </div>
    );
  };

  return ReturnComponent;
};

export const useParentDimensions = (): [React.RefObject<HTMLDivElement>, { width: number; height: number }] => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const solveDimensions = (target: Element) => {
    const {
      width: widthFromStyle,
      height: heightFromStyle,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = getComputedStyle(target);
    const p = (s: string | null) => (s ? parseFloat(s) : 0);
    const elementWidth = p(widthFromStyle) - p(paddingLeft) - p(paddingRight);
    const elementHeight = p(heightFromStyle) - p(paddingTop) - p(paddingBottom);

    if (width !== elementWidth) {
      setWidth(elementWidth);
    }
    if (height !== elementHeight) {
      setHeight(elementHeight);
    }
  };

  useEffect(() => {
    const sizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => solveDimensions(target));
    });
    if (targetRef.current) {
      sizeObserver.observe(targetRef.current);
    }
    return () => sizeObserver.disconnect();
  }, [targetRef]);

  useLayoutEffect(() => {
    if (targetRef.current) {
      solveDimensions(targetRef.current);
    }
  }, [targetRef]);

  return [targetRef, { width, height }];
};

export interface ParentDimensionsProps {
  parentDimensions: { width: number; height: number };
}
