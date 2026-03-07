// src/components/views/HomeView.tsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, Plus, MessageSquare, ArrowRight, Verified } from 'lucide-react';
import { HolographicAvatar } from '../ui/HolographicAvatar';
import { projects, thoughts } from '../../config/site';

interface ViewProps {
  onNavigate?: (id: string) => void;
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
}

const CARD_COLORS = ['bg-[#D9F99D]', 'bg-[#E9D5FF]', 'bg-[#BAE6FD]'];
const TEXT_COLORS = ['text-[#3F6212]', 'text-[#6B21A8]', 'text-[#0369A1]'];

const MetalClipBack = () => (
  <div 
     className="absolute z-20 pointer-events-none"
     style={{ 
       top: '-34px', left: '6px', width: '24px', height: '80px', borderRadius: '99px',
       background: 'linear-gradient(90deg, #374151 0%, #6B7280 40%, #1F2937 100%)', 
       boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.6)',
       transform: 'rotate(-4deg)',
     }} 
  />
);

const IDCard = ({ controls }: { controls: any }) => (
  <motion.div 
     // 💥 移动端降级 1：取消巨型阴影，改用普通 shadow-lg，避免 GPU 绘制崩溃
     className="absolute top-[-90px] left-[0px] z-40 bg-[#F8F9FA] rounded-[36px] w-[280px] h-[95px] flex items-center shadow-lg sm:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] border border-white/50"
     style={{
        transformOrigin: '20px 65px',
        // 💥 恢复 3D 硬件加速，防止慢动作，同时用 backfaceVisibility 锁定图层防止白块
        WebkitTransform: 'translate3d(0, 0, 0)',
        WebkitBackfaceVisibility: 'hidden',
     }}
     initial={{ rotate: -6 }} 
     animate={controls}
  >
     <div className="relative ml-[52px] shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-black/5 border-[2px] border-white shadow-sm">
           <HolographicAvatar className="w-full h-full scale-125" />
        </div>
     </div>
     
     <div className="ml-4 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tighter leading-none">付昱淋</h1>
          <Verified size={16} className="text-blue-500 fill-blue-50" />
        </div>
        
        <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> 
           FYLNB666
        </div>
     </div>
  </motion.div>
);

const MetalClipFront = ({ controls }: { controls: any }) => (
  <motion.div 
     className="absolute z-50 pointer-events-none origin-top"
     initial={{
       top: '-32px', left: '8px', width: '24px', height: '80px', borderRadius: '99px',
       background: 'linear-gradient(90deg, #D1D5DB 0%, #FFFFFF 20%, #E5E7EB 50%, #9CA3AF 100%)', 
       boxShadow: 'inset -1px -2px 4px rgba(0,0,0,0.2), 4px 8px 12px rgba(0,0,0,0.5)',
       rotate: -4,
     }}
     style={{
        WebkitTransform: 'translate3d(0, 0, 0)',
        WebkitBackfaceVisibility: 'hidden',
     }}
     animate={controls}
  >
      <div className="absolute top-[15%] bottom-[15%] left-[50%] w-[2px] bg-black/10 shadow-[inset_1px_0_1px_rgba(255,255,255,0.4)] -translate-x-1/2 rounded-full" />
  </motion.div>
);

