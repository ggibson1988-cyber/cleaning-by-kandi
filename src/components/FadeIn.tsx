import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
  as?: keyof typeof motion;
}

const EASING = [0.16, 1, 0.3, 1] as const;

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === 'up' ? 28 : 0,
        x: direction === 'left' ? -28 : direction === 'right' ? 28 : 0,
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, x: 0 }
          : {}
      }
      transition={{ duration: 0.65, delay, ease: EASING }}
    >
      {children}
    </motion.div>
  );
}
