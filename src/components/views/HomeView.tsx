// src/components/views/HomeView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Pin, MonitorPlay, ArrowUpRight, Bot, Hash, MessageSquare } from 'lucide-react';
import { LiquidCard } from '../ui/LiquidCard';
import { HolographicAvatar } from '../ui/HolographicAvatar';
import { VoidSpirit } from '../features/VoidSpirit';
import { thoughts, projects } from '../../config/site';

interface ViewProps {
  onNavigate?: (id: string) => void;
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
}

export const HomeView: React.FC<ViewProps> = ({ onNavigate, showSpiritHere, isPreparing, jumpType }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
    <LiquidCard className="p-6 flex items-start gap-6 cursor-pointer" onClick={() => onNavigate?.('notes')}>
       <HolographicAvatar className="w-24 h-24 shrink-0" />
       <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-3">
             <h1 className="text-2xl font-bold text-white tracking-tight">Leo Fu</h1>
             <div className="flex gap-3 opacity-30"><Github size={16} /><Twitter size={16} /><Linkedin size={16} /></div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 relative">
             <div className="absolute top-3 -left-1 w-2 h-2 bg-black rotate-45 border-l border-b border-white/5" />
             <div className="flex items-center gap-1.5 mb-1 opacity-50">
                <Pin size={10} className="text-emerald-400" />
                <span className="text-[8px] font-bold text-emerald-400 uppercase">Thought</span>
             </div>
             <p className="text-xs text-white/70 italic leading-relaxed">"{thoughts[0]?.content || '暂无想法'}"</p>
          </div>
       </div>
    </LiquidCard>

    <div className="grid grid-cols-2 gap-4">
      <LiquidCard className="col-span-2 p-5 flex flex-col justify-center min-h-[130px]">
         <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"><MonitorPlay size={12} /> Project Lab</span>
            <ArrowUpRight size={14} className="text-white/20" />
         </div>
         <div className="grid grid-cols-2 gap-4">
            {projects.slice(0, 2).map((proj, idx) => (
              <div key={idx}>
                <div className="font-bold text-sm text-white">{proj.title}</div>
                <div className="text-[10px] text-white/30">{proj.tech}</div>
              </div>
            ))}
         </div>
      </LiquidCard>

      <LiquidCard className="p-5 relative flex flex-col justify-between h-36 overflow-visible" onClick={() => onNavigate?.('neural')}>
         {showSpiritHere && <VoidSpirit isNavigating={false} isPreparing={isPreparing} jumpType={jumpType} locationId="home" />}
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/><span className="text-[10px] font-bold text-emerald-500 uppercase">AI Twin</span></div>
            <Bot size={16} className="text-white/20" />
         </div>
         <div><h3 className="font-bold text-white text-lg">Neural Link</h3><p className="text-[10px] text-white/30">与我的数字灵魂对话</p></div>
      </LiquidCard>

      <LiquidCard className="p-5 flex flex-col justify-between h-36 relative" onClick={() => onNavigate?.('guestbook')}>
        <MessageSquare className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.03] rotate-12" />
        <div className="flex items-center gap-2 opacity-40 mb-2"><Hash size={12}/><span className="text-[10px] font-bold uppercase tracking-widest">Guestbook</span></div>
        <p className="text-xs text-white/60 line-clamp-2">"期待你的留言..."</p>
        <div className="mt-2 flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-blue-500/20 border border-white/10" /><span className="text-[10px] text-white/40">Visitor</span></div>
      </LiquidCard>
    </div>
  </motion.div>
);