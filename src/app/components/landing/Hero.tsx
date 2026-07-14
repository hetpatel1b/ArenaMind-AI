'use client';

import React from 'react';
import { HeroBackground } from './hero/HeroBackground';
import { MouseSpotlight } from './hero/MouseSpotlight';
import { HeroHUD } from './hero/HeroHUD';
import { HeroContent } from './hero/HeroContent';
import { ScrollIndicator } from './hero/ScrollIndicator';

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050507',
      }}
      aria-label="ArenaMind AI Command Center"
    >
      <HeroBackground />
      <MouseSpotlight />
      <HeroHUD />
      <HeroContent />
      <ScrollIndicator />
    </section>
  );
}
