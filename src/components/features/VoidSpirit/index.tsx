// src/components/features/VoidSpirit/index.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion'; // <-- 这里引入了 Variants
import { useSpiritAnimation } from './useSpiritAnimation';

interface VoidSpiritProps {
  isNavigating?: boolean;
  isPreparing?: boolean;
  locationId: string;
  jumpType?: 'hop' | 'dive' | 'soar';
}

export const VoidSpirit: React.FC<VoidSpiritProps> = ({ 
  isNavigating = false, 
  isPreparing = false, 
  locationId, 
  jumpType = 'hop' 
}) => {
  const { mousePosition, animationState, setAnimationState, getJumpParams } = useSpiritAnimation(isPreparing, locationId, jumpType);
  const jumpParams = getJumpParams();

  // <-- 这里加上了 : Variants
  const bodyVariants: Variants = {
    idle: {
      scaleY: [1, 1.05, 1],
      scaleX: [1, 0.98, 1],
      y: [0, -3, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    preparing: { scaleY: 0.7, scaleX: 1.3, y: 5, transition: { duration: 0.15, ease: "easeOut" } },
    jumping: {
      scaleY: jumpType === 'hop' ? [1, 1.1, 0.95, 1] : [0.8, 1.3, 0.9, 1],
      scaleX: jumpType === 'hop' ? [1, 0.9, 1.05, 1] : [1.2, 0.7, 1.1, 1],
      y: 0,
      transition: { duration: jumpParams.duration, times: jumpParams.times, ease: jumpParams.ease as any } // <-- 第一个 as any
    }
  };

  return (
    <motion.div 
      layoutId="spirit-body"
      className={`absolute z-50 flex justify-center items-end pointer-events-none ${isNavigating ? '-top-5 w-10 h-8' : '-top-9 right-8 w-16 h-14'}`}
      initial={false} 
      transition={{ type: "spring", stiffness: jumpType === 'hop' ? 500 : 300, damping: 30, mass: 0.8 }}
    >
      <motion.div
        key={locationId}
        initial={{ y: 0 }}
        animate={animationState === 'preparing' ? { y: 0 } : { y: [0, jumpParams.y, 0] }}
        // <-- 第二个 as any 在这里
        transition={animationState === 'preparing' ? { duration: 0.15 } : { duration: jumpParams.duration, times: jumpParams.times, ease: jumpParams.ease as any }}
        className="w-full h-full flex justify-center items-end relative"
      >
        <motion.div 
          variants={bodyVariants}
          key={locationId} 
          animate={animationState}
          onAnimationComplete={() => { if (animationState === 'jumping') setAnimationState('idle'); }}
          className="relative bg-black flex justify-center items-center gap-[12%] z-20 shadow-2xl border border-white/10"
          style={{ width: '100%', height: '80%', boxShadow: "inset -2px -2px 6px rgba(255,255,255,0.1), 0 5px 15px rgba(0,0,0,0.5)", borderRadius: "50% 50% 40% 40% / 60% 60% 30% 30%" }}
        >
          {[1, 2].map(i => (
            <div key={i} className="w-[28%] h-[35%] bg-[#FFD700] rounded-full relative overflow-hidden shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                <motion.div animate={{ x: mousePosition.x, y: mousePosition.y }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-[40%] h-[40%] bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          ))}
        </motion.div>
        <motion.div 
          animate={animationState === 'jumping' ? { opacity: 0, scale: 0.3 } : { opacity: 0.5, scale: 1 }}
          className="absolute -bottom-1 w-[80%] h-2 bg-black/60 blur-md rounded-full -z-10" 
        />
      </motion.div>
    </motion.div>
  );
};