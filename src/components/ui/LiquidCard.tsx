// src/components/ui/LiquidCard.tsx
import React from 'react';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({ 
  children, 
  className = "", 
  hover = true, 
  onClick 
}) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-[28px] md:rounded-[32px] 
      bg-[#121212]/60 
      backdrop-blur-[40px] backdrop-saturate-[180%]
      border border-white/[0.08]
      shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]
      transition-all duration-300
      group
      ${hover ? 'active:scale-[0.98] cursor-pointer hover:bg-[#1a1a1a]/80 hover:border-white/20' : ''}
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 blur-[0.5px]" />
    {children}
  </div>
);