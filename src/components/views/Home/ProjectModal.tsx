// src/components/views/Home/ProjectModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
import { projects } from '../../../config/site';

interface ProjectModalProps {
  projectId: number | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ projectId, onClose }) => {
  const project = projectId !== null ? projects[projectId] : null;

  return (
    <AnimatePresence>
      {projectId !== null && project && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-auto">
          {/* 1. 极其高级的全屏毛玻璃遮罩 (点击可关闭) */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* 2. 详情视窗本体 (手机端从底部弹起，PC端从中心放大) */}
          <motion.div
            initial={{ y: '100%', scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: '100%', scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[500px] h-[85vh] sm:h-[650px] bg-[#F8F9FA] sm:rounded-[40px] rounded-t-[40px] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/50 z-10"
            onClick={(e) => e.stopPropagation()} // 阻止点击穿透到遮罩
          >
            {/* 关闭按钮 (悬浮在右上角) */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <X size={20} />
            </button>

            {/* 顶部：超大画幅封面图 */}
            <div className="relative w-full h-[40%] bg-black/5 shrink-0">
              {project.cover && (
                <img 
                  src={project.cover} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-top"
                />
              )}
              {/* 底部渐变遮罩，让文字过渡更自然 */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8F9FA] to-transparent" />
            </div>

            {/* 核心内容区 (可滚动) */}
            <div className="flex-1 overflow-y-auto p-8 pt-2 scrollbar-hide">
              {/* 图标与标题 */}
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-16 h-16 shrink-0 rounded-[16px] bg-white border border-black/5 shadow-md flex items-center justify-center p-1 -mt-8 relative z-10">
                  {project.icon ? (
                    <img src={project.icon} alt="icon" className="w-full h-full object-contain scale-110" />
                  ) : (
                    <div className="w-full h-full bg-black/5 rounded-[12px]" />
                  )}
                </div>
                <div className="pt-2">
                  <h1 className="text-3xl font-black text-[#1A1A1A] leading-none tracking-tight">
                    {project.title}
                  </h1>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                    {project.category}
                  </p>
                </div>
              </div>

              {/* 详细描述 */}
              <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
                  {project.description}
                  {/* 这里为了演示效果加长了文本，未来你可以把真实的长篇 Case Study 放在这里 */}
                  这不仅仅是一个简单的工具，它是对现有工作流的一次彻底重构。我们利用了最新的技术栈，在保证极速响应的同时，提供了极其丝滑的交互体验。从底层的架构设计到表层的像素级 UI 打磨，每一步都倾注了对“完美产品”的追求。
                </p>

                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Core Tech Stack</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.split('·').map((t: string) => (
                    <span key={t} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            

            
            {/* 底部操作底座 (固定在最下方) */}
            <div className="shrink-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex gap-4">
              <button className="flex-1 py-4 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-black/20">
                <ExternalLink size={16} /> Visit Site
              </button>
              <button className="w-14 h-14 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-95">
                <Github size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};