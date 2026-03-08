// src/components/views/NotesView.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const notesData = [
  { id: 'note-1', date: '2026.3.8', title: '物理交互的意义', content: '在屏幕上引入真实的重力、阻尼和惯性，不仅仅是为了炫技。它是在冰冷的数字世界里，重新唤醒人类基因里对真实物体“触摸感”的记忆。当你滑开一张卡片，它回弹的那一瞬间，多巴胺分泌了。', rotation: -1.5, offsetX: -4 },
  { id: 'note-2', date: '2026.3.6', title: 'CSS 性能之神', content: '今天终于降伏了 iOS Safari。绝不能在包含 backdrop-filter 的元素上同时做 overflow:hidden 和 3D 动画，否则背景直接消失。解决方案：用纯色硬壳垫底，配合 -webkit-mask-image 切割圆角。', rotation: 1, offsetX: 4 },
  { id: 'note-3', date: '2026.2.28', title: '关于“留白”', content: '设计不是做加法，而是做减法。把不必要的线条、颜色、装饰统统拿掉。当你觉得一个页面不够高级时，先试着把所有元素的透明度降 20%，把字号改小一号。', rotation: -1, offsetX: -2 },
  { id: 'note-4', date: '2026.2.15', title: '数字花园理念', content: '博客是档案室，每一篇文章都是最终的成品。但数字花园不同，这里是你思想的苗圃。文章可以是不完整的片段，可以是不断修改的草稿。重点是“生长”，而不是“完成”。', rotation: 1.5, offsetX: 2 }
];

export const NotesView = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const springConfig = { type: "spring" as const, stiffness: 400, damping: 25, mass: 1 };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      // 💥 1. 给整个页面容器开启 GPU 加速
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      className="pt-2 pb-40 px-5 sm:px-0 w-full min-h-screen flex flex-col items-center"
    >
      <div className="relative w-full max-w-md flex flex-col items-center">
        {notesData.map((note, index) => {
          const stackZIndex = notesData.length - index;
          return (
            <motion.div
              layoutId={`card-container-${note.id}`} key={note.id} drag="x"
              dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
              onClick={() => setSelectedId(note.id)}
              className={`relative w-full cursor-grab active:cursor-grabbing ${index !== 0 ? '-mt-6' : ''}`}
              initial={{ opacity: 0, y: 50, rotate: note.rotation * 3 }}
              animate={{ opacity: 1, y: 0, rotate: note.rotation, x: note.offsetX, zIndex: stackZIndex }}
              whileHover={{ scale: 1.02, rotate: 0, y: -10, zIndex: 50, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              transition={{ ...springConfig, delay: index * 0.1 }}
              style={{ 
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                isolation: 'isolate',
                // 💥 2. 性能核弹修复：对高强度弹簧动画的卡片强制锁定 3D 图层！
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* 卡片内容保持不变 */}
              <div className="w-full rounded-[32px] p-6 sm:p-8 bg-white/95 sm:bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] flex flex-col min-h-[160px] overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-60 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10 flex-1">
                  <motion.h3 layoutId={`title-${note.id}`} className="text-[22px] font-black text-slate-800 leading-tight tracking-tight mb-3">{note.title}</motion.h3>
                  <p className="text-[14px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-2">{note.content}</p>
                </div>
                <div className="relative z-10 flex justify-end mt-auto pt-2">
                  <span className="text-[11px] font-bold text-slate-400/60 tracking-wider">{note.date}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedId(null)}
            />
            {(() => {
              const activeNote = notesData.find(n => n.id === selectedId);
              if (!activeNote) return null;
              return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                  <motion.div
                    layoutId={`card-container-${activeNote.id}`}
                    className="w-full max-w-lg max-h-[85vh] rounded-[40px] shadow-2xl relative flex flex-col pointer-events-auto border border-white/60 bg-white/95 sm:bg-white/90 backdrop-blur-2xl overflow-hidden"
                    style={{ 
                      WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                      // 💥 3. 给可拖拽的大弹窗强制上锁，防止拖拽掉帧
                      willChange: 'transform', 
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                    drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) setSelectedId(null); }}
                  >
                    <div className="p-6 sm:p-8 flex justify-end items-center relative z-10 border-b border-slate-100/50 bg-white/50">
                       <button onClick={() => setSelectedId(null)} className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors active:scale-95 shadow-sm border border-slate-200"><X size={16} className="text-slate-600" /></button>
                    </div>
                    <div className="p-6 sm:p-10 flex-1 flex flex-col overflow-y-auto relative z-10 scrollbar-hide">
                       <motion.h3 layoutId={`title-${activeNote.id}`} className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight tracking-tight mb-6">{activeNote.title}</motion.h3>
                       <div className="text-[15px] sm:text-[16px] font-medium text-slate-600 leading-loose whitespace-pre-wrap flex-1">{activeNote.content}</div>
                       <div className="mt-8 pt-6 border-t border-slate-100/50 flex justify-end"><span className="text-[12px] font-bold text-slate-400/60 tracking-wider">{activeNote.date}</span></div>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};