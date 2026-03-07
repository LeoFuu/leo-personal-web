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

/* ========================================================================
   🧩 解耦模块 1：金属背夹 (Z-20)
   ======================================================================== */
const MetalClipBack = () => (
  <div 
     className="absolute z-20 pointer-events-none"
     style={{ 
       top: '-34px', left: '6px', width: '24px', height: '80px', borderRadius: '99px',
       background: 'linear-gradient(90deg, #374151 0%, #6B7280 40%, #1F2937 100%)', 
       boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.6)',
       transform: 'rotate(-4deg)',
       outline: '1px solid transparent',
       backfaceVisibility: 'hidden',
     }} 
  />
);

/* ========================================================================
   🧩 解耦模块 2：名片 ID Card (Z-40)
   💥 升级：去掉了静态的 tailwind rotate，改为 motion.div 接受物理引擎控制
   ======================================================================== */
const IDCard = ({ controls }: { controls: any }) => (
  <motion.div 
     className="absolute top-[-90px] left-[0px] z-40 bg-[#F8F9FA] rounded-[36px] w-[280px] h-[95px] flex items-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] border border-white/50"
     style={{
        // 💥 核心物理逻辑：将旋转锚点精确设置在“金属夹子咬合的中心位置”
        transformOrigin: '20px 65px' 
     }}
     initial={{ rotate: -6 }} // 初始角度依然完美保持 -6 度
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

/* ========================================================================
   🧩 解耦模块 3：前置动态夹片 (Z-50)
   ======================================================================== */
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
       outline: '1px solid transparent',
       backfaceVisibility: 'hidden',
       willChange: 'transform'
     }}
     animate={controls}
  >
      <div className="absolute top-[15%] bottom-[15%] left-[50%] w-[2px] bg-black/10 shadow-[inset_1px_0_1px_rgba(255,255,255,0.4)] -translate-x-1/2 rounded-full" />
  </motion.div>
);

/* ========================================================================
   🧩 解耦模块 4：物理轮换项目卡片组 (Z-30)
   ======================================================================== */
const ProjectDeck = ({ deck }: { deck: number[] }) => (
  <>
    {[0, 1, 2].map((id) => {
       const position = deck.indexOf(id);
       return (
         <motion.div 
           key={id}
           animate={{
             rotate: position === 0 ? 0 : position === 1 ? 5 : 10,
             x: position === 0 ? 0 : position === 1 ? 8 : 20,
             y: position === 0 ? 0 : position === 1 ? 16 : 32,
             scale: position === 0 ? 1 : position === 1 ? 0.95 : 0.9,
             zIndex: 30 - position * 10,
             opacity: position === 2 ? 0.8 : 1
           }}
           transition={{ type: 'spring', stiffness: 300, damping: 25 }}
           className={`absolute inset-0 ${CARD_COLORS[id]} rounded-[48px] shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between overflow-hidden border border-white/20`}
         >
            <div className="flex justify-between items-start pl-6 relative z-10">
               <div className="bg-white/50 backdrop-blur-lg px-4 py-2 rounded-full text-[11px] font-bold text-black/80 uppercase tracking-widest border border-white/40 shadow-inner">
                  Project {id + 1}
               </div>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <Heart size={20} className="text-black fill-black" />
               </div>
            </div>
            
            <div className="mt-auto relative z-10">
               <div className="bg-white/40 backdrop-blur-2xl p-6 rounded-[32px] border border-white/50 shadow-sm">
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

/* ========================================================================
   🧩 解耦模块 5：方案A - 背景磨砂玻璃便利贴 (Z-39)
   ======================================================================== */
const BackgroundStickyNote = () => (
  <motion.div
    className="absolute z-39 w-[150px] p-4 flex flex-col gap-2 rounded-xl border border-white/40 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.2)]"
    style={{
      top: '-130px',     
      left: '10px',      
      rotate: '6deg',      
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}
    whileHover={{ scale: 1.05, rotate: 8, y: 10, transition: { type: 'spring', stiffness: 300 } }} 
  >
    <div 
      className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-10 h-4 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-sm" 
      style={{ rotate: '-4deg' }} 
    />
    <p className="text-[11px] leading-relaxed font-semibold text-slate-800/90 italic mt-1">
       "{thoughts[0]?.content || '独立开发不仅是写代码，更是对产品灵魂的雕琢。'}"
    </p>
    <div className="text-[8px] font-mono font-bold text-slate-800/40 text-right uppercase tracking-widest mt-1">
       Daily Mood
    </div>
  </motion.div>
);

/* ========================================================================
   🚀 主视图容器
   ======================================================================== */
export const HomeView: React.FC<ViewProps> = ({ onNavigate }) => {
  const [deck, setDeck] = useState([0, 1, 2]); 
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 💥 为夹子和名片分别声明物理控制器
  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  // 💥 闲置状态下，让名片随风微微晃动 (环境呼吸感)
  useEffect(() => {
    idCardControls.start({
        rotate: [-6, -4, -6],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    });
  }, [idCardControls]);

  const handleNextCard = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // 1. 夹子张开时
    clipControls.start({
        rotate: -25, 
        x: -5,
        y: -5,
        boxShadow: 'inset -1px -2px 3px rgba(0,0,0,0.3), 10px 15px 20px rgba(0,0,0,0.4)',
        transition: { duration: 0.15, ease: 'easeOut' }
    });
    // 💥 名片失去夹紧力，微微往下垂 (增加角度)
    idCardControls.start({
        rotate: -9,
        y: -1,
        transition: { duration: 0.15, ease: 'easeOut' }
    });

    await new Promise(r => setTimeout(r, 100));
    setDeck(prev => [prev[1], prev[2], prev[0]]);
    await new Promise(r => setTimeout(r, 250));

    // 2. 夹子狠狠咬合时
    clipControls.start({
        rotate: -4, 
        x: 0,
        y: 0,
        boxShadow: 'inset -1px -2px 4px rgba(0,0,0,0.2), 4px 8px 12px rgba(0,0,0,0.5)',
        transition: { type: 'spring', stiffness: 400, damping: 20 }
    });
    // 💥 名片受到物理撞击，带有弹簧效果的震颤，然后恢复闲置晃动
    idCardControls.start({
        rotate: -6,
        y: 0,
        transition: { type: 'spring', stiffness: 500, damping: 12 }
    }).then(() => {
        idCardControls.start({
            rotate: [-6, -4, -6],
            transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        });
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
        {/* 💥 将控制器传入名片 */}
        <IDCard controls={idCardControls} />
        <MetalClipFront controls={clipControls} />
        <ProjectDeck deck={deck} />
        
        <BackgroundStickyNote />
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