// src/components/views/Home/ProjectDeck.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { projects } from '../../../config/site';

const CARD_COLORS = ['bg-[#D9F99D]', 'bg-[#E9D5FF]', 'bg-[#BAE6FD]'];
const TEXT_COLORS = ['text-[#3F6212]', 'text-[#6B21A8]', 'text-[#0369A1]'];

export const ProjectDeck = ({ deck, onOpenDetail }: { deck: number[], onOpenDetail: (id: number) => void }) => (
  <>
    {[0, 1, 2].map((id) => {
       const position = deck.indexOf(id);
       const project = projects[id];

       return (
         <motion.div 
           key={id}
           style={{ 
             willChange: 'transform',
             WebkitMaskImage: '-webkit-radial-gradient(white, black)',
             transform: 'translateZ(0)',
             isolation: 'isolate', // 💥 保持隔离
           }}
           animate={{
             rotate: position === 0 ? 0 : position === 1 ? 5 : 10,
             x: position === 0 ? 0 : position === 1 ? 8 : 20,
             y: position === 0 ? 0 : position === 1 ? 16 : 32,
             scale: position === 0 ? 1 : position === 1 ? 0.95 : 0.9,
             zIndex: 30 - position * 10,
           }}
           transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
           className={`absolute inset-0 rounded-[48px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] p-6 flex flex-col border border-white/40 overflow-hidden group`}
         >
            {/* 💥 终极硬壳：把颜色抽离成一个绝对定位的底层色块！这样 GPU 绝对不敢把它丢掉！ */}
            <div className={`absolute inset-0 ${CARD_COLORS[id]} z-[-1] pointer-events-none`} />

            {/* 数字底纹 */}
            <div className="absolute inset-0 overflow-hidden rounded-[48px] pointer-events-none z-0">
               <div className="absolute -bottom-6 -right-6 text-[180px] text-black/5 font-black tracking-tighter select-none">
                 {id + 1}
               </div>
            </div>

            {/* 顶部标签 */}
            <div className="flex justify-between items-start relative z-20">
               <div className="bg-white/95 sm:bg-white/50 backdrop-blur-none sm:backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold text-black/80 uppercase tracking-widest border border-white/60 shadow-sm">
                 Project {id + 1}
               </div>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                  <Heart size={20} className="text-black fill-black" />
               </div>
            </div>

            {/* 封面图 */}
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
            
            {/* 底部信息舱 */}
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
                       {/* 💥 修复：删掉 truncate，加上 line-clamp-2（最多两行），并把 text-2xl 稍微调小一点防止太挤 */}
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