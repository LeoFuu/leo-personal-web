// src/components/views/Home/ProjectDeck.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { projects } from '../../../config/site';

const CARD_COLORS = ['bg-[#D9F99D]', 'bg-[#E9D5FF]', 'bg-[#BAE6FD]'];
const TEXT_COLORS = ['text-[#3F6212]', 'text-[#6B21A8]', 'text-[#0369A1]'];

export const ProjectDeck = ({ deck, onOpenDetail }: { deck: number[], onOpenDetail: (id: number) => void }) => (
  <>
    {deck.map((id, index) => {
       const project = projects[id];
       // 💥 修复：把位置计算简化
       const position = index;

       return (
         <motion.div 
           key={id}
           // 💥 核心修复：启用 layout，让 Framer Motion 自己去极其高效地计算位置变化，别再手动算弹簧了！
           layout
           initial={false}
           style={{ 
             willChange: 'transform',
             WebkitMaskImage: '-webkit-radial-gradient(white, black)',
             transform: 'translateZ(0)',
             isolation: 'isolate',
             // 把位置样式直接写死在 style 里，让 layout 去补间
             rotate: position === 0 ? 0 : position === 1 ? 5 : 10,
             x: position === 0 ? 0 : position === 1 ? 8 : 20,
             y: position === 0 ? 0 : position === 1 ? 16 : 32,
             scale: position === 0 ? 1 : position === 1 ? 0.95 : 0.9,
             zIndex: 30 - position * 10,
           }}
           // 💥 极简过渡，绝对不卡主线程
           transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
           className={`absolute inset-0 rounded-[48px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] p-6 flex flex-col border border-white/40 overflow-hidden group`}
         >
            <div className={`absolute inset-0 ${CARD_COLORS[id]} z-[-1] pointer-events-none`} />

            <div className="absolute inset-0 overflow-hidden rounded-[48px] pointer-events-none z-0">
               <div className="absolute -bottom-6 -right-6 text-[180px] text-black/5 font-black tracking-tighter select-none">
                 {id + 1}
               </div>
            </div>

            <div className="flex justify-between items-start relative z-20">
               <div className="bg-white/95 sm:bg-white/50 backdrop-blur-none sm:backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold text-black/80 uppercase tracking-widest border border-white/60 shadow-sm">
                 Project {id + 1}
               </div>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                  <Heart size={20} className="text-black fill-black" />
               </div>
            </div>

            <div className="absolute inset-x-8 top-[64px] bottom-[186px] z-10 rounded-[20px] overflow-hidden bg-black/5 border border-white/50 shadow-inner">
                {project?.cover ? (
                  <img 
                    src={project.cover} 
                    alt="Project Cover" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-black/20">
                     <ImageIcon size={32} className="mb-2 opacity-50" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">No Cover Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </div>
            
            <div className="mt-auto relative z-20">
               <div className="p-4 sm:p-5 rounded-[32px] border border-white/60 shadow-xl bg-white/95 sm:bg-white/60 backdrop-blur-none sm:backdrop-blur-xl flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                    <div className="w-16 h-16 shrink-0 rounded-[16px] bg-gradient-to-br from-white to-black/5 border border-white shadow-sm overflow-hidden flex items-center justify-center p-0.5">
                       {project?.icon ? (
                         <img src={project.icon} alt="icon" className="w-full h-full object-contain drop-shadow-md scale-110" />
                       ) : (
                         <div className="w-full h-full bg-black/10 rounded-[12px]" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h2 className={`text-[20px] font-black ${TEXT_COLORS[id]} leading-[1.1] mb-1 tracking-tight line-clamp-2`}>
                          {project?.title || "Upcoming"}
                       </h2>
                       <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest truncate">
                          {project?.tech || "TECH STACK"}
                       </p>
                    </div>
                 </div>
                 <p className="text-[12px] font-medium text-black/70 leading-snug line-clamp-2 h-[34px]">
                    {project?.description || "A revolutionary tool that bridges the gap between AI and e-commerce marketing."}
                 </p>
                 <div className="flex items-center gap-2 pt-1">
                    <button 
                       onClick={(e) => { e.stopPropagation(); onOpenDetail(id); }}
                       className={`flex-1 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-white/60 shadow-md ${TEXT_COLORS[id]} text-[10px] font-black uppercase tracking-widest transition-all active:scale-95`}
                    >
                       View Detail
                    </button>
                    <button 
                       onClick={(e) => { e.stopPropagation(); onOpenDetail(id); }}
                       className="w-9 h-9 shrink-0 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                    >
                       <ArrowUpRight size={16} className="text-black/70" />
                    </button>
                 </div>
               </div>
            </div>
            
         </motion.div>
       );
    })}
  </>
);