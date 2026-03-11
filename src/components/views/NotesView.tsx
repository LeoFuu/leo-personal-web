// src/components/views/NotesView.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  rotation: number;
  offsetX: number;
}

const physicalPropsPool = [
  { rotation: -1.5, offsetX: -4 },
  { rotation: 1, offsetX: 4 },
  { rotation: -1, offsetX: -2 },
  { rotation: 1.5, offsetX: 2 },
  { rotation: -0.5, offsetX: -3 },
  { rotation: 2, offsetX: 3 },
];

export const NotesView = () => {
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // 💥 优化点 1：将物理弹簧调紧凑，减少拖泥带水的长尾计算时间
  const springConfig = { type: "spring" as const, stiffness: 450, damping: 30, mass: 0.8 };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nav = document.getElementById('global-navbar');
    if (!nav) return;

    if (selectedId) {
      nav.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      nav.style.transform = 'translate(-50%, 150px)';
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
    } else {
      nav.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      nav.style.transform = 'translate(-50%, 0)';
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    }
  }, [selectedId]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) {
          const formattedNotes = data.map((note, index) => {
            const dateObj = new Date(note.created_at);
            const dateStr = `${dateObj.getFullYear()}.${dateObj.getMonth() + 1}.${dateObj.getDate()}`;
            const physicalProps = physicalPropsPool[index % physicalPropsPool.length];
            return {
              id: `note-${note.id}`,
              title: note.title,
              content: note.content,
              date: dateStr,
              rotation: physicalProps.rotation,
              offsetX: physicalProps.offsetX
            };
          });
          setNotesData(formattedNotes);
        }
      } catch (err) {
        console.error("拉取笔记失败:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        className="pt-2 pb-40 px-5 sm:px-0 w-full min-h-screen flex flex-col items-center"
      >
        <div className="relative w-full max-w-md flex flex-col items-center">
          
          {isLoading && (
            <div className="py-20 flex flex-col items-center text-slate-400 gap-3">
               <Loader2 size={24} className="animate-spin opacity-50" />
               <span className="text-[12px] font-bold tracking-widest uppercase">读取档案中...</span>
            </div>
          )}

          {!isLoading && notesData.length === 0 && (
            <div className="py-20 flex flex-col items-center text-slate-400 gap-3">
               <span className="text-[14px] font-medium tracking-wide">你的档案库还是空的</span>
            </div>
          )}

          {!isLoading && notesData.map((note, index) => {
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
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* 💥 优化点 2：外层卡片在手机端 (bg-white) 去除毛玻璃，PC端 (sm:bg-white/90 sm:backdrop-blur-xl) 开启 */}
                <div className="w-full rounded-[32px] p-6 sm:p-8 bg-white sm:bg-white/90 sm:backdrop-blur-xl border border-slate-100 sm:border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] sm:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] flex flex-col min-h-[160px] overflow-hidden relative group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-60 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <motion.h3 layoutId={`title-${note.id}`} className="text-[22px] font-black text-slate-800 leading-tight tracking-tight mb-3 text-center">{note.title}</motion.h3>
                    <p className="text-[14px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-2 indent-[2em]">{note.content}</p>
                  </div>
                  <div className="relative z-10 flex justify-end mt-auto pt-2">
                    <span className="text-[11px] font-bold text-slate-400/60 tracking-wider">{note.date}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {selectedId && (
            <>
              {/* 遮罩层（手机端用透明度就够了，不用毛玻璃） */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 sm:bg-slate-900/40 sm:backdrop-blur-sm z-[99998] will-change-opacity"
                onClick={() => setSelectedId(null)}
              />
              
              {/* 弹出的卡片主体 */}
              {(() => {
                const activeNote = notesData.find(n => n.id === selectedId);
                if (!activeNote) return null;
                return (
                  <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                    <motion.div
                      layoutId={`card-container-${activeNote.id}`}
                      // 💥 优化点 3（最核心）：手机端弹窗绝对禁用 backdrop-blur，改用纯白背景 bg-white！PC端再用 sm:backdrop-blur-3xl
                      className="w-full max-w-lg max-h-[85vh] rounded-[40px] shadow-2xl relative flex flex-col pointer-events-auto border border-slate-100 sm:border-white/60 bg-white sm:bg-white/95 sm:backdrop-blur-3xl overflow-hidden"
                      // 💥 优化点 4：强制硬件加速，提前声明变化
                      style={{ 
                        willChange: 'transform, border-radius', 
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden'
                      }}
                      // 💥 优化点 5：给放大动画指定一个干脆利落的过渡，拒绝算力黑洞
                      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
                      drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2}
                      onDragEnd={(e, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) setSelectedId(null); }}
                    >
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
                         <button onClick={() => setSelectedId(null)} className="w-9 h-9 rounded-full bg-slate-100/60 backdrop-blur hover:bg-slate-200 flex items-center justify-center transition-colors active:scale-95 shadow-sm border border-slate-200/50">
                           <X size={16} className="text-slate-600" />
                         </button>
                      </div>
                      
                      <div className="p-6 pt-16 sm:p-10 sm:pt-20 flex-1 flex flex-col overflow-y-auto relative z-10 scrollbar-hide">
                         <motion.h3 layoutId={`title-${activeNote.id}`} className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight tracking-tight mb-8 text-center">{activeNote.title}</motion.h3>
                         
                         <div className="text-[15px] sm:text-[16px] font-medium text-slate-600 leading-loose flex-1">
                           {activeNote.content.split('\n').map((paragraph, index) => (
                             <p key={index} className="indent-[2em] mb-4 min-h-[1.5em]">
                               {paragraph}
                             </p>
                           ))}
                         </div>
                         
                         <div className="mt-8 pt-6 border-t border-slate-100/50 flex justify-end">
                           <span className="text-[12px] font-bold text-slate-400/60 tracking-wider">{activeNote.date}</span>
                         </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })()}
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};