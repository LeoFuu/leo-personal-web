// src/components/views/Home/MetalClip.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const MetalClipBack = () => (
  <div 
     className="absolute z-20 pointer-events-none"
     style={{ 
       top: '-34px', left: '6px', width: '24px', height: '80px', borderRadius: '99px',
       background: 'linear-gradient(90deg, #374151 0%, #6B7280 40%, #1F2937 100%)', 
       boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.6)',
       transform: 'rotate(-4deg)',
     }} 
  />
);

export const MetalClipFront = ({ controls }: { controls: any }) => (
  <motion.div 
     className="absolute z-50 pointer-events-none origin-top"
     initial={{
       top: '-32px', left: '8px', width: '24px', height: '80px', borderRadius: '99px',
       background: 'linear-gradient(90deg, #D1D5DB 0%, #FFFFFF 20%, #E5E7EB 50%, #9CA3AF 100%)', 
       boxShadow: 'inset -1px -2px 4px rgba(0,0,0,0.2), 4px 8px 12px rgba(0,0,0,0.5)',
       rotate: -4,
     }}
     style={{ WebkitBackfaceVisibility: 'hidden', willChange: 'transform' }}
     animate={controls}
  >
      <div className="absolute top-[15%] bottom-[15%] left-[50%] w-[2px] bg-black/10 shadow-[inset_1px_0_1px_rgba(255,255,255,0.4)] -translate-x-1/2 rounded-full" />
  </motion.div>
);