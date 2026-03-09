// src/components/views/NotesView.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
// 💥 引入咱们的数据库通讯兵
import { supabase } from '../../lib/supabase';

// 定义笔记的数据结构
interface Note {
  id: string; // 注意为了配合 framer-motion 的 layoutId，我们把 id 转成 string
  title: string;
  content: string;
  date: string;
  // 以下这两个属性是前端赋予的物理属性，不存数据库
  rotation: number;
  offsetX: number;
}

// 预设几个错落有致的物理角度和偏移量池，让每张卡片看起来都有随性的手工感
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
  const springConfig = { type: "spring" as const, stiffness: 400, damping: 25, mass: 1 };

  // 💥 核心逻辑：从 Supabase 拉取真实的长笔记
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // 将数据库的原始数据，映射成带有“格式化时间”和“物理倾斜属性”的前端数据
          const formattedNotes = data.map((note, index) => {
            const dateObj = new Date(note.created_at);
            const dateStr = `${dateObj.getFullYear()}.${dateObj.getMonth() + 1}.${dateObj.getDate()}`;
            
            // 循环使用物理属性池，保证哪怕有 100 篇笔记，角度也是错落的
            const physicalProps = physicalPropsPool[index % physicalPropsPool.length];

            return {
              id: `note-${note.id}`, // 加前缀，防止跟别的组件 ID 冲突
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
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      className="pt-2 pb-40 px-5 sm:px-0 w-full min-h-screen flex flex-col items-center"
    >
      <div className="relative w-full max-w-md flex flex-col items-center">
        
        {/* 💥 Loading 状态 */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center text-slate-400 gap-3">
             <Loader2 size={24} className="animate-spin opacity-50" />
             <span className="text-[12px] font-bold tracking-widest uppercase">加载动画还没做...</span>
          </div>
        )}

        {/* 💥 笔记为空的状态 */}
        {!isLoading && notesData.length === 0 && (
          <div className="py-20 flex flex-col items-center text-slate-400 gap-3">
             <span className="text-[14px] font-medium tracking-wide">你的档案库还是空的</span>
          </div>
        )}

        {/* 💥 渲染真实的笔记卡片叠堆 */}
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
              <div className="w-full rounded-[32px] p-6 sm:p-8 bg-white/95 sm:bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] flex flex-col min-h-[160px] overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-60 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10 flex-1">
                  <motion.h3 layoutId={`title-${note.id}`} className="text-[22px] font-black text-slate-800 leading-tight tracking-tight mb-3">{note.title}</motion.h3>
                  {/* 💥 卡片收起时，只展示两行摘要，超出的文字会被优雅截断 */}
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
                    {/* 💥 展开后，展示完整的文章内容，可以上下滚动 */}
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