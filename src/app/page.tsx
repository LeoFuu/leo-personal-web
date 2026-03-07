// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Home, Book, MessageSquare, Sparkles, ArrowDown } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';

import { LiquidFilters } from '../components/ui/LiquidFilters';
import { VoidSpirit } from '../components/features/VoidSpirit';
import { HomeView } from '../components/views/HomeView';
import { NeuralView } from '../components/views/NeuralView';

const NotesView = (props: any) => <div className="text-slate-800 pt-12 p-4"><h2>Digital Garden</h2><p className="text-slate-500">功能开发中...</p></div>;
const GuestbookView = (props: any) => <div className="text-slate-800 pt-12 p-4"><h2>Guestbook</h2><p className="text-slate-500">功能开发中...</p></div>;

/* ========================================================================
   📝 时间线随笔数据 (Timeline Data) - 最新发布在最上面
   ======================================================================== */
const thoughtsTimeline = [
  { 
    time: "Today, 10:24 AM", 
    text: "灵感总是转瞬即逝，就像这层磨砂玻璃上的水汽。得赶紧把它写进代码里。" 
  },
  { 
    time: "Yesterday, 23:15 PM", 
    text: "重构了一遍路由逻辑，感觉就像把乱糟糟的房间打扫干净了，神清气爽。" 
  },
  { 
    time: "Oct 24, 14:30 PM", 
    text: "有时候，Bug 是系统在试图和你对话。倾听它，而不是对抗它。" 
  },
  { 
    time: "Oct 22, 09:00 AM", 
    text: "比起完美的架构，我更喜欢有生命力的代码。能跑起来，就有它的倔强。" 
  },
  { 
    time: "Oct 18, 16:45 PM", 
    text: "独立开发不仅是写代码，更是对产品灵魂的雕琢。" 
  }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null); 
  const [isPreparing, setIsPreparing] = useState(false);
  const [jumpType, setJumpType] = useState<'hop' | 'dive' | 'soar'>('hop'); 
  const [isLoaded, setIsLoaded] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({ jump: null, prepare: null, hop: null });

  // 💥 获取全局滚动进度
  const { scrollY } = useScroll();
  
  // 💥 极简张力旋钮逻辑：页面向下滚动时，旋钮累积旋转角度
  const rawRotate = useTransform(scrollY, [0, 2000], [0, 1080]); // 滚到底部大概转3圈
  const springRotate = useSpring(rawRotate, { stiffness: 150, damping: 25 });

  useEffect(() => { setIsLoaded(true); }, []);

  const handleNavClick = (tabId: string) => {
    if (tabId === activeTab) return;
    Object.values(timers.current).forEach(t => t && clearTimeout(t));
    if (pendingTab === null) {
        setJumpType('dive'); setIsPreparing(true);
        timers.current.hop = setTimeout(() => {
            setIsPreparing(false); setPendingTab(tabId); 
            setTimeout(() => { setActiveTab(tabId); }, 50); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
    } else {
        setJumpType('hop'); setIsPreparing(false); setPendingTab(tabId); 
        setTimeout(() => { 
          setActiveTab(tabId); 
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
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
    <div className="relative min-h-screen w-full bg-transparent font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <LiquidFilters />
      
      {/* 极品景深呼吸动画 */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.0) translate(0, 0); }
          50% { transform: scale(1.1) translate(-1%, -1%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }
        .animate-ken-burns {
          animation: ken-burns 25s infinite ease-in-out;
        }
      `}</style>

      {/* ========================================================
          🎨 底层背景：你最满意的那个原版高清图 + 高级模糊遮罩
          ======================================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#FDFEFE]">
         <div 
           className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center animate-ken-burns" 
           style={{ filter: 'contrast(1.02) brightness(1.01)' }} 
         />
         <div className="absolute inset-0 bg-white/30 backdrop-blur-[45px] mix-blend-overlay" />
      </div>

      {/* ========================================================
          ⚙️ 核心设计改版：极简张力回弹旋钮 (Tension Dial)
          ======================================================== */}
      <motion.div
        className="fixed right-6 bottom-32 z-50 w-12 h-12 rounded-full backdrop-blur-xl bg-white/20 border border-white/40 flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ rotate: springRotate }} // 物理联动旋转
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Release Tension (Back to Top)"
      >
        {/* 旋钮外部的刻度点 (指示张力累积) */}
        <div className="absolute top-1.5 w-1.5 h-1.5 bg-slate-800 rounded-full shadow-sm opacity-80 group-hover:bg-black transition-colors" />
        {/* 内部的机械转轴 */}
        <div className="w-4 h-4 rounded-full border-[2px] border-slate-800/30 flex items-center justify-center">
           <div className="w-1 h-1 bg-slate-800/60 rounded-full" />
        </div>
      </motion.div>
      {/* ======================================================== */}

      {/* 主体内容视图区 */}
      <main className={`relative z-10 max-w-xl mx-auto w-full px-5 pb-40 pt-10 flex-1 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home">
               {/* 顶部主名片和项目卡片 (完美保留你定稿的版本) */}
               <HomeView onNavigate={handleNavClick} showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />
               
               {/* 下滑提示标 */}
               <motion.div className="w-full flex justify-center mt-16 mb-8 opacity-40" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                 <div className="flex flex-col items-center gap-1.5">
                   <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">Scroll down to explore</span>
                   <ArrowDown size={14} className="text-slate-500" />
                 </div>
               </motion.div>

               {/* ========================================================
                   📝 左右交替的时间线瀑布流 (Timeline Glass Post-its)
                   ======================================================== */}
               <div className="relative w-full pb-[20vh] mt-10">
                 {/* 贯穿始终的中央透明轴线 */}
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-white/0 via-white/40 to-white/0" />

                 {thoughtsTimeline.map((thought, idx) => {
                    const isLeft = idx % 2 === 0;
                    // 让堆叠的高度随着 idx 微微错开，形成像洗牌一样的折叠效果
                    const stickyTop = `${100 + idx * 12}px`; 

                    return (
                      <div key={idx} className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'} mb-24 relative`}>
                         
                         {/* 连接中央轴线的横向短线指示器 */}
                         <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-[50%] w-[15%]' : 'left-[50%] w-[15%]'} h-[1px] bg-white/30 hidden sm:block`} />
                         
                         <motion.div
                           // 💥 依然保留 sticky，往下滚时会自动吸附在顶部！
                           className="sticky w-[220px] p-5 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col gap-2 border border-white/40"
                           style={{ 
                              top: stickyTop, // 动态叠加高度
                              rotate: isLeft ? '-2deg' : '2deg', // 左右微微倾斜不同角度
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                           }}
                           initial={{ opacity: 0, y: 40 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ margin: "-50px", once: false }}
                         >
                           {/* 时间戳 (Timestamp) */}
                           <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-800/40" />
                              <span className="text-[9px] font-mono font-bold text-slate-800/50 uppercase tracking-widest">
                                {thought.time}
                              </span>
                           </div>

                           {/* 随笔正文 */}
                           <p className="text-[12px] font-bold text-slate-800/90 leading-relaxed tracking-wide">
                             {thought.text}
                           </p>
                         </motion.div>
                      </div>
                    );
                 })}
               </div>
               {/* ======================================================== */}
            </motion.div>
          )}
          {activeTab === 'neural' && <NeuralView key="neural" showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />}
          {activeTab === 'notes' && <NotesView key="notes" />}
          {activeTab === 'guestbook' && <GuestbookView key="guestbook" />}
        </AnimatePresence>
      </main>

      {/* 底部导航栏保持不变 */}
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