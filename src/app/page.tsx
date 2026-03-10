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

  // 💥 新增：滑动隐藏导航栏与回到顶部按钮的神器
  useMotionValueEvent(scrollY, "change", (latest) => {
    // 只有在首页和笔记页才启用滑动隐藏（AI页和留言板保持不动）
    if (activeTab !== 'home' && activeTab !== 'notes') return;
    
    const previous = scrollY.getPrevious() || 0;
    // 如果向下滑动超过 100px，就隐藏导航栏
    if (latest > previous && latest > 100) {
      setIsNavVisible(false);
    } 
    // 如果向上滑动（哪怕只滑了一点点），或者回到了最顶部，立刻显示导航栏
    else if (latest < previous || latest <= 100) {
      setIsNavVisible(true);
    }
  });

  const triggerClearing = useCallback(() => {
    setBootState(prev => (prev === 'booting' ? 'clearing' : prev));
  }, []);

  useEffect(() => { 
    const safetyTimer = setTimeout(() => { triggerClearing(); }, 5000); 
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
    
    // 清除所有正在进行的动画计时器
    Object.values(timers.current).forEach(t => t && clearTimeout(t));
    window.scrollTo({ top: 0, behavior: 'auto' });

   // 💥 状态机 1：跳转到 AI 页（Neural）
    // 逻辑：先让小精灵朝着 AI 图标起跳，但在半空中（100毫秒时）瞬间切页，并把它抹除！
    if (tabId === 'neural') {
      setIsPreparing(true);
      setJumpType('dive'); // 采用向下俯冲的姿势

      timers.current.spirit = setTimeout(() => {
          setIsPreparing(false); 
          setSpiritTarget(tabId); // 发射！小精灵开始飞向底部导航栏
          setPendingTab(tabId);       
          
          // 💥 核心魔法：100ms 后页面切换。
          timers.current.pageExit = setTimeout(() => { 
            setActiveTab(tabId); 
            // 💥 终极修复：就是加了这一句！页面切过去的同时，把导航栏上的小精灵目标清空，让它瞬间“湮灭”！
            setSpiritTarget(null); 
          }, 100); 
      }, 150); 
      return; 
    }

    // --- 下面是其他页面的通用起跳动作 ---
    const isStartingFromPage = spiritTarget === null;
    setIsPreparing(true);
    setJumpType(isStartingFromPage ? 'dive' : 'hop');

    // 动作 1：小精灵先跳到导航栏的目标图标上
    timers.current.spirit = setTimeout(() => {
        setIsPreparing(false); 
        setSpiritTarget(tabId); // 让小精灵稳稳落在导航栏
        setPendingTab(tabId);       
        
        // 瞬间切换页面内容
        timers.current.pageExit = setTimeout(() => { setActiveTab(tabId); }, 50);
    }, 150); 

    //  状态机 2：跳转到“笔记”或“留言板”
    // 逻辑：直接 return！不去触发后续的乱跳代码，让它安安静静趴在导航栏陪你看书！
    if (tabId === 'notes' || tabId === 'guestbook') {
      return;
    }

    //  状态机 3：跳转到“首页”
    // 逻辑：在导航栏短暂停留一下，然后立刻蓄力跳向中间的卡片！
    if (tabId === 'home') {
      timers.current.prepare = setTimeout(() => {
          setIsPreparing(true); 
          setJumpType('soar'); // 设置起飞姿势
          
          timers.current.jump = setTimeout(() => {
              setIsPreparing(false); 
              setSpiritTarget(null); // 设为 null，把渲染权交接给 HomeView，实现飞入名片！
              setPendingTab(null);   
          }, 150);
      }, 1000); //  关键修复：把原本漫长拖沓的 3150ms 缩短到 500ms！极限清爽！
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
                   <video ref={videoRef} src="/start.mp4" autoPlay muted playsInline preload="auto" className="w-[260px] sm:w-[320px] h-auto object-contain" onCanPlay={() => { videoRef.current?.play().catch(() => triggerClearing()); }} onEnded={triggerClearing} onError={triggerClearing} />
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
              onNavigate={handleNavClick} // 传递导航函数给子组件
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