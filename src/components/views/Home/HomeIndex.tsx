// src/components/views/Home/HomeIndex.tsx
import React, { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { MetalClipBack, MetalClipFront } from './MetalClip';
import { IDCard } from './IDCard';
import { ProjectDeck } from './ProjectDeck';
import { ProjectModal } from './ProjectModal';
import { ProfileModal } from './ProfileModal'; // 💥 引入刚刚写的名片弹窗

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
  // 💥 增加一个控制个人名片弹窗的状态
  const [showProfileModal, setShowProfileModal] = useState(false);

  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  const handleNextCard = async () => {
    if (isAnimating || selectedProjectId !== null || showProfileModal) return;
    setIsAnimating(true);

    clipControls.start({ rotate: -25, x: -5, y: -5, transition: { duration: 0.08, ease: 'easeOut' } });
    idCardControls.start({ rotate: -9, y: -1, transition: { duration: 0.08, ease: 'easeOut' } });

    await new Promise(r => setTimeout(r, 40));
    setDeck(prev => [prev[1], prev[2], prev[0]]);
    await new Promise(r => setTimeout(r, 60));

    setBumpCount(prev => prev + 1);

    clipControls.start({ rotate: -4, x: 0, y: 0, transition: { type: "spring", stiffness: 600, damping: 20 } });
    idCardControls.start({ rotate: -6, y: 0, transition: { type: "spring", stiffness: 600, damping: 15 } });

    setTimeout(() => setIsAnimating(false), 100);
  };

  return (
    <>
      <ProjectModal projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      
      {/* 💥 挂载个人名片弹窗 */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="relative w-full max-w-[360px] mx-auto pt-36 pb-4 px-2"
      >
        <div className="relative w-full h-[360px] cursor-pointer group" onClick={handleNextCard}>
          <MetalClipBack />
          {/* 💥 传入 onOpenProfile 事件，点击名片时打开弹窗 */}
          <IDCard 
            controls={idCardControls} 
            showSpiritHere={showSpiritHere} 
            isPreparing={isPreparing} 
            jumpType={jumpType} 
            bumpCount={bumpCount} 
            onOpenProfile={() => setShowProfileModal(true)}
          />
          <MetalClipFront controls={clipControls} />
          <ProjectDeck deck={deck} onOpenDetail={setSelectedProjectId} />
        </div>
      </motion.div>
    </>
  );
};