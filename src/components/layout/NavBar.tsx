// src/components/layout/NavBar.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VoidSpirit } from '../features/VoidSpirit';

export interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

interface NavBarProps {
  navItems: NavItem[];
  activeTab: string;
  spiritTarget: string | null;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
  onNavClick: (id: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ navItems, activeTab, spiritTarget, isPreparing, jumpType, onNavClick }) => {
  // 💥 1. 导航栏的“能见度”状态
  const [isVisible, setIsVisible] = useState(true);

  // 💥 2. 监听来自详情弹窗的“隐身/现身”指令
  useEffect(() => {
    const handleToggle = (e: any) => setIsVisible(e.detail);
    window.addEventListener('toggle-navbar', handleToggle);
    return () => window.removeEventListener('toggle-navbar', handleToggle);
  }, []);

  return (
    <div id="global-navbar" className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      {/* 💥 3. 专门负责坠落动画的动效层，完美避开 transform 冲突 */}
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : 120,    // 隐藏时往下掉 120px 沉入底边
          opacity: isVisible ? 1 : 0 // 同时渐隐
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        <nav className="relative flex items-center p-1.5 rounded-full">
          
          {/* 底板：磨砂与噪点 */}
          <div 
             className="absolute inset-0 z-0 rounded-full overflow-hidden border border-white/40 pointer-events-none"
             style={{
               background: "rgba(255, 255, 255, 0.25)",
               backdropFilter: "blur(12px) saturate(200%) contrast(110%)",
               boxShadow: `
                 0 30px 60px -12px rgba(0,0,0,0.15),
                 inset 0 1px 1px rgba(255,255,255,0.9),
                 inset 0 -1px 3px rgba(0,0,0,0.05)
               `
             }}
          >
             <div className="absolute inset-0 frost-noise pointer-events-none" />
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const showSpirit = spiritTarget === item.id;
            
            return (
              <button key={item.id} onClick={() => onNavClick(item.id)} className="relative z-10 flex flex-col items-center justify-center w-20 h-14 rounded-full transition-all cursor-pointer active:scale-95 group">
                
                {/* 💥 终极修复保持原样：完美的小精灵定位 */}
                {showSpirit && (
                   <div className="absolute top-2 left-0 right-0 flex justify-center z-50 pointer-events-none">
                      <VoidSpirit isNavigating={true} isPreparing={isPreparing} jumpType={jumpType} locationId={`nav-${item.id}`} />
                   </div>
                )}
                
                <item.icon size={22} className={`transition-all duration-300 relative z-10 ${isActive ? 'text-slate-900 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className={`text-[9px] mt-1 font-black tracking-tight transition-all uppercase relative z-10 ${isActive ? 'text-slate-900 opacity-100' : 'text-slate-400 opacity-0'}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill" 
                    // 💥 你最爱的清脆果冻弹力公式！
                    transition={{ type: "spring", stiffness: 400, damping: 21, mass: 1 }} 
                    className="absolute inset-0 z-0 rounded-full"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.01) 100%)", 
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05), 0 1px 2px rgba(255,255,255,0.4)" 
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </motion.div>
    </div>
  );
};