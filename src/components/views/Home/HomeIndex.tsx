// src/components/views/Home/HomeIndex.tsx
import React, { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { MetalClipBack, MetalClipFront } from './MetalClip';
import { IDCard } from './IDCard';
import { ProjectDeck } from './ProjectDeck';
import { ProjectModal } from './ProjectModal';

export interface HomeProps {
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
}

export const HomeIndex: React.FC<HomeProps> = ({ showSpiritHere, isPreparing, jumpType }) => {
  const [deck, setDeck] = useState([0, 1, 2]); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [bumpCount, setBumpCount] = useState(0);
  
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  const handleNextCard = async () => {
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
      <ProjectModal projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        // 💥 修复 1：去掉 perspective。在移动端，直接用 2D 排位反而更清爽、更不容易出错
        className="relative w-full max-w-[360px] mx-auto pt-36 pb-4 px-2"
      >
        {/* 💥 修复 2：去掉 transformStyle: 'preserve-3d' */}
        <div className="relative w-full h-[360px] cursor-pointer group" onClick={handleNextCard}>
          <MetalClipBack />
          <IDCard controls={idCardControls} showSpiritHere={showSpiritHere} isPreparing={isPreparing} jumpType={jumpType} bumpCount={bumpCount} />
          <MetalClipFront controls={clipControls} />
          <ProjectDeck deck={deck} onOpenDetail={setSelectedProjectId} />
        </div>
      </motion.div>
    </>
  );
};