// src/components/views/NeuralView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';
import { LiquidCard } from '../ui/LiquidCard';
import { callDeepSeek } from '../../lib/deepseek';

// 💥 你的真实头像地址
const MY_AVATAR = "/cartoonf.png"; 

export const NeuralView: React.FC<any> = ({ showSpiritHere }) => {
  const [messages, setMessages] = useState([{ role: 'ai', text: "你好，Leo。我是 VoidSpirit，你的数字分身。接入 DeepSeek 网络成功。" }]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const msg = input; 
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]); 
    setIsThinking(true);
    
    setEyePos({ x: 0, y: 0 }); 
    
    const res = await callDeepSeek(msg); 
    setIsThinking(false);
    setMessages(p => [...p, { role: 'ai', text: res }]);
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    setEyePos({ x, y });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.1, y: 300, borderRadius: "100px" }} 
      animate={{ opacity: 1, scale: 1, y: 0, borderRadius: "40px" }} 
      exit={{ opacity: 0, scale: 0.8, y: 150, borderRadius: "100px", transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 280, damping: 25, mass: 0.8 }}
      onPointerMove={handlePointerMove}
      // 💥 彻底干掉惹祸的 absolute！老老实实呆在 flex 文档流里
      className="flex flex-col h-[85vh] sm:h-[80vh] pt-6 px-4 sm:px-0 w-full max-w-md mx-auto overflow-hidden bg-black touch-pan-y relative z-40"
      style={{
        boxShadow: "inset -2px -2px 10px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.8)",
        transformOrigin: "bottom center" 
      }}
    >
      {/* 💥 神级天然隐身：只要 NeuralView 没被彻底卸载，这段 Style 就会生效隐藏底部精灵。
          一旦退出动画结束，组件被连根拔起，这段 Style 瞬间消失，底部精灵天然显形！ */}
      <style dangerouslySetInnerHTML={{__html: `
        nav .z-\\[9999\\] { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.1s; }
      `}} />

      {/* 大眼睛 */}
      <div className="flex justify-center items-center gap-6 mb-8 shrink-0 relative z-20 pointer-events-none mt-2">
        {[0, 1].map((i) => (
          <div key={i} className="w-20 h-24 bg-[#FFD700] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.4)] translate-z-0">
            <motion.div 
              animate={{ x: eyePos.x, y: eyePos.y }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-8 h-8 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform translate-z-0"
            />
          </div>
        ))}
      </div>

      {/* 消息流 */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-32 scrollbar-hide relative z-10 scroll-smooth px-2">
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            key={i} 
            className={`flex items-start gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* 头像区域：完全冷峻的高级灰白边框 */}
            <div className="shrink-0 mt-1">
              {m.role === 'ai' ? (
                <div className="w-9 h-9 rounded-full border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.05)] overflow-hidden bg-slate-900">
                  <img src={MY_AVATAR} alt="Clone" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                   <span className="text-white/80 text-[10px] font-black">ME</span>
                </div>
              )}
            </div>
            
            {/* 💥 极简气泡：无方角 (纯圆角 24px)，同材质液体磨砂玻璃 */}
            <div className="max-w-[78%]">
              <div className="px-4 py-3 rounded-[24px] bg-white/[0.08] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                <p className="text-[14px] leading-relaxed font-medium text-white/90 whitespace-pre-wrap break-words">
                  {m.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 w-full flex-row">
            <div className="shrink-0 mt-1">
              <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden bg-slate-900 opacity-50 animate-pulse shadow-md">
                  <img src={MY_AVATAR} alt="Clone" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="max-w-[75%]">
              <div className="px-5 py-3 rounded-[24px] bg-white/[0.08] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2">
                <Terminal size={14} className="text-white/40" />
                <span className="text-[12px] font-mono text-white/50 animate-pulse">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* 底部输入舱 */}
      <div className="absolute bottom-4 inset-x-0 px-4 z-20">
        <div className="absolute -top-12 inset-x-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <LiquidCard hover={false} className="p-1.5 bg-white/[0.05] border-white/10 backdrop-blur-xl rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 bg-black/80 rounded-[24px] p-1.5 pl-4 border border-white/[0.05]">
            <input 
              value={input} 
              onChange={e => {
                setInput(e.target.value);
                if (Math.random() > 0.5) setEyePos({ x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 });
              }} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
              placeholder="与它对话..." 
              className="flex-1 bg-transparent border-none text-white/90 placeholder:text-white/30 text-[14px] font-medium outline-none focus:ring-0" 
            />
            <button 
              onClick={handleSend} 
              disabled={isThinking || !input.trim()}
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                isThinking || !input.trim() 
                  ? 'bg-white/5 text-white/20' 
                  : 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
              }`}
            >
              <Send size={16} className={input.trim() && !isThinking ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
            </button>
          </div>
        </LiquidCard>
      </div>
    </motion.div>
  );
};