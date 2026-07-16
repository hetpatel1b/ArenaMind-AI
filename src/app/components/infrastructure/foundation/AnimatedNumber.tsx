'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const AnimatedNumber = React.memo(
  ({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) => {
    const spring = useSpring(value, { stiffness: 400, damping: 30 });
    const display = useTransform(spring, (current) => {
      return current.toFixed(decimals) + suffix;
    });

    useEffect(() => {
      spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
  }
);

AnimatedNumber.displayName = 'AnimatedNumber';
