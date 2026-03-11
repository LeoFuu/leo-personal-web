// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Book, MessageSquare, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

import { VoidSpirit } from '../components/features/VoidSpirit';
import { HomeIndex as HomeView } from '../components/views/Home/HomeIndex';
import { NeuralView } from '../components/views/NeuralView';
import { NotesView } from '../components/views/NotesView';
import { GuestbookView } from '../components/views/GuestbookView';

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null); 
  const [spiritTarget, setSpiritTarget] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [jumpType, setJumpType] = useState<'hop' | 'dive' | 'soar'>('hop'); 
  
  const [bootState, setBootState] = useState<'booting' | 'clearing' | 'ready'>('booting');
  const [isNavVisible, setIsNavVisible] = useState(true);
  
  const timers = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({ jump: null, prepare: null, spirit: null, pageExit: null });
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollY } = useScroll();
  const rawRotate = useTransform(scrollY, [0, 2000], [0, 1080]); 
  const springRotate = useSpring(rawRotate, { stiffness: 150, damping: 25 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (activeTab !== 'home' && activeTab !== 'notes') return;
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 100) {
      setIsNavVisible(false);
    } else if (latest < previous || latest <= 100) {
      setIsNavVisible(true);
    }
  });

  const triggerClearing = useCallback(() => {
    setBootState(prev => (prev === 'booting' ? 'clearing' : prev));
  }, []);

  // 💥 微信黑屏终极克星：强制唤醒播放 Hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video || bootState !== 'booting') return;

    const forcePlay = () => {
      video.play().catch(() => {
        // 如果连物理点击都被浏览器无情拒绝，直接跳过黑屏动画进网站！不能让用户干等！
        triggerClearing();
      });
    };

    // 魔法 1：监听微信专属的底层 JSBridge 准备就绪事件
    if ((window as any).WeixinJSBridge) {
      forcePlay();
    } else {
      document.addEventListener("WeixinJSBridgeReady", forcePlay, false);
    }

    // 魔法 2：触屏保底。只要用户手指碰了一下屏幕（任何地方），立刻强制唤醒视频！
    const handleTouch = () => {
      forcePlay();
      document.removeEventListener('touchstart', handleTouch);
    };
    document.addEventListener('touchstart', handleTouch, { once: true });

    return () => {
      document.removeEventListener("WeixinJSBridgeReady", forcePlay, false);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [bootState, triggerClearing]);

  // 保底安全定时器
  useEffect(() => { 
    // 把 5 秒缩短到 4 秒，防止用户失去耐心
    const safetyTimer = setTimeout(() => { triggerClearing(); }, 4000); 
    const handleToggle = (e: any) => setIsNavVisible(e.detail);
    window.addEventListener('toggle-navbar', handleToggle);
    return () => { clearTimeout(safetyTimer); window.removeEventListener('toggle-navbar', handleToggle); };
  }, [triggerClearing]);

  useEffect(() => {
    let readyTimer: ReturnType<typeof setTimeout> | null = null;
    if (bootState === 'clearing') { readyTimer = setTimeout(() => { setBootState('ready'); }, 1200); }
    return () => { if(readyTimer) clearTimeout(readyTimer); };
  }, [bootState]);

  const handleNavClick = (tabId: string) => {
    if (tabId === activeTab || pendingTab === tabId) return;
    
    Object.values(timers.current).forEach(t => t && clearTimeout(t));
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (tabId === 'neural') {
      setIsPreparing(true);
      setJumpType('dive');
      timers.current.spirit = setTimeout(() => {
          setIsPreparing(false); 
          setSpiritTarget(tabId); 
          setPendingTab(tabId);       
          timers.current.pageExit = setTimeout(() => { 
            setActiveTab(tabId); 
            setSpiritTarget(null); 
          }, 100); 
      }, 150); 
      return; 
    }

    const isStartingFromPage = spiritTarget === null;
    setIsPreparing(true);
    setJumpType(isStartingFromPage ? 'dive' : 'hop');

    timers.current.spirit = setTimeout(() => {
        setIsPreparing(false); 
        setSpiritTarget(tabId); 
        setPendingTab(tabId);       
        timers.current.pageExit = setTimeout(() => { setActiveTab(tabId); }, 50);
    }, 150); 

    if (tabId === 'notes' || tabId === 'guestbook') {
      return;
    }

    if (tabId === 'home') {
      timers.current.prepare = setTimeout(() => {
          setIsPreparing(true); 
          setJumpType('soar'); 
          timers.current.jump = setTimeout(() => {
              setIsPreparing(false); 
              setSpiritTarget(null); 
              setPendingTab(null);   
          }, 150);
      }, 1000); 
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'notes', icon: Book, label: '笔记' },
    { id: 'neural', icon: Sparkles, label: 'AI' },
    { id: 'guestbook', icon: MessageSquare, label: '留言' }, 
  ];

  return (
    <div className="relative min-h-screen w-full bg-transparent font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `html, body { overscroll-behavior: none; background-color: #FDFEFE; }`}} />

      {/* 1. 开机动画层 */}
      <AnimatePresence>
        {bootState !== 'ready' && (
          <motion.div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center pointer-events-none" initial={{ opacity: 1 }} animate={{ opacity: bootState === 'clearing' ? 0 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <motion.div className="flex flex-col items-center justify-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
               <div className="relative group">
                   <div className="absolute inset-[-10%] sm:inset-[-20%] z-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 80%)" }} />
                   
                   {/* 💥 微信视频保命全家桶属性：webkit-playsinline, x5-playsinline, x5-video-player-type */}
                   <video 
                     ref={videoRef} 
                     src="/start.mp4" 
                     autoPlay 
                     muted 
                     playsInline 
                     webkit-playsinline="true" 
                     x5-playsinline="true" 
                     x5-video-player-type="h5" 
                     x5-video-player-fullscreen="false" 
                     preload="auto" 
                     className="w-[260px] sm:w-[320px] h-auto object-contain pointer-events-auto" 
                     onCanPlay={() => { videoRef.current?.play().catch(() => {}); }} 
                     onEnded={triggerClearing} 
                     onError={triggerClearing} 
                   />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 静态背景层 */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#E2E8F0]"> 
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 inset-x-0 h-[80vh] bg-gradient-to-b from-white via-white/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#CBD5E1]/80 to-transparent" />
      </div>

      {/* 3. 回到顶部按钮 */}
      <motion.div className="fixed right-6 bottom-32 z-50 w-12 h-12 rounded-full backdrop-blur-xl bg-white/20 border border-white/40 flex items-center justify-center cursor-pointer shadow-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ rotate: springRotate, display: activeTab === 'neural' ? 'none' : 'flex' }}>
        <div className="w-4 h-4 rounded-full border-[2px] border-slate-800/30 flex items-center justify-center"><div className="w-1 h-1 bg-slate-800/60 rounded-full" /></div>
      </motion.div>

      {/* 4. 路由内容区 */}
      <motion.main className="relative z-10 max-w-xl mx-auto w-full px-5 pb-32 pt-10 flex-1" initial={{ opacity: 0, y: 40 }} animate={bootState !== 'booting' ? { opacity: 1, y: 0 } : {}}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeView 
              key="home" 
              showSpiritHere={pendingTab === null} 
              isPreparing={isPreparing} 
              jumpType={jumpType} 
              onNavigate={handleNavClick}
            />
          )}
          {activeTab === 'neural' && <NeuralView key="neural" showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />}
          {activeTab === 'notes' && <NotesView key="notes" />}
          {activeTab === 'guestbook' && <GuestbookView key="guestbook" />}
        </AnimatePresence>
      </motion.main>

      {/* 5. 底部导航栏 */}
      <motion.div className="fixed bottom-10 inset-x-0 flex justify-center z-50" initial={{ y: 150 }} animate={{ y: isNavVisible ? 0 : 150 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }}>
        <nav className="relative flex items-center p-1.5 rounded-full backdrop-blur-xl bg-white/40 border border-white/40 shadow-xl">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item.id)} className="relative z-10 flex flex-col items-center justify-center w-20 h-14 rounded-full transition-all active:scale-95 group">
              {spiritTarget === item.id && <VoidSpirit isNavigating={true} isPreparing={isPreparing} jumpType={jumpType} locationId={`nav-${item.id}`} />}
              <item.icon size={20} className={`transition-all duration-300 ${activeTab === item.id ? 'text-slate-900 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className={`text-[10px] mt-1 font-black transition-all ${activeTab === item.id ? 'text-slate-900 opacity-100' : 'opacity-0'}`}>{item.label}</span>
              {(pendingTab || activeTab) === item.id && <motion.div layoutId="nav-pill" className="absolute inset-0 z-0 rounded-full bg-black/5" />}
            </button>
          ))}
        </nav>
      </motion.div>
    </div>
  );
}