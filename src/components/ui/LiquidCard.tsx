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
      glass-card group
      ${hover ? 'active:scale-[0.98] cursor-pointer' : ''}
      ${className}
    `}
  >
    {/* 保留你原本极其优秀的顶部高光反射，这能增加苹果风的质感 */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 blur-[0.5px]" />
    {children}
  </div>
);