// src/components/views/GuestbookView.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const initialMessages = [
  { id: 1, user: '访客_265', date: '2026.3.8', fullTime: '2026-03-08T12:27:00Z', content: '你在干什么？' },
  { id: 2, user: '匿名极客', date: '2026.3.7', fullTime: '2026-03-07T09:15:00Z', content: '这个卡片堆叠的物理手感太爽了，划了五分钟停不下来！' },
  { id: 3, user: 'DesignLover', date: '2026.3.5', fullTime: '2026-03-05T20:30:00Z', content: '绝美的排版，克制才是最高级的设计。期待看到更多更新。' },
];

export const GuestbookView = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const now = new Date();
    const simpleDate = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
    const newMessage = { id: Date.now(), user: '访客_' + Math.floor(Math.random() * 1000), date: simpleDate, fullTime: now.toISOString(), content: inputValue };
    setMessages([newMessage, ...messages]);
    setInputValue('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      // 💥 1. 给整个页面容器开启 GPU 加速
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      className="pt-10 pb-40 px-5 sm:px-0 w-full min-h-screen flex flex-col items-center"
    >
      <div className="w-full max-w-md">
        
        <div className="mb-10 text-left pt-2">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 mb-4" />
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-[22px] font-black text-slate-800 tracking-tight leading-snug pl-1" />
        </div>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="w-full bg-white/90 sm:bg-white/80 backdrop-blur-xl border border-white/80 rounded-[28px] p-1.5 mb-12 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] relative overflow-hidden group"
          style={{ 
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            // 💥 2. 输入框是打字延迟的罪魁祸首，因为带了强力模糊。强制提升至独立图层！
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-focus-within:opacity-100 group-focus-within:translate-x-full transition-all duration-1000 pointer-events-none" />
          <div className="p-4 sm:p-5 flex flex-col relative z-10">
            <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="我想听到你的声音，记得给我留言..." className="w-full bg-transparent border-none outline-none resize-none h-16 text-[15px] text-slate-700 placeholder:text-slate-400/60 font-medium scrollbar-hide" />
            <div className="flex justify-end pt-1">
              <button type="submit" onMouseEnter={() => setIsHoveringSubmit(true)} onMouseLeave={() => setIsHoveringSubmit(false)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${inputValue.trim() ? 'bg-slate-800 shadow-md' : 'bg-slate-100/80 cursor-not-allowed'}`}>
                <Send size={15} className={`transition-all ${inputValue.trim() ? 'text-white' : 'text-slate-400'} ${isHoveringSubmit && inputValue.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''}`} />
              </button>
            </div>
          </div>
        </motion.form>

        <div className="flex flex-col gap-5 relative">
          <div className="absolute left-6 top-2 bottom-4 w-[1px] bg-gradient-to-b from-slate-200 via-slate-200/50 to-transparent z-0" />
          {messages.map((msg, index) => (
            <motion.div
              // 💥 3. 性能核弹修复二：保留 layout，但强制开启 GPU 渲染。解决进场时的卡顿！
              layout="position" // 把完整的 layout 改为 layout="position"，只算位移不算宽高，极大降低性能消耗！
              initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.05 }} // 稍微加快阶梯动画
              key={msg.id}
              className="relative z-10 flex gap-4 w-full group"
              style={{ 
                willChange: 'transform, opacity', 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="mt-1 relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-white/80 border border-slate-200/60 shadow-sm flex items-center justify-center relative z-10 backdrop-blur-md">
                  {index === 0 ? <Sparkles size={16} className="text-yellow-500" /> : <MessageSquare size={16} className="text-slate-400" />}
                </div>
              </div>
              <div className="flex-1 bg-white/90 backdrop-blur-xl border border-white/60 rounded-[24px] rounded-tl-none p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[12px] font-black text-slate-800 tracking-tight">{msg.user}</span>
                  <span className="text-[10px] font-bold text-slate-400/80 tracking-widest">{msg.date}</span>
                </div>
                <p className="text-[14px] font-medium text-slate-600 leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};