const ProjectDeck = ({ deck }: { deck: number[] }) => (
  <>
    {[0, 1, 2].map((id) => {
       const position = deck.indexOf(id);
       return (
         <motion.div 
           key={id}
           style={{
             // 💥 恢复 3D 硬件加速，解决切牌时的“慢动作”掉帧问题
             WebkitTransform: 'translate3d(0, 0, 0)',
             WebkitBackfaceVisibility: 'hidden',
           }}
           animate={{
             rotate: position === 0 ? 0 : position === 1 ? 5 : 10,
             x: position === 0 ? 0 : position === 1 ? 8 : 20,
             y: position === 0 ? 0 : position === 1 ? 16 : 32,
             scale: position === 0 ? 1 : position === 1 ? 0.95 : 0.9,
             zIndex: 30 - position * 10,
             opacity: position === 2 ? 0.8 : 1
           }}
           transition={{ type: 'spring', stiffness: 300, damping: 25 }}
           // 💥 移动端降级 2：取消巨型阴影，改用普通 shadow-2xl
           className={`absolute inset-0 ${CARD_COLORS[id]} rounded-[48px] shadow-2xl sm:shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between overflow-hidden border border-white/20`}
         >
            <div className="flex justify-between items-start pl-6 relative z-10">
               {/* 💥 移动端降级 3：彻底干掉小标签的 blur，使用不透明白色 bg-white/90，防止文字消失！桌面端保留 sm:backdrop-blur-md */}
               <div className="bg-white/90 sm:bg-white/50 backdrop-blur-none sm:backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold text-black/80 uppercase tracking-widest border border-white/40 shadow-sm">
                  Project {id + 1}
               </div>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <Heart size={20} className="text-black fill-black" />
               </div>
            </div>
            
            <div className="mt-auto relative z-10">
               {/* 💥 移动端降级 4：彻底干掉内容区的 blur，使用 bg-white/70 伪装玻璃，桌面端保留 sm:backdrop-blur-lg */}
               <div className="p-6 rounded-[32px] border border-white/50 shadow-sm relative overflow-hidden bg-white/70 sm:bg-white/40 backdrop-blur-none sm:backdrop-blur-lg">
                 <h2 className={`text-3xl font-black ${TEXT_COLORS[id]} leading-tight mb-2 tracking-tight`}>
                    {projects[id]?.title || "Upcoming Project"}
                 </h2>
                 <p className="text-sm font-semibold text-black/60">
                    {projects[id]?.tech || "Stay tuned for more..."}
                 </p>
               </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 text-[180px] text-black/5 font-black tracking-tighter pointer-events-none select-none">
              {id + 1}
            </div>
         </motion.div>
       );
    })}
  </>
);

export const HomeView: React.FC<ViewProps> = ({ onNavigate }) => {
  const [deck, setDeck] = useState([0, 1, 2]); 
  const [isAnimating, setIsAnimating] = useState(false);
  
  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  const handleNextCard = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    clipControls.start({
        rotate: -25, 
        x: -5,
        y: -5,
        transition: { duration: 0.15, ease: 'easeOut' }
    });
    
    idCardControls.start({
        rotate: -9,
        y: -1,
        transition: { duration: 0.15, ease: 'easeOut' }
    });

    await new Promise(r => setTimeout(r, 100));
    setDeck(prev => [prev[1], prev[2], prev[0]]);
    await new Promise(r => setTimeout(r, 250));

    clipControls.start({
        rotate: -4, 
        x: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 400, damping: 20 }
    });
    
    idCardControls.start({
        rotate: -6,
        y: 0,
        transition: { type: 'spring', stiffness: 500, damping: 12 }
    });

    setIsAnimating(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="relative w-full max-w-[360px] mx-auto pt-36 pb-20 px-2"
    >
      <div className="relative w-full h-[360px] cursor-pointer group" onClick={handleNextCard}>
        <MetalClipBack />
        <IDCard controls={idCardControls} />
        <MetalClipFront controls={clipControls} />
        <ProjectDeck deck={deck} />
      </div>

      <div className="w-full mt-12 space-y-4 z-10 relative">
         <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest ml-3 mb-4">Interactive Hub</h3>
         <div 
           className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-[32px] p-5 flex items-center gap-5 cursor-pointer transition-all active:scale-[0.98]"
           onClick={() => onNavigate?.('guestbook')}
         >
            <div className="w-14 h-14 bg-[#1A1A1A] rounded-[20px] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border border-white/5">
               <MessageSquare size={24} className="text-white/80" />
            </div>
            <div className="flex-1">
               <div className="font-bold text-white text-lg tracking-tight">留言板 Guestbook</div>
               <div className="text-[12px] text-white/50 font-medium mt-1">"{thoughts[0]?.content?.substring(0,18)}..."</div>
            </div>
            <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
               <Plus size={18} className="text-[#D9F99D]" />
            </div>
         </div>
      </div>
    </motion.div>
  );
};