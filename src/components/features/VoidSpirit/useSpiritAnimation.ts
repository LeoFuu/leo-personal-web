// src/components/features/VoidSpirit/useSpiritAnimation.ts
import { useState, useEffect } from 'react';

export const useSpiritAnimation = (isPreparing: boolean, locationId: string, jumpType: string) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationState, setAnimationState] = useState('idle'); 

  useEffect(() => {
    if (isPreparing) setAnimationState('preparing');
    else setAnimationState('jumping');
  }, [locationId, isPreparing]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = (clientX - window.innerWidth / 2) / 25;
      const y = (clientY - window.innerHeight / 2) / 25;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  const getJumpParams = () => {
    switch(jumpType) {
      case 'dive': return { y: -100, duration: 0.6, ease: "circOut", times: [0, 0.4, 1] }; 
      case 'soar': return { y: -60, duration: 0.5, ease: "easeOut", times: [0, 0.45, 1] };   
      default: return { y: -40, duration: 0.3, ease: "circOut", times: [0, 0.5, 1] };  
    }
  };

  return { mousePosition, animationState, setAnimationState, getJumpParams };
};