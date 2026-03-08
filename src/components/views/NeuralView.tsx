// src/components/views/NeuralView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useIsPresent, useMotionValue, useSpring } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';
import { callDeepSeek } from '../../lib/deepseek';

const MY_AVATAR = "/cartoonf.png"; 

export const NeuralView: React.FC<any> = ({ showSpiritHere }) => {
  const [messages, setMessages] = useState([{ role: 'ai', text: "你好，Leo。我是 VoidSpirit，你的数字分身。接入 DeepSeek 网络成功。" }]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); 
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const isFirstRender = useRef(true);
  const isPresent = useIsPresent();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 15 });

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const msg = input; 
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]); 
    setIsThinking(true);
    
    mouseX.set(0); 
    mouseY.set(0); 
    
    const res = await callDeepSeek(msg); 
    setIsThinking(false);
    setMessages(p => [...p, { role: 'ai', text: res }]);
  };

  useEffect(() => { 
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, isThinking]);

  // 💥 完美键盘侦测：通过视口比例绝对判定，修复收起键盘时导航栏不恢复的死穴！
  useEffect(() => {
    if (!window.visualViewport) return;
    const vp = window.visualViewport;

    const handleResize = () => {
      // 如果视口高度小于屏幕总高度的 75%，断定为键盘弹起
      const isKBOpen = vp.height < window.innerHeight * 0.75;
      
      setIsKeyboardOpen(isKBOpen);
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: !isKBOpen }));
      
      // 当键盘收起时，强制剥夺输入框焦点，防止安卓系统假死
      if (!isKBOpen && document.activeElement?.tagName === 'INPUT') {
        (document.activeElement as HTMLElement).blur();
      }
    };

    vp.addEventListener('resize', handleResize);
    handleResize(); // 挂载时做一次初始化检测
    return () => vp.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: "100%", transition: { duration: 0.25, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
      onPointerMove={handlePointerMove}
      // 💥 修复 1（白框+布局断层）：
      // 放弃所有花里胡哨的相对定位！直接使用 fixed 顶死距离顶部 12vh，底部 0！
      // 加上 overflow-hidden，让黑色的身体彻底隔绝那层烦人的白色渐变雾！
      className="fixed inset-x-0 bottom-0 top-[12vh] mx-auto w-full max-w-md bg-[#0A0A0A] rounded-t-[40px] z-[45] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      {isPresent && (
        <style dangerouslySetInnerHTML={{__html: `nav .z-\\[9999\\] { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.1s; }`}} />
      )}

      {/* 💥 修复 2（眼睛固定）：焊死在 top-0！无论键盘怎么弹，它都牢牢挂在最上面 */}
      <div className="absolute top-0 inset-x-0 h-[100px] flex justify-center items-center gap-6 z-20 pointer-events-none bg-[#0A0A0A] border-b border-white/5">
        {[0, 1].map((i) => (
          <div key={i} className="w-20 h-24 bg-[#FFD700] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.3)] translate-z-0">
            <motion.div 
              style={{ x: springX, y: springY }}
              className="w-8 h-8 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform translate-z-0"
            />
          </div>
        ))}
      </div>

      {/* 💥 修复 3（长文无法滚动）：绝对定位的滚动域 */}
      {/* 动态计算 bottom 边距，把输入框的位置空出来，长文畅通无阻！ */}
      <div 
        className="absolute top-[100px] inset-x-0 overflow-y-auto scroll-smooth z-10 px-4 sm:px-6 scrollbar-hide"
        style={{ 
          bottom: isKeyboardOpen ? '100px' : '180px',
          WebkitOverflowScrolling: 'touch', 
          overscrollBehaviorY: 'contain' // 终极保险：防止触发苹果系统的页面级回弹拖拽
        }}
      >
        <div className="flex flex-col space-y-6 pt-6 pb-6">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
              key={i} className={`flex items-start gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            >
              <div className="shrink-0 mt-1">
                {m.role === 'ai' ? (
                  <div className="w-9 h-9 rounded-full border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.05)] overflow-hidden bg-slate-900"><img src={MY_AVATAR} alt="Clone" className="w-full h-full object-cover" /></div>
                ) : (
                  <div className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center"><span className="text-white/80 text-[10px] font-black">ME</span></div>
                )}
              </div>
              <div className="max-w-[78%]">
                <div className="px-4 py-3 rounded-[24px] bg-white/[0.08] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                  <p className="text-[14px] leading-relaxed font-medium text-white/90 whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 w-full flex-row" style={{ willChange: 'opacity' }}>
              <div className="shrink-0 mt-1"><div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden bg-slate-900 opacity-50 animate-pulse shadow-md"><img src={MY_AVATAR} alt="Clone" className="w-full h-full object-cover" /></div></div>
              <div className="max-w-[75%]"><div className="px-5 py-3 rounded-[24px] bg-white/[0.08] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2"><Terminal size={14} className="text-white/40" /><span className="text-[12px] font-mono text-white/50 animate-pulse">Thinking...</span></div></div>
            </motion.div>
          )}
          <div ref={scrollRef} className="h-4 shrink-0" />
        </div>
      </div>

      {/* 💥 智能悬浮输入框 */}
      <motion.div 
        animate={{ bottom: isKeyboardOpen ? 24 : 110 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="absolute inset-x-6 sm:inset-x-10 z-30"
      >
        {/* 去掉了那个发白的假渐变层，只保留纯粹的玻璃质感 */}
        <div className="p-1 bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          <div className="relative flex items-center bg-black/80 rounded-[24px] border border-white/[0.08] overflow-hidden">
            <input 
              value={input} 
              onChange={e => { setInput(e.target.value); if (Math.random() > 0.5) { mouseX.set((Math.random() - 0.5) * 10); mouseY.set((Math.random() - 0.5) * 10); } }} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
              placeholder="与数字分身对话..." 
              className="w-full bg-transparent border-none text-white/90 placeholder:text-white/30 text-[14px] font-medium outline-none focus:ring-0 py-3.5 pl-5 pr-11" 
            />
            <button 
              onClick={handleSend} 
              disabled={isThinking || !input.trim()} 
              className={`absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90 bg-transparent ${isThinking || !input.trim() ? 'text-white/20' : 'text-[#FFD700] hover:text-[#FFE44D]'}`}
            >
              <Send size={18} className={input.trim() && !isThinking ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
            </button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};