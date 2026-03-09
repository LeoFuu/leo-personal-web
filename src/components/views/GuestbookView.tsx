// src/components/views/GuestbookView.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GuestbookMessage {
  id: number;
  nickname: string;
  content: string;
  reply?: string;
  created_at: string;
}

export const GuestbookView = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMessages = async () => {
    try {
      // 留言板页面依然展示所有通过审核的留言（不需要精选也能展示）
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("拉取留言失败:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSubmitting(true);
    const randomName = '访客_' + Math.floor(Math.random() * 1000);

    try {
      const { error } = await supabase.from('guestbook').insert([
        { 
          nickname: randomName, 
          content: inputValue,
          is_approved: true
        }
      ]);

      if (error) throw error;

      setInputValue('');
      fetchMessages();
    } catch (err) {
      console.error("提交失败:", err);
      alert("发射失败，似乎碰到了引力波 😢");
    } finally {
      setIsSubmitting(false);
      setIsHoveringSubmit(false);
    }
  };

  const formatSimpleDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
          className="w-full bg-white/90 backdrop-blur-2xl border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] rounded-[28px] p-1.5 mb-12 relative overflow-hidden group"
          style={{ 
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-focus-within:opacity-100 group-focus-within:translate-x-full transition-all duration-1000 pointer-events-none" />
          <div className="p-4 sm:p-5 flex flex-col relative z-10">
            <textarea 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              disabled={isSubmitting}
              placeholder="我想听到你的声音，记得给我留言..." 
              className="w-full bg-transparent border-none outline-none resize-none h-16 text-[15px] text-slate-800 placeholder:text-slate-400/80 font-medium scrollbar-hide disabled:opacity-50" 
            />
            <div className="flex justify-end pt-1">
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isSubmitting}
                onMouseEnter={() => setIsHoveringSubmit(true)} 
                onMouseLeave={() => setIsHoveringSubmit(false)} 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${inputValue.trim() && !isSubmitting ? 'bg-slate-800 shadow-md' : 'bg-slate-100/80 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="text-slate-400 animate-spin" />
                ) : (
                  <Send size={15} className={`transition-all ${inputValue.trim() ? 'text-white' : 'text-slate-400'} ${isHoveringSubmit && inputValue.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''}`} />
                )}
              </button>
            </div>
          </div>
        </motion.form>

        <div className="flex flex-col gap-5 relative">
          <div className="absolute left-6 top-2 bottom-4 w-[1px] bg-gradient-to-b from-slate-200 via-slate-200/50 to-transparent z-0" />
          
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10 text-slate-400 gap-2">
              <Loader2 size={20} className="animate-spin opacity-50" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Syncing...</span>
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-[13px] font-medium text-slate-400">
              这里还是一片荒芜，快来留下第一行代码。
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                layout="position" 
                initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.05 }} 
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

                <div className="flex-1 bg-white/50 backdrop-blur-md border border-white/40 rounded-[28px] p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:bg-white/60 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[12px] font-black text-slate-800 tracking-tight">{msg.nickname}</span>
                    <span className="text-[10px] font-bold text-slate-400/80 tracking-widest">{formatSimpleDate(msg.created_at)}</span>
                  </div>
                  <p className="text-[14px] font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* 💥 UI 修正：极简克制风的站长回复 */}
                  {msg.reply && (
                    <div className="mt-4 pt-3 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 mb-1.5">
                         <span className="text-[11px] font-black text-slate-800 tracking-tight">付昱淋</span>
                         <span className="px-1.5 py-[2px] bg-slate-100/80 border border-slate-200/80 text-slate-500 rounded-[6px] text-[8px] font-bold tracking-widest uppercase shadow-sm">
                           nb666
                         </span>
                      </div>
                      <p className="text-[12px] font-medium text-slate-600 leading-relaxed">{msg.reply}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};