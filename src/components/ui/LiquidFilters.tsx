// src/components/ui/LiquidFilters.tsx
import React from 'react';

export const LiquidFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="liquid-distortion">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="warp" />
        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="8" in="SourceGraphic" in2="warp" />
      </filter>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    </defs>
  </svg>
);