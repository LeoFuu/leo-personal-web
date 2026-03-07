// src/components/views/Home/ProjectDeck.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { projects } from '../../../config/site';

const CARD_COLORS = ['bg-[#D9F99D]', 'bg-[#E9D5FF]', 'bg-[#BAE6FD]'];
const TEXT_COLORS = ['text-[#3F6212]', 'text-[#6B21A8]', 'text-[#0369A1]'];

export const ProjectDeck = ({ deck }: { deck: number[] }) => (
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
           className={`absolute inset-0 ${CARD_COLORS[id]} rounded-[48px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-8 flex flex-col justify-between border border-white/20`}
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