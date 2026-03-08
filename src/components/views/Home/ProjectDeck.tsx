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
             // 💥 终极保命魔法：强制 GPU 把这个卡片及里面的所有东西合并成“一张平面的贴图”，绝不允许文字飞出圆角！
             WebkitTransform: 'translate3d(0,0,0)',
             transform: 'translate3d(0,0,0)',
             WebkitBackfaceVisibility: 'hidden',
             backfaceVisibility: 'hidden',
             willChange: 'transform',
           }}
           animate={{
             rotate: position === 0 ? 0 : position === 1 ? 5 : 10,
             x: position === 0 ? 0 : position === 1 ? 8 : 20,
             y: position === 0 ? 0 : position === 1 ? 16 : 32,
             scale: position === 0 ? 1 : position === 1 ? 0.95 : 0.9,
             
             // 💥 删除了夺命的 Z 轴 (z: 10)! 纯粹依赖 zIndex 进行 2D 层叠，这是 iOS 最不容易出错的模式。
             zIndex: 30 - position * 10,
           }}
           transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
           className={`absolute inset-0 ${CARD_COLORS[id]} rounded-[48px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] p-6 flex flex-col border border-white/20 overflow-hidden`}
         >
            {/* 数字底纹 */}
            <div className="absolute inset-0 overflow-hidden rounded-[48px] pointer-events-none z-0">
               <div className="absolute -bottom-6 -right-6 text-[180px] text-black/5 font-black tracking-tighter select-none">
                 {id + 1}
               </div>
            </div>

            {/* 顶部标签 */}
            <div className="flex justify-between items-start relative z-20">
               <div className="bg-white/90 sm:bg-white/50 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold text-black/80 uppercase tracking-widest border border-white/40 shadow-sm">
                 Project {id + 1}
               </div>
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                  <Heart size={20} className="text-black fill-black" />
               </div>
            </div>

            {/* 封面图 */}
            <div className="absolute inset-x-8 top-[64px] bottom-[186px] z-10 rounded-[20px] overflow-hidden bg-black/5 border border-white/30 shadow-inner group">
                {project?.cover ? (
                  <img 
                    src={project.cover} 
                    alt="Project Cover" 
                    // 这里去掉了 async 和 lazy，让关键图片同步加载，杜绝滑动白块
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
               <div className="p-4 sm:p-5 rounded-[32px] border border-white/50 shadow-lg bg-white/80 sm:bg-white/60 backdrop-blur-xl flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                    <div className="w-16 h-16 shrink-0 rounded-[16px] bg-gradient-to-br from-white to-black/5 border border-white shadow-sm overflow-hidden flex items-center justify-center p-0.5">
                       {project?.icon ? (
                         <img src={project.icon} alt="icon" className="w-full h-full object-contain drop-shadow-md scale-110" />
                       ) : (
                         <div className="w-full h-full bg-black/10 rounded-[12px]" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h2 className={`text-2xl font-black ${TEXT_COLORS[id]} leading-none mb-1 tracking-tight truncate`}>
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
                       className={`flex-1 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-white/50 shadow-sm ${TEXT_COLORS[id]} text-[10px] font-black uppercase tracking-widest transition-all active:scale-95`}
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