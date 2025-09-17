import {useEffect, useRef, useState} from "react";

export const IN_VIEW_THRESHOLD = 0.2;

export function useInView(threshold = IN_VIEW_THRESHOLD) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {threshold},
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return {ref, inView};
}
