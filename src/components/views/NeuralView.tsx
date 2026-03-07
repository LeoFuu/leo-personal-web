// src/components/views/NeuralView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { LiquidCard } from '../ui/LiquidCard';
import { VoidSpirit } from '../features/VoidSpirit';
import { callDeepSeek } from '../../lib/deepseek';

export const NeuralView: React.FC<any> = ({ showSpiritHere, isPreparing, jumpType }) => {
  const [messages, setMessages] = useState([{ role: 'ai', text: "你好，我是 Leo 的数字分身。接入 DeepSeek 网络成功。" }]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const msg = input; 
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]); 
    setIsThinking(true);
    const res = await callDeepSeek(msg); 
    setIsThinking(false);
    setMessages(p => [...p, { role: 'ai', text: res }]);
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[75vh] relative pt-10 px-2">
      <div className="absolute top-0 right-6 z-50">
        {showSpiritHere && <VoidSpirit isNavigating={false} isPreparing={isPreparing} jumpType={jumpType} locationId="page" />}
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pb-20 [&::-webkit-scrollbar]:hidden">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-3xl border ${m.role === 'user' ? 'bg-blue-600/20 border-blue-400/20 text-white' : 'bg-white/5 border-white/10 text-white/90 shadow-xl'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {isThinking && <div className="text-xs text-white/30 pl-4 animate-pulse">思考中...</div>}
        <div ref={scrollRef} />
      </div>
      <div className="absolute bottom-4 inset-x-0 px-2">
        <LiquidCard hover={false} className="p-1.5">
          <div className="flex items-center gap-2 bg-black/60 rounded-full p-2 border border-white/5">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="发送指令..." className="flex-1 bg-transparent border-none text-white text-sm px-4 outline-none focus:ring-0" />
            <button onClick={handleSend} className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"><Send size={18}/></button>
          </div>
        </LiquidCard>
      </div>
    </motion.div>
  );
};