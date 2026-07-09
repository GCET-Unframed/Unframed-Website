"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function FadeIn({
  children = null,
  delay = 0,
  duration = 0.6,
  y = 24,
  scale,
  className,
}: {
  children?: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  className?: string;
}) {
  const initial: Record<string, number> = { opacity: 0, y };
  const animate: Record<string, number> = { opacity: 1, y: 0 };
  if (scale !== undefined) {
    initial.scale = scale;
    animate.scale = 1;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
