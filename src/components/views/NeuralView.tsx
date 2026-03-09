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
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  useEffect(() => {
    if (!window.visualViewport) return;
    const vp = window.visualViewport;
    const baseHeight = window.innerHeight;

    const handleResize = () => {
      if (vp.height > baseHeight * 0.85) {
        if (document.activeElement === inputRef.current) {
          inputRef.current?.blur();
        }
      }
    };
    vp.addEventListener('resize', handleResize);
    return () => vp.removeEventListener('resize', handleResize);
  }, []);

  const handleInputFocus = () => {
    setIsKeyboardOpen(true);
    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: false }));
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const handleInputBlur = () => {
    setIsKeyboardOpen(false);
    window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: true }));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div 
      // 💥 性能优化 1：彻底废除消耗 CPU 的 `top` 动画！
      // 用初始 `y: "100%"` 配合最终的 `y: 24`（代表向下平移 24px），实现与 `top: 24` 一模一样的视觉效果，但完全不掉帧！
      initial={{ opacity: 0, y: "100%", borderRadius: "40px" }} 
      animate={{ 
        opacity: 1, 
        y: isKeyboardOpen ? 0 : 24, // 键盘关：整体下移 24px 露出顶部白边；键盘开：回到底部 0 吸顶！
        borderRadius: isKeyboardOpen ? "0px" : "40px"
      }} 
      exit={{ opacity: 0, y: "100%", transition: { duration: 0.25, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
      onPointerMove={handlePointerMove}
      
      // 💥 性能优化 2：把外层容器的高度强制拉长到 h-[100dvh] 外加底部冗余 bottom-[-24px]！
      // 因为容器在关闭键盘时会下移 24px，为了保证底部不穿帮，我们把它做长一点。
      className="fixed inset-x-0 top-0 bottom-[-24px] mx-auto w-full max-w-md bg-[#0A0A0A] z-[45] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      style={{
        willChange: 'transform, opacity, border-radius', // 只让 GPU 处理这三个属性！
        transform: 'translateZ(0)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        overscrollBehavior: 'none',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)'
      }}
    >
      {isPresent && (
        <style dangerouslySetInnerHTML={{__html: `
          nav .z-\\[9999\\] { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.1s; }
          .fixed.bottom-0.z-40 { display: none !important; }
          body { overscroll-behavior: none !important; }
        `}} />
      )}

      {/* 头部大眼睛：完全保留你这版的透明逻辑，绝不会有平头Bug */}
      <div className="absolute top-0 inset-x-0 h-[110px] flex justify-center items-center gap-6 z-20 pointer-events-none border-b border-white/5 pt-6 pb-2 bg-transparent">
        {[0, 1].map((i) => (
          <div key={i} className="w-20 h-24 bg-[#FFD700] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.3)] translate-z-0">
            <motion.div 
              style={{ x: springX, y: springY }}
              className="w-8 h-8 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform translate-z-0"
            />
          </div>
        ))}
      </div>

      <div 
        className="absolute inset-x-0 overflow-y-auto px-4 sm:px-6 scrollbar-hide scroll-smooth z-10"
        style={{
          top: '110px',
          bottom: isKeyboardOpen ? '80px' : '170px', 
          overscrollBehaviorY: 'contain' 
        }}
      >
        <div className="flex flex-col space-y-6 pt-4 pb-6">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
              key={i} className={`flex items-start gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 w-full flex-row">
              <div className="shrink-0 mt-1"><div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden bg-slate-900 opacity-50 animate-pulse shadow-md"><img src={MY_AVATAR} alt="Clone" className="w-full h-full object-cover" /></div></div>
              <div className="max-w-[75%]"><div className="px-5 py-3 rounded-[24px] bg-white/[0.08] border border-white/10 backdrop-blur-xl flex items-center gap-2"><Terminal size={14} className="text-white/40" /><span className="text-[12px] font-mono text-white/50 animate-pulse">Thinking...</span></div></div>
            </motion.div>
          )}
          <div ref={scrollRef} className="h-2 shrink-0" />
        </div>
      </div>

      {/* 💥 性能优化 3：因为外层整个下移了 24px，所以输入框的底部 padding 也要加上 24px 补偿！ */}
      <div 
        className="absolute inset-x-0 bottom-[24px] bg-[#0A0A0A] z-30 transition-all duration-300"
        // 没开键盘时，原始 110px 加上下移的 24px = 134px。这样视觉上它绝对没有移动过任何位置！
        style={{ paddingBottom: isKeyboardOpen ? '16px' : '134px', paddingTop: '12px' }}
      >
        <div className="absolute -top-16 inset-x-0 h-16 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent pointer-events-none" />
        
        <div className="px-6 sm:px-10">
          <div className="p-1 bg-white/[0.08] border border-white/10 backdrop-blur-2xl rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="relative flex items-center bg-black rounded-[24px] border border-white/[0.1] overflow-hidden">
              <input 
                ref={inputRef}
                value={input} 
                onChange={e => { setInput(e.target.value); if (Math.random() > 0.5) { mouseX.set((Math.random() - 0.5) * 10); mouseY.set((Math.random() - 0.5) * 10); } }} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="与数字分身对话..." 
                className="w-full bg-transparent border-none text-white/90 placeholder:text-white/40 text-[14px] font-medium outline-none focus:ring-0 py-3.5 pl-5 pr-11" 
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
        </div>
      </div>
    </motion.div>
  );
};