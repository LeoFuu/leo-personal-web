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

  useEffect(() => {
    if (!window.visualViewport) return;
    const vp = window.visualViewport;
    let lastHeight = vp.height;

    const handleResize = () => {
      const currentHeight = vp.height;
      const diff = currentHeight - lastHeight;
      
      if (diff > 100) {
        setIsKeyboardOpen(false);
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: true }));
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
          (document.activeElement as HTMLElement).blur();
        }
      } else if (diff < -100) {
        setIsKeyboardOpen(true);
        window.dispatchEvent(new CustomEvent('toggle-navbar', { detail: false }));
      }
      
      lastHeight = currentHeight;
    };

    vp.addEventListener('resize', handleResize);
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
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
      onPointerMove={handlePointerMove}
      // 💥 修复 2（白雾Bug）：把 z-40 改成 z-[45]！
      // 完美压制外层 page.tsx 的白色渐变遮罩，同时不影响 z-50 的导航栏！
      className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md h-[88dvh] bg-black rounded-t-[40px] flex flex-col z-[45] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {isPresent && (
        <style dangerouslySetInnerHTML={{__html: `nav .z-\\[9999\\] { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.1s; }`}} />
      )}

      {/* 💥 修复 1（眼睛固定）：将其改为 shrink-0 并设定固定内边距，它现在会死死钉在顶部，绝不乱跑！ */}
      <div className="shrink-0 flex justify-center items-center gap-6 pt-10 pb-4 relative z-20 pointer-events-none border-b border-white/5">
        {[0, 1].map((i) => (
          <div key={i} className="w-20 h-24 bg-[#FFD700] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.4)] translate-z-0">
            <motion.div 
              style={{ x: springX, y: springY }}
              className="w-8 h-8 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform translate-z-0"
            />
          </div>
        ))}
      </div>

      {/* 💥 修复 3（无法滚动 Bug）：加入 min-h-0！这是 Flexbox 里开启独立滚动的钥匙！ */}
      {/* 给底部留出高达 180px 的空白 (pb-[180px])，确保最后一行字绝对不会被输入框挡住 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6 px-4 sm:px-6 pt-4 pb-[180px] scrollbar-hide relative z-10 scroll-smooth">
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

      {/* 智能输入框 */}
      <motion.div 
        animate={{ bottom: isKeyboardOpen ? 24 : 108 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute left-0 right-0 px-6 sm:px-10 z-50"
      >
        {/* 输入框上方的渐变遮罩，挡住文字底部滚动的硬切边 */}
        <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
        
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