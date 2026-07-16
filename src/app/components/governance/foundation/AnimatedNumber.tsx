'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toString(),
  className,
  style,
}: AnimatedNumberProps) {
  const springValue = useSpring(value, { stiffness: 100, damping: 20 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const displayValue = useTransform(springValue, (current) => format(current));

  if (!isClient)
    return (
      <span className={className} style={style}>
        {format(value)}
      </span>
    );

  return (
    <motion.span className={className} style={style}>
      {displayValue}
    </motion.span>
  );
}
