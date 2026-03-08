// src/components/views/Home/HomeIndex.tsx
import React, { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { MetalClipBack, MetalClipFront } from './MetalClip';
import { IDCard } from './IDCard';
import { ProjectDeck } from './ProjectDeck';
import { ProjectModal } from './ProjectModal'; // 💥 引入弹窗

export interface HomeProps {
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
}

export const HomeIndex: React.FC<HomeProps> = ({ showSpiritHere, isPreparing, jumpType }) => {
  const [deck, setDeck] = useState([0, 1, 2]); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [bumpCount, setBumpCount] = useState(0);
  
  // 💥 新增：管理详情页状态
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  const handleNextCard = async () => {
    // 如果弹窗开着，不允许切牌
    if (isAnimating || selectedProjectId !== null) return;
    setIsAnimating(true);

    clipControls.start({ rotate: -25, x: -5, y: -5, transition: { duration: 0.08, ease: 'easeOut' } });
    idCardControls.start({ rotate: -9, y: -1, transition: { duration: 0.08, ease: 'easeOut' } });

    await new Promise(r => setTimeout(r, 40));
    setDeck(prev => [prev[1], prev[2], prev[0]]);
    await new Promise(r => setTimeout(r, 60));

    setBumpCount(prev => prev + 1);

    clipControls.start({ rotate: -4, x: 0, y: 0, transition: { type: 'spring', stiffness: 600, damping: 20 } });
    idCardControls.start({ rotate: -6, y: 0, transition: { type: 'spring', stiffness: 600, damping: 15 } });

    setTimeout(() => setIsAnimating(false), 100);
  };

  return (
    <>
      {/* 💥 把 Modal 放在最外层，保证它能盖住所有东西 */}
      <ProjectModal 
        projectId={selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative w-full max-w-[360px] mx-auto pt-36 pb-4 px-2"
      >
        <div className="relative w-full h-[360px] cursor-pointer group" onClick={handleNextCard}>
          <MetalClipBack />
          <IDCard 
            controls={idCardControls} 
            showSpiritHere={showSpiritHere} 
            isPreparing={isPreparing} 
            jumpType={jumpType} 
            bumpCount={bumpCount} 
          />
          <MetalClipFront controls={clipControls} />
          {/* 💥 把打开详情的方法传给卡片 */}
          <ProjectDeck deck={deck} onOpenDetail={setSelectedProjectId} />
        </div>
      </motion.div>
    </>
  );
};