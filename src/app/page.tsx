// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Home, Book, MessageSquare, Sparkles, ArrowDown, User } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';

import { VoidSpirit } from '../components/features/VoidSpirit';
import { HomeIndex as HomeView } from '../components/views/Home/HomeIndex';
import { NeuralView } from '../components/views/NeuralView';
import { NotesView } from '../components/views/NotesView';
import { GuestbookView } from '../components/views/GuestbookView';

const mixedTimeline = [
  { type: "thought", time: "Today, 10:24 AM", text: "灵感总是转瞬即逝，就像这层磨砂玻璃上的水汽。得赶紧把它写进代码里。" },
  { type: "guestbook", time: "Yesterday, 20:15 PM", user: "匿名极客", message: "这个卡片翻转的物理手感绝了！也是独立开发的吗？", reply: "哈哈感谢！用 Framer Motion 调了很久的弹簧参数，算是对交互的一点小执念 😆" },
  { type: "thought", time: "Oct 24, 14:30 PM", text: "有时候，Bug 是系统在试图和你对话。倾听它，而不是对抗它。" }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null); 
  const [spiritTarget, setSpiritTarget] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [jumpType, setJumpType] = useState<'hop' | 'dive' | 'soar'>('hop'); 
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isNavVisible, setIsNavVisible] = useState(true);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({ jump: null, prepare: null, spirit: null, pageExit: null });

  const { scrollY } = useScroll();
  const rawRotate = useTransform(scrollY, [0, 2000], [0, 1080]); 
  const springRotate = useSpring(rawRotate, { stiffness: 150, damping: 25 });

  useEffect(() => { 
    setTimeout(() => setIsLoaded(true), 50);
    const handleToggle = (e: any) => setIsNavVisible(e.detail);
    window.addEventListener('toggle-navbar', handleToggle);
    return () => window.removeEventListener('toggle-navbar', handleToggle);
  }, []);

  const handleNavClick = (tabId: string) => {
    if (tabId === activeTab || pendingTab === tabId) return;
    Object.values(timers.current).forEach(t => t && clearTimeout(t));
    
    // 强制自动置顶，不给渲染引擎留拖泥带水的机会
    window.scrollTo({ top: 0, behavior: 'auto' });

    const isStartingFromPage = spiritTarget === null;
    setIsPreparing(true);
    setJumpType(isStartingFromPage ? 'dive' : 'hop');

    timers.current.spirit = setTimeout(() => {
        setIsPreparing(false);      
        setSpiritTarget(tabId);     
        setPendingTab(tabId);       
        
        timers.current.pageExit = setTimeout(() => {
            setActiveTab(tabId);
        }, 50);
    }, 150); 

    timers.current.prepare = setTimeout(() => {
        setIsPreparing(true); 
        setJumpType(tabId === 'home' ? 'soar' : 'dive'); 

        timers.current.jump = setTimeout(() => {
            setIsPreparing(false); 
            setSpiritTarget(null); 
            setPendingTab(null);   
        }, 150);
    }, 3150); 
  };

  const navItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'notes', icon: Book, label: '笔记' },
    { id: 'neural', icon: Sparkles, label: 'AI' },
    { id: 'guestbook', icon: MessageSquare, label: '留言' }, 
  ];

  return (
    <div className="relative min-h-screen w-full bg-transparent font-sans text-slate-900 overflow-x-hidden flex flex-col">
      
      <style dangerouslySetInnerHTML={{__html: `
        html, body { overscroll-behavior: none; background-color: #FDFEFE; }
        @keyframes ken-burns {
          0% { transform: scale(1.0) translate(0, 0); }
          50% { transform: scale(1.1) translate(-1%, -1%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }
        .animate-ken-burns { animation: ken-burns 25s infinite ease-in-out; }
      `}} />

      <div className="fixed inset-0 z-0 pointer-events-none bg-[#E2E8F0]"> 
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-0 inset-x-0 h-[80vh]" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 40%, transparent 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#CBD5E1]/80 to-transparent" />
      </div>

      <div className="fixed bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#CBD5E1] via-[#CBD5E1]/80 to-transparent pointer-events-none z-40" />

      {/* 💥 发条悬浮钮：在 AI 页面智能隐身！ */}
      <motion.div
        className="fixed right-6 bottom-32 z-50 w-12 h-12 rounded-full backdrop-blur-xl bg-white/20 border border-white/40 flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ 
          rotate: springRotate,
          // 切到 AI 页时禁用点击
          pointerEvents: activeTab === 'neural' ? 'none' : 'auto'
        }} 
        animate={{
          // 切到 AI 页时，缩小并变透明
          opacity: activeTab === 'neural' ? 0 : 1,
          scale: activeTab === 'neural' ? 0.5 : 1
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="absolute top-1.5 w-1.5 h-1.5 bg-slate-800 rounded-full shadow-sm opacity-80" />
        <div className="w-4 h-4 rounded-full border-[2px] border-slate-800/30 flex items-center justify-center">
           <div className="w-1 h-1 bg-slate-800/60 rounded-full" />
        </div>
      </motion.div>

      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-xl mx-auto w-full px-5 pb-32 pt-10 flex-1"
      >
        {/* 💥 核心修复 1：改回最稳妥的 mode="wait"。只要每个页面的 exit 够快，就不会有任何卡顿，彻底干掉主线程假死！ */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
          <motion.div 
          key="home"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeOut" } }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
          // 💥 给整个首页容器开启最高级别的 GPU 硬件加速！
          // 防止进出场时复杂的子元素（卡牌、模糊）压垮主线程
          style={{ 
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
       >
               <HomeView showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />
               
               <motion.div className="w-full flex justify-center mt-2 mb-4 opacity-40" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                 <div className="flex flex-col items-center gap-1.5">
                   <ArrowDown size={14} className="text-slate-500" />
                 </div>
               </motion.div>

               <div className="relative w-full">
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-white/0 via-white/40 to-white/0" />

                 {mixedTimeline.map((item, idx) => {
                    const isLeft = idx % 2 === 0;
                    const stickyTop = `${100 + idx * 12}px`; 

                    return (
                      <div key={idx} className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'} mb-16 relative`}>
                         <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-[50%] w-[15%]' : 'left-[50%] w-[15%]'} h-[1px] bg-white/30 hidden sm:block`} />
                         
                         <div className="sticky z-20" style={{ top: stickyTop }}>
                           {/* 💥 核心修复 2：把底下长长的时间轴全部改回 whileInView！
                               不让它们在切回首页的瞬间堆积渲染，彻底释放浏览器算力！ */}
                           <motion.div
                               className="w-[240px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-[24px] border border-white/50 bg-white/70 sm:bg-white/40 backdrop-blur-none sm:backdrop-blur-lg overflow-hidden flex flex-col"
                               style={{ rotate: isLeft ? '-1.5deg' : '1.5deg', isolation: 'isolate' }}
                               initial={{ opacity: 0, y: 30 }}
                               whileInView={{ opacity: 1, y: 0 }}
                               viewport={{ margin: "50px", once: true }} 
                               transition={{ type: "spring", stiffness: 200, damping: 20 }}
                             >
                                <div className="px-5 py-3 border-b border-white/30 bg-white/20 flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'guestbook' ? 'bg-blue-400' : 'bg-slate-800/40'}`} />
                                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{item.time}</span>
                                </div>

                                {item.type === 'thought' ? (
                                   <div className="p-5">
                                      <p className="text-[13px] font-bold text-slate-800/90 leading-relaxed tracking-wide">{item.text}</p>
                                   </div>
                                ) : (
                                   <div className="p-4 flex flex-col gap-3">
                                      <div className="flex gap-3 items-start">
                                         <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                                            <User size={12} className="text-blue-500" />
                                         </div>
                                         <div className="flex-1 bg-white/60 rounded-[16px] rounded-tl-none p-3 shadow-sm border border-white/50">
                                            <div className="text-[10px] font-bold text-slate-400 mb-1">{item.user}</div>
                                            <p className="text-[12px] font-medium text-slate-700 leading-relaxed">{item.message}</p>
                                         </div>
                                      </div>
                                   </div>
                                )}
                             </motion.div>
                         </div>
                      </div>
                    );
                 })}

                 <div className="w-full flex justify-center pt-8 pb-20">
                    <motion.div 
                      className="group bg-white/60 sm:bg-white/40 sm:backdrop-blur-xl border border-white/60 rounded-[32px] p-6 flex items-center gap-5 cursor-pointer shadow-lg transition-all active:scale-[0.98]"
                      onClick={() => handleNavClick('guestbook')}
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <MessageSquare size={24} className="text-white/90" />
                      </div>
                      <div className="pr-4">
                        <div className="font-black text-slate-800 text-lg tracking-tight">留下你的足迹</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                          Go to Guestbook <ArrowDown size={10} className="-rotate-90" />
                        </div>
                      </div>
                    </motion.div>
                 </div>
               </div>
            </motion.div>
          )}
          {activeTab === 'neural' && <NeuralView key="neural" showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />}
          {activeTab === 'notes' && <NotesView key="notes" />}
          {activeTab === 'guestbook' && <GuestbookView key="guestbook" />}
        </AnimatePresence>
      </motion.main>

      <motion.div 
        className="fixed bottom-10 inset-x-0 flex justify-center z-50"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isNavVisible ? 0 : 150, opacity: isNavVisible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        <nav className="relative flex items-center p-1 sm:p-1.5 rounded-full">
          
          <div 
             className="absolute inset-0 z-0 rounded-full border border-white/40 pointer-events-none"
             style={{
               background: "rgba(255, 255, 255, 0.4)",
               backdropFilter: "blur(12px) saturate(150%)",
               boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.9)"
             }}
          />

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHighlight = (pendingTab || activeTab) === item.id;
            const showSpirit = spiritTarget === item.id;
            
            return (
              <button key={item.id} onClick={() => handleNavClick(item.id)} className="relative z-10 flex flex-col items-center justify-center w-[68px] sm:w-20 h-14 rounded-full transition-all cursor-pointer active:scale-95 group">
                
                {showSpirit && (
                   <VoidSpirit isNavigating={true} isPreparing={isPreparing} jumpType={jumpType} locationId={`nav-${item.id}`} />
                )}
                
                <item.icon size={20} className={`transition-all duration-300 relative z-10 ${isActive ? 'text-slate-900 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className={`text-[9px] sm:text-[10px] mt-1 font-black tracking-tight transition-all uppercase relative z-10 ${isActive ? 'text-slate-900 opacity-100' : 'text-slate-400 opacity-0'}`}>
                  {item.label}
                </span>
                
                {isHighlight && (
                  <motion.div 
                    layoutId="nav-pill" 
                    transition={{ type: "spring", stiffness: 400, damping: 21, mass: 1 }} 
                    className="absolute inset-0 z-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)", boxShadow: "0 1px 2px rgba(255,255,255,0.4)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </motion.div>
    </div>
  );
}