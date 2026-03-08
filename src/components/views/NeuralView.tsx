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

  // 💥 修复 3：神级键盘监听！彻底解决键盘收起但导航栏不出来的 Bug！
  useEffect(() => {
    const initialHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      // 如果高度显著变小，说明键盘弹起了
      const isKeyboardOpen = currentHeight < initialHeight - 100;
      
      // 抛出事件：键盘弹起隐藏导航栏，键盘收起恢复导航栏
      window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: !isKeyboardOpen }));
      
      // 核心杀招：如果键盘收起了，但输入框还占着焦点，强行把它踢掉！
      if (!isKeyboardOpen) {
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
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
      // 💥 修复 2：极度 Q 弹的抽屉入场！从 100vh（屏幕最底端）冲上来！
      initial={{ opacity: 0, scale: 0.85, y: "100vh", borderRadius: "80px" }} 
      animate={{ opacity: 1, scale: 1, y: 0, borderRadius: "40px" }} 
      exit={{ opacity: 0, scale: 0.9, y: "100vh", borderRadius: "80px", transition: { duration: 0.2 } }}
      // 把 damping 调低到 20，释放它的弹簧天性，现在会有极其舒服的回弹！
      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.8 }}
      onPointerMove={handlePointerMove}
      // 💥 修复 1：加上 -mb-8，生生把整个黑框往下拽，完美填补底部的巨大空白！
      className="flex flex-col h-[83dvh] max-h-[850px] -mb-8 pt-6 px-4 sm:px-0 w-full max-w-md mx-auto overflow-hidden bg-black touch-pan-y relative z-40 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
      style={{
        boxShadow: "inset -1px -1px 3px rgba(255,255,255,0.1)",
        transformOrigin: "bottom center",
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {isPresent && (
        <style dangerouslySetInnerHTML={{__html: `nav .z-\\[9999\\] { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.1s; }`}} />
      )}

      {/* 大眼睛 */}
      <div className="flex justify-center items-center gap-6 mb-6 shrink-0 relative z-20 pointer-events-none mt-2">
        {[0, 1].map((i) => (
          <div key={i} className="w-20 h-24 bg-[#FFD700] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.4)] translate-z-0">
            <motion.div 
              style={{ x: springX, y: springY }}
              className="w-8 h-8 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform translate-z-0"
            />
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-36 scrollbar-hide relative z-10 scroll-smooth px-2">
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
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* 💥 底部输入舱 */}
      {/* 💥 修复缩短：把 inset-x-8 改成了 inset-x-12 (两边各缩进 48px)，变成了一个极其精致、小巧的居中胶囊！ */}
      <div className="absolute bottom-6 inset-x-10 sm:inset-x-16 z-50">
        
        {/* 底部遮罩也要配合缩短 */}
        <div className="absolute -top-16 inset-x-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none -mx-10 sm:-mx-16" />
        
        <div className="p-1 bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-[28px] shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
          <div className="relative flex items-center bg-black/80 rounded-[24px] border border-white/[0.08] overflow-hidden">
            <input 
              value={input} 
              onChange={e => { setInput(e.target.value); if (Math.random() > 0.5) { mouseX.set((Math.random() - 0.5) * 10); mouseY.set((Math.random() - 0.5) * 10); } }} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
              // 移除了这里不靠谱的 onFocus 和 onBlur，全权交给上面的 VisualViewport 去接管！
              placeholder="与它对话..." 
              className="w-full bg-transparent border-none text-white/90 placeholder:text-white/30 text-[14px] font-medium outline-none focus:ring-0 py-3 pl-4 pr-11" 
            />
            
            <button 
              onClick={handleSend} 
              disabled={isThinking || !input.trim()} 
              className={`absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-300 active:scale-90 bg-transparent ${isThinking || !input.trim() ? 'text-white/20' : 'text-[#FFD700] hover:text-[#FFE44D]'}`}
            >
              <Send size={16} className={input.trim() && !isThinking ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};