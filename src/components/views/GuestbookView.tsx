// src/components/views/GuestbookView.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const initialMessages = [
  { 
    id: 1, 
    user: '访客_265', 
    date: '2026.3.8', 
    fullTime: '2026-03-08T12:27:00Z',
    content: '你在干什么？' 
  },
  { 
    id: 2, 
    user: '匿名极客', 
    date: '2026.3.7', 
    fullTime: '2026-03-07T09:15:00Z',
    content: '这个卡片堆叠的物理手感太爽了，划了五分钟停不下来！' 
  },
  { 
    id: 3, 
    user: 'DesignLover', 
    date: '2026.3.5', 
    fullTime: '2026-03-05T20:30:00Z',
    content: '绝美的排版，克制才是最高级的设计。期待看到更多更新。' 
  },
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
    
    const newMessage = {
      id: Date.now(),
      user: '访客_' + Math.floor(Math.random() * 1000),
      date: simpleDate, 
      fullTime: now.toISOString(),
      content: inputValue,
    };
    
    setMessages([newMessage, ...messages]);
    setInputValue('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pt-10 pb-40 px-5 sm:px-0 w-full min-h-screen flex flex-col items-center"
    >
      <div className="w-full max-w-md">
        
        {/* 💥 头部引导区：杂志级排版！拆分文字权重，建立高级视觉层级 */}
        <div className="mb-10 text-left pt-2">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            {/* <div className="w-7 h-7 rounded-full bg-white/80 border border-slate-200/50 flex items-center justify-center shadow-sm backdrop-blur-md">
              <MessageSquare className="text-slate-500" size={12} />
            </div> */}
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {/* Guestbook */}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[22px] font-black text-slate-800 tracking-tight leading-snug pl-1"
          >
            {/* 我想听到你的声音，<br /> */}
            <span className="text-[16px] font-medium text-slate-500 tracking-wide">
              {/* 记得给我留言。 */}
            </span>
          </motion.h1>
        </div>

        {/* 💥 输入投递舱：压扁尺寸，提升精致感 */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          // 将外层 padding 调小，边角弧度微调，显得更像一张精巧的纸条
          className="w-full bg-white/90 sm:bg-white/80 backdrop-blur-xl border border-white/80 rounded-[28px] p-1.5 mb-12 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] relative overflow-hidden group"
          style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-focus-within:opacity-100 group-focus-within:translate-x-full transition-all duration-1000 pointer-events-none" />

          <div className="p-4 sm:p-5 flex flex-col relative z-10">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="我想听到你的声音，记得给我留言..."
              // 💥 修复尺寸：将高度由 h-24 压缩到 h-16，消除空旷的压迫感
              className="w-full bg-transparent border-none outline-none resize-none h-16 text-[15px] text-slate-700 placeholder:text-slate-400/60 font-medium scrollbar-hide"
            />
            
            {/* 极其干净的右下角发送按钮 */}
            <div className="flex justify-end pt-1">
              <button 
                type="submit"
                onMouseEnter={() => setIsHoveringSubmit(true)}
                onMouseLeave={() => setIsHoveringSubmit(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                  inputValue.trim() ? 'bg-slate-800 shadow-md' : 'bg-slate-100/80 cursor-not-allowed'
                }`}
              >
                <Send size={15} className={`transition-all ${inputValue.trim() ? 'text-white' : 'text-slate-400'} ${isHoveringSubmit && inputValue.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''}`} />
              </button>
            </div>
          </div>
        </motion.form>

        {/* 历史留言列表 */}
        <div className="flex flex-col gap-5 relative">
          <div className="absolute left-6 top-2 bottom-4 w-[1px] bg-gradient-to-b from-slate-200 via-slate-200/50 to-transparent z-0" />

          {messages.map((msg, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.1 }}
              key={msg.id}
              className="relative z-10 flex gap-4 w-full group"
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
                <p className="text-[14px] font-medium text-slate-600 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};