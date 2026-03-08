// src/components/views/Home/IDCard.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Verified } from 'lucide-react';
import { HolographicAvatar } from '../../ui/HolographicAvatar';
import { VoidSpirit } from '../../features/VoidSpirit';

interface IDCardProps {
  controls: any;
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
  bumpCount: number;
}

export const IDCard: React.FC<IDCardProps> = ({ controls, showSpiritHere, isPreparing, jumpType, bumpCount }) => {
  
  // 起跳前瞬间“踩平”名片，完美防止向右闪烁
  useEffect(() => {
    if (isPreparing) {
      controls.start({ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    } else {
      controls.start({ rotate: -6, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    }
  }, [isPreparing, controls]);

  return (
    <motion.div 
       className="absolute top-[-90px] left-[0px] z-40 bg-[#F8F9FA] rounded-[36px] w-[280px] h-[95px] flex items-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] border border-white/50"
       style={{
          transformOrigin: '20px 65px',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
       }}
       initial={{ rotate: -6 }} 
       animate={controls}
    >
       {showSpiritHere && (
          <VoidSpirit 
             // 💥 终极神级物理特效：加回 bumpCount！
             // 当名片被点击并像蹦床一样回弹时，bumpCount 刷新，触发小精灵的原地被动弹跳！
             locationId={`home-card-${bumpCount}`} 
             isPreparing={isPreparing} 
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
};