// src/components/views/NeuralView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useIsPresent, useMotionValue, useSpring } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';
import { callAI } from '../../lib/ai';
import { supabase } from '../../lib/supabase';

const MY_AVATAR = "/cartoonf.png"; 

export const NeuralView: React.FC<any> = ({ showSpiritHere }) => {
  const [messages, setMessages] = useState([{ role: 'ai', text: "我是付昱淋的数字分身" }]);
  const [sessionId, setSessionId] = useState<string>('');
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
    
    // 💥 修复 1：发送完消息后，强制输入法失去焦点并收起！
    inputRef.current?.blur();
    setIsKeyboardOpen(false);
    
    const newMessages = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages); 
    setIsThinking(true);
    mouseX.set(0); mouseY.set(0); 
    
    supabase.from('ai_chats').insert([{ session_id: sessionId, role: 'user', content: msg }]).then();
    
    const res = await callAI(newMessages, sessionId);
    
    setIsThinking(false);
    setMessages(p => [...p, { role: 'ai', text: res }]);

    supabase.from('ai_chats').insert([{ session_id: sessionId, role: 'ai', content: res }]).then();
  };

  // 💥 修复 2：把我不小心删掉的自动滚动代码加回来！
  useEffect(() => {
    // 稍微延迟 50ms，等 React 把新的 DOM 渲染完毕后再滚到底部，无比丝滑
    const timer = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, isThinking]); // 只要消息变多，或者开始思考，就自动往下滚

  useEffect(() => {
    let currentSession = localStorage.getItem('visitor_session_id');
    if (!currentSession) {
      currentSession = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('visitor_session_id', currentSession);
    }
    setSessionId(currentSession);

    const fetchHistory = async () => {
      if (!currentSession) return;
      const { data } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('session_id', currentSession)
        .order('created_at', { ascending: true }); 
      
      if (data && data.length > 0) {
        const dbMessages = data.map(msg => ({ role: msg.role, text: msg.content }));
        setMessages(dbMessages);
      }
    };

    fetchHistory();
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
      initial={{ opacity: 0, y: "100%" }} 
      // 💥 修复 3：彻底抛弃 y 和 borderRadius 随键盘的变化！让它像磐石一样固定，杜绝一切手机 GPU 渲染撕裂和闪白块！
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: "100%", transition: { duration: 0.25, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
      onPointerMove={handlePointerMove}
      // 💥 修复 4：改为 fixed inset-0 满屏锁定，并且去掉了会让浏览器崩溃的 willChange 属性
      className="fixed inset-0 mx-auto w-full max-w-md bg-[#0A0A0A] z-[45] overflow-hidden rounded-t-[32px] sm:rounded-none"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)', overscrollBehavior: 'none' }}
    >
      {isPresent && (
        <style dangerouslySetInnerHTML={{__html: `
          nav .z-\\[9999\\] { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.1s; }
          .fixed.bottom-0.z-40 { display: none !important; }
          body { overscroll-behavior: none !important; }
        `}} />
      )}

      {/* 头部大眼睛 */}
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
        style={{ top: '110px', bottom: '85px', overscrollBehaviorY: 'contain' }}
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
              <div className="max-w-[75%]"><div className="px-5 py-3 rounded-[24px] bg-white/[0.08] border border-white/10 backdrop-blur-xl flex items-center gap-2"><span className="text-[12px] font-mono text-white/50 animate-pulse">让我想想...</span></div></div>
            </motion.div>
          )}

          {/* 底部安全占位符 */}
          <div ref={scrollRef} className="h-6 shrink-0 w-full" />
        </div>
      </div>

      {/* 底部的输入框，去掉乱七八糟的高度补偿，让浏览器本身接管输入法的收缩 */}
      <div className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] z-30 transition-all duration-300 pb-safe" style={{ paddingBottom: isKeyboardOpen ? '12px' : '24px', paddingTop: '12px' }}>
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
                // 去掉了 e.preventDefault()，允许它正常失去焦点
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