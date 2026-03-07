// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Home, Book, MessageSquare, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { LiquidFilters } from '../components/ui/LiquidFilters';
import { VoidSpirit } from '../components/features/VoidSpirit';
import { HomeView } from '../components/views/HomeView';
import { NeuralView } from '../components/views/NeuralView';

// 简易视图：笔记与留言板（后续你可以在 config 里扩展）
const NotesView = (props: any) => <div className="text-white pt-12 p-4"><h2>Digital Garden</h2><p className="text-white/30">功能开发中...</p></div>;
const GuestbookView = (props: any) => <div className="text-white pt-12 p-4"><h2>Guestbook</h2><p className="text-white/30">功能开发中...</p></div>;

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null); 
  const [isPreparing, setIsPreparing] = useState(false);
  const [jumpType, setJumpType] = useState<'hop' | 'dive' | 'soar'>('hop'); 
  const [isLoaded, setIsLoaded] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({ jump: null, prepare: null, hop: null });

  useEffect(() => { setIsLoaded(true); }, []);

  const handleNavClick = (tabId: string) => {
    if (tabId === activeTab) return;
    
    Object.values(timers.current).forEach(t => t && clearTimeout(t));
    
    if (pendingTab === null) {
        setJumpType('dive'); setIsPreparing(true);
        timers.current.hop = setTimeout(() => {
            setIsPreparing(false); setPendingTab(tabId); 
            setTimeout(() => { setActiveTab(tabId); }, 50); 
        }, 200);
    } else {
        setJumpType('hop'); setIsPreparing(false); setPendingTab(tabId); 
        setTimeout(() => { setActiveTab(tabId); }, 300);
    }

    timers.current.prepare = setTimeout(() => { setJumpType('soar'); setIsPreparing(true); }, 2700);
    timers.current.jump = setTimeout(() => { setPendingTab(null); setIsPreparing(false); }, 3000); 
  };

  const navItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'notes', icon: Book, label: '笔记' },
    { id: 'neural', icon: Sparkles, label: 'AI' },
    { id: 'guestbook', icon: MessageSquare, label: '留言' }, 
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#050505] font-sans text-white overflow-hidden flex flex-col">
      <LiquidFilters />
      
      {/* 背景层 */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#010101]">
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_transparent_70%)] opacity-40 blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150" />
      </div>

      <main className={`relative z-10 max-w-xl mx-auto w-full px-5 pb-40 pt-10 flex-1 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" onNavigate={handleNavClick} showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />}
          {activeTab === 'neural' && <NeuralView key="neural" showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />}
          {activeTab === 'notes' && <NotesView key="notes" />}
          {activeTab === 'guestbook' && <GuestbookView key="guestbook" />}
        </AnimatePresence>
      </main>

      {/* 底部导航栏 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <nav className="relative flex items-center p-2 rounded-full bg-[#1c1c1e]/60 backdrop-blur-[50px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isTarget = pendingTab === item.id;
            
            return (
              <button key={item.id} onClick={() => handleNavClick(item.id)} className="relative z-10 flex flex-col items-center justify-center w-20 h-14 rounded-full transition-all cursor-pointer active:scale-95">
                {isTarget && (
                   <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-50">
                      <VoidSpirit isNavigating={true} isPreparing={isPreparing} jumpType={jumpType} locationId={`nav-${item.id}`} />
                   </div>
                )}
                <item.icon size={22} className={`transition-all duration-300 ${isActive ? 'text-white scale-110 drop-shadow-md' : 'text-white/30 group-hover:text-white/60'}`} />
                <span className={`text-[9px] mt-1 font-bold tracking-tight transition-all ${isActive ? 'text-white opacity-100' : 'text-white/0 opacity-0'}`}>{item.label}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill" 
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} 
                    className="absolute inset-0 z-[-1] rounded-full"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)" }}
                  >
                    <div className="absolute inset-0 rounded-full" style={{ filter: 'url(#liquid-distortion)' }} />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}