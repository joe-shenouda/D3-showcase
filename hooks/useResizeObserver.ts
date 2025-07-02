
import { useEffect, useState, RefObject } from 'react';

const useResizeObserver = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;
