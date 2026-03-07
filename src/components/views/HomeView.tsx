// src/components/views/HomeView.tsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, Plus, MessageSquare, ArrowRight, Verified } from 'lucide-react';
import { HolographicAvatar } from '../ui/HolographicAvatar';
import { projects, thoughts } from '../../config/site';

// 💥 引入小黑精灵组件
import { VoidSpirit } from '../features/VoidSpirit';

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

// 💥 将灵感精灵的 Props 传给 IDCard
const IDCard = ({ controls, showSpiritHere, isPreparing, jumpType, bumpCount }: any) => (
  <motion.div 
     className="absolute top-[-90px] left-[0px] z-40 bg-[#F8F9FA] rounded-[36px] w-[280px] h-[95px] flex items-center shadow-lg sm:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] border border-white/50"
     style={{
        transformOrigin: '20px 65px',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform',
     }}
     initial={{ rotate: -6 }} 
     animate={controls}
  >
     {/* 💥 精灵降落区：直接坐在名片内部！继承名片的所有摇晃效果！ */}
     {showSpiritHere && (
        <VoidSpirit 
           // 每次 bumpCount 改变，就会原地触发一次 hop 跳跃
           locationId={`home-card-${bumpCount}`} 
           isPreparing={isPreparing} 
           // 只有在准备切页时才用 soar/dive，平时颠簸强制用 hop
           jumpType={isPreparing ? jumpType : 'hop'} 
        />
     )}

     <div className="relative ml-[52px] shrink-0 z-10">
        <div 
          className="w-14 h-14 rounded-full overflow-hidden bg-black/5 border-[2px] border-white shadow-sm"
          style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', isolation: 'isolate' }}
        >
           <HolographicAvatar className="w-full h-full scale-125" />
        </div>
     </div>
     
     <div className="ml-4 flex flex-col justify-center z-10">
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
     style={{ WebkitBackfaceVisibility: 'hidden', willChange: 'transform' }}
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
             WebkitBackfaceVisibility: 'hidden',
             willChange: 'transform, opacity, z-index',
             transform: 'translateZ(0)',
           }}
           animate={{
             rotate: position === 0 ? 0 : position === 1 ? 5 : 10,
             x: position === 0 ? 0 : position === 1 ? 8 : 20,
             y: position === 0 ? 0 : position === 1 ? 16 : 32,
             scale: position === 0 ? 1 : position === 1 ? 0.95 : 0.9,
             zIndex: 30 - position * 10,
             opacity: position === 2 ? 0.8 : 1
           }}
           transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.8 }}
           className={`absolute inset-0 ${CARD_COLORS[id]} rounded-[48px] shadow-md sm:shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between border border-white/20`}
         >
            <div className="absolute inset-0 overflow-hidden rounded-[48px] pointer-events-none">
               <div className="absolute -bottom-6 -right-6 text-[180px] text-black/5 font-black tracking-tighter select-none">
                 {id + 1}
               </div>
            </div>

            <div className="flex justify-between items-start pl-6 relative z-10">
               <div className="bg-white/90 sm:bg-white/50 backdrop-blur-none sm:backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold text-black/80 uppercase tracking-widest border border-white/40 shadow-sm">
                  Project {id + 1}
               </div>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Heart size={20} className="text-black fill-black" />
               </div>
            </div>
            
            <div className="mt-auto relative z-10">
               <div className="p-6 rounded-[32px] border border-white/50 shadow-sm relative overflow-hidden bg-white/70 sm:bg-white/40 backdrop-blur-none sm:backdrop-blur-lg">
                 <h2 className={`text-3xl font-black ${TEXT_COLORS[id]} leading-tight mb-2 tracking-tight`}>
                    {projects[id]?.title || "Upcoming Project"}
                 </h2>
                 <p className="text-sm font-semibold text-black/60">
                    {projects[id]?.tech || "Stay tuned for more..."}
                 </p>
               </div>
            </div>
         </motion.div>
       );
    })}
  </>
);

export const HomeView: React.FC<ViewProps> = ({ onNavigate, showSpiritHere, isPreparing, jumpType }) => {
  const [deck, setDeck] = useState([0, 1, 2]); 
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 💥 颠簸触发器计数
  const [bumpCount, setBumpCount] = useState(0);

  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  const handleNextCard = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    clipControls.start({ rotate: -25, x: -5, y: -5, transition: { duration: 0.08, ease: 'easeOut' } });
    idCardControls.start({ rotate: -9, y: -1, transition: { duration: 0.08, ease: 'easeOut' } });

    await new Promise(r => setTimeout(r, 40));
    setDeck(prev => [prev[1], prev[2], prev[0]]);
    await new Promise(r => setTimeout(r, 60));

    // 💥 灵魂联动：在名片狠狠回弹的这一瞬间，给计数器 +1
    // 这会导致 VoidSpirit 的 locationId 改变，立刻触发一次原地的 Hop 动画！
    setBumpCount(prev => prev + 1);

    clipControls.start({ rotate: -4, x: 0, y: 0, transition: { type: 'spring', stiffness: 600, damping: 20 } });
    idCardControls.start({ rotate: -6, y: 0, transition: { type: 'spring', stiffness: 600, damping: 15 } });

    setTimeout(() => setIsAnimating(false), 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="relative w-full max-w-[360px] mx-auto pt-36 pb-20 px-2"
    >
      <div className="relative w-full h-[360px] cursor-pointer group" onClick={handleNextCard}>
        <MetalClipBack />
        
        {/* 💥 把 Props 传给 IDCard */}
        <IDCard 
           controls={idCardControls} 
           showSpiritHere={showSpiritHere} 
           isPreparing={isPreparing} 
           jumpType={jumpType} 
           bumpCount={bumpCount} 
        />
        
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