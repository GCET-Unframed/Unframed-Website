"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

// Scroll-triggered entrance: each instance watches itself with a native
// IntersectionObserver and reveals once, the first time it enters the
// viewport, using a CSS transition for the fade/slide. This is separate
// from the hero's on-load animation (plain CSS keyframes in globals.css,
// driven by inline animation-delay in app/page.tsx) — that one always
// fires immediately on page load regardless of scroll position; this one
// is deliberately scroll-linked, so content below the fold reveals
// progressively as the user scrolls instead of all at once.
export default function FadeIn({
  children = null,
  delay = 0,
  duration = 0.4,
  y = 24,
  x,
  scale,
  ease = "ease-out",
  immediate = false,
  className,
}: {
  children?: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  /** Horizontal offset (px) for a directional/diagonal entrance, e.g. a
   * shape flying in from a corner. Only applied when explicitly passed —
   * omitting it preserves the plain vertical-slide or scale behavior
   * every other caller relies on. */
  x?: number;
  scale?: number;
  /** CSS timing function for the reveal. Defaults to "ease-out". Pass a
   * back-out cubic-bezier (e.g. "cubic-bezier(0.34, 1.56, 0.64, 1)") for
   * a slight overshoot-then-settle bounce. */
  ease?: string;
  /** Reveal on mount instead of waiting for IntersectionObserver. Use
   * this for elements that are always above the fold (e.g. part of the
   * hero) — near the viewport edge, an element can fail the intersection
   * check on first paint and appear to never animate in. */
  immediate?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  let hiddenTransform: string;
  if (x !== undefined) {
    hiddenTransform = `translate(${x}px, ${y}px)${
      scale !== undefined ? ` scale(${scale})` : ""
    }`;
  } else if (scale !== undefined) {
    hiddenTransform = `scale(${scale})`;
  } else {
    hiddenTransform = `translateY(${y}px)`;
  }

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : hiddenTransform,
    transition: `opacity ${duration}s ${ease} ${delay}s, transform ${duration}s ${ease} ${delay}s`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
