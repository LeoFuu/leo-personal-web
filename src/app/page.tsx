// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Book, MessageSquare, Sparkles, Music, VolumeX } from 'lucide-react'; // 💥 引入音乐图标
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

import { supabase } from '../lib/supabase';
import { VoidSpirit } from '../components/features/VoidSpirit';
import { HomeIndex as HomeView } from '../components/views/Home/HomeIndex';
import { NeuralView } from '../components/views/NeuralView';
import { NotesView } from '../components/views/NotesView';
import { GuestbookView } from '../components/views/GuestbookView';

// 💥 全局唯一的音频上下文，拯救手机 CPU！
let globalAudioCtx: any = null;

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null); 
  const [spiritTarget, setSpiritTarget] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [jumpType, setJumpType] = useState<'hop' | 'dive' | 'soar'>('hop'); 
  
  const [bootState, setBootState] = useState<'booting' | 'clearing' | 'ready'>('booting');
  const [isNavVisible, setIsNavVisible] = useState(true);
  
  // 💥 全宇宙跳跃次数统计
  const [globalJumps, setGlobalJumps] = useState<number>(0);

  // 💥 新增：背景音乐播放状态
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  
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

  // 💥 背景音乐播放/暂停逻辑
  const toggleMusic = () => {
    if (!bgMusicRef.current) return;
    if (isPlayingMusic) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play().catch(err => console.log("播放被拦截", err));
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  // 在已有的 useEffect 里，或者新建一个
  useEffect(() => {
    if (bgMusicRef.current) {
      // 💥 调整 BGM 音量：0.0 到 1.0 之间。0.3 就是 30% 音量，非常适合做背景音
      bgMusicRef.current.volume = 0.15; 
    }
  }, []);

  // 💥 监听全局跳跃事件 & 同步 Supabase
  useEffect(() => {
    const fetchGlobalJumps = async () => {
      try {
        const { data } = await supabase.from('spirit_stats').select('total_jumps').eq('id', 1).single();
        if (data) setGlobalJumps(data.total_jumps);
      } catch (err) {
        console.error("无法读取跳跃次数", err);
      }
    };
    fetchGlobalJumps();

    // 2. 接收来自四面八方的跳跃信号
    const handleGlobalJump = () => {
      setGlobalJumps(prev => prev + 1);
      
      // 💥 极致性能优化：复用 AudioContext，解决手机端爆音和卡顿！
      try {
        if (typeof window !== 'undefined') {
          if (!globalAudioCtx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            globalAudioCtx = new AudioContextClass();
          }
          // 苹果设备安全策略：如果是挂起状态，先恢复它
          if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume();
          }

          const osc = globalAudioCtx.createOscillator();
          const gain = globalAudioCtx.createGain();
          
          osc.type = 'sine'; 
          osc.frequency.setValueAtTime(300, globalAudioCtx.currentTime); 
          osc.frequency.exponentialRampToValueAtTime(600, globalAudioCtx.currentTime + 0.1); 
          
          gain.gain.setValueAtTime(0.7, globalAudioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.15);

          osc.connect(gain);
          gain.connect(globalAudioCtx.destination);
          
          osc.start();
          osc.stop(globalAudioCtx.currentTime + 0.2);
        }
      } catch (e) {
        console.warn("Audio play failed:", e);
      }

      // 异步告诉 Supabase 数据库加一
      supabase.rpc('increment_spirit_jumps').then();
    };

    window.addEventListener('trigger-spirit-jump', handleGlobalJump);
    return () => window.removeEventListener('trigger-spirit-jump', handleGlobalJump);
  }, []);

  const triggerClearing = useCallback(() => {
    setBootState(prev => (prev === 'booting' ? 'clearing' : prev));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || bootState !== 'booting') return;
    const forcePlay = () => { video.play().catch(() => { triggerClearing(); }); };
    if ((window as any).WeixinJSBridge) { forcePlay(); } 
    else { document.addEventListener("WeixinJSBridgeReady", forcePlay, false); }
    const handleTouch = () => { forcePlay(); document.removeEventListener('touchstart', handleTouch); };
    document.addEventListener('touchstart', handleTouch, { once: true });
    return () => {
      document.removeEventListener("WeixinJSBridgeReady", forcePlay, false);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [bootState, triggerClearing]);

  useEffect(() => { 
    const safetyTimer = setTimeout(() => { triggerClearing(); }, 1000); 
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
    window.dispatchEvent(new CustomEvent('trigger-spirit-jump'));
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

    if (tabId === 'notes' || tabId === 'guestbook') { return; }

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

      {/* 💥 背景音乐组件：隐藏在页面中 */}
      <audio ref={bgMusicRef} src="/BackMusic.mp3" loop />

      <AnimatePresence>
        {bootState !== 'ready' && (
          <motion.div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center pointer-events-none" initial={{ opacity: 1 }} animate={{ opacity: bootState === 'clearing' ? 0 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <motion.div className="flex flex-col items-center justify-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
               <div className="relative group">
                   <div className="absolute inset-[-10%] sm:inset-[-20%] z-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 80%)" }} />
                   <video 
                     ref={videoRef} 
                     src="/start.mp4" 
                     autoPlay 
                     muted 
                     playsInline 
                     {...{
                       "webkit-playsinline": "true",
                       "x5-playsinline": "true",
                       "x5-video-player-type": "h5",
                       "x5-video-player-fullscreen": "false"
                     }}
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

      <div className="fixed inset-0 z-0 pointer-events-none bg-[#E2E8F0]"> 
        <div className="absolute inset-0 opacity-[0.04] hidden sm:block" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 inset-x-0 h-[80vh] bg-gradient-to-b from-white via-white/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#CBD5E1]/80 to-transparent" />
      </div>

      💥 新增：背景音乐控制器 (左上角)
      {/* <motion.div 
        className="fixed top-6 left-6 sm:top-10 sm:left-10 z-[100] flex flex-col items-start justify-center cursor-pointer group"
        onClick={toggleMusic}
        style={{ display: activeTab === 'neural' ? 'none' : 'flex' }}
      >
        <span className="text-[9px] font-black text-slate-400/80 tracking-widest uppercase mb-1.5 drop-shadow-sm ml-1">BGM</span>
        <div className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-center gap-2 group-active:scale-90 transition-transform">
          <motion.div
            animate={isPlayingMusic ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {isPlayingMusic ? <Music size={12} className="text-slate-800" /> : <VolumeX size={12} className="text-slate-400" />}
          </motion.div>
          <span className="text-[10px] font-black text-slate-700 tracking-tighter">
            {isPlayingMusic ? 'PLAYING' : 'OFF'}
          </span>
        </div>
      </motion.div> */}

      {/* 💥 极客风全宇宙跳跃计数器 (右上角)
      <motion.div 
        className="fixed top-6 right-6 sm:top-10 sm:right-10 z-[100] flex flex-col items-end justify-center opacity-80 hover:opacity-100 transition-opacity"
        style={{ display: activeTab === 'neural' ? 'none' : 'flex' }}
      >
        <span className="text-[9px] font-black text-slate-400/80 tracking-widest uppercase mb-1.5 drop-shadow-sm">Global Jumps</span>
        <div className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-center min-w-[40px]">
          <span className="text-xs font-black text-slate-800">{globalJumps.toLocaleString()}</span>
        </div>
      </motion.div> */}

      <motion.div className="fixed right-6 bottom-32 z-50 w-12 h-12 rounded-full backdrop-blur-xl bg-white/20 border border-white/40 flex items-center justify-center cursor-pointer shadow-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ rotate: springRotate, display: activeTab === 'neural' ? 'none' : 'flex' }}>
        <div className="w-4 h-4 rounded-full border-[2px] border-slate-800/30 flex items-center justify-center"><div className="w-1 h-1 bg-slate-800/60 rounded-full" /></div>
      </motion.div>

      <motion.main className="relative z-10 max-w-xl mx-auto w-full px-5 pb-32 pt-10 flex-1" initial={{ opacity: 0, y: 40 }} animate={bootState !== 'booting' ? { opacity: 1, y: 0 } : {}}>
        <AnimatePresence mode="wait">
        {activeTab === 'home' && ( 
            <HomeView 
              key="home" 
              showSpiritHere={pendingTab === null} 
              isPreparing={isPreparing} 
              jumpType={jumpType} 
              onNavigate={handleNavClick} 
              // 💥 重点：把状态传给子组件
              globalJumps={globalJumps}
              isPlayingMusic={isPlayingMusic}
              toggleMusic={toggleMusic}
            /> 
          )}
          {activeTab === 'neural' && <NeuralView key="neural" showSpiritHere={pendingTab === null} isPreparing={isPreparing} jumpType={jumpType} />}
          {activeTab === 'notes' && <NotesView key="notes" />}
          {activeTab === 'guestbook' && <GuestbookView key="guestbook" />}
        </AnimatePresence>
      </motion.main>

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