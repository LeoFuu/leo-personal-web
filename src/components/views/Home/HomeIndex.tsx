// src/components/views/Home/HomeIndex.tsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { ArrowDown, User, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../../lib/supabase'; // 引入数据库通讯兵

// 你原本完美的组件结构，一个都没少！
import { MetalClipBack, MetalClipFront } from './MetalClip';
import { IDCard } from './IDCard';
import { ProjectDeck } from './ProjectDeck';
import { ProjectModal } from './ProjectModal';
import { ProfileModal } from './ProfileModal'; 

export interface HomeProps {
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
  onNavigate?: (tabId: string) => void; // 💥 加上导航函数，供最底部的按钮使用
}

export const HomeIndex: React.FC<HomeProps> = ({ showSpiritHere, isPreparing, jumpType, onNavigate }) => {
  // ==========================================
  // 1. 保留你原汁原味的：名片与卡片堆叠动画逻辑
  // ==========================================
  const [deck, setDeck] = useState([0, 1, 2]); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [bumpCount, setBumpCount] = useState(0);
  
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const clipControls = useAnimationControls();
  const idCardControls = useAnimationControls(); 

  const handleNextCard = async () => {
    if (isAnimating || selectedProjectId !== null || showProfileModal) return;
    setIsAnimating(true);

    clipControls.start({ rotate: -25, x: -5, y: -5, transition: { duration: 0.08, ease: 'easeOut' } });
    idCardControls.start({ rotate: -9, y: -1, transition: { duration: 0.08, ease: 'easeOut' } });

    await new Promise(r => setTimeout(r, 40));
    setDeck(prev => [prev[1], prev[2], prev[0]]);
    await new Promise(r => setTimeout(r, 60));

    setBumpCount(prev => prev + 1);

    clipControls.start({ rotate: -4, x: 0, y: 0, transition: { type: "spring", stiffness: 600, damping: 20 } });
    idCardControls.start({ rotate: -6, y: 0, transition: { type: "spring", stiffness: 600, damping: 15 } });

    setTimeout(() => setIsAnimating(false), 100);
  };


  // ==========================================
  // 2. 完美接驳：无尽引擎与时间轴数据拉取
  // ==========================================
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!hasMore || isLoading) return;
      setIsLoading(true);

      const PAGE_SIZE = 5;
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      try {
        const [thoughtsRes, guestbookRes] = await Promise.all([
          supabase.from('thoughts').select('*').order('created_at', { ascending: false }).range(from, to),
          supabase.from('guestbook').select('*').eq('is_approved', true).eq('is_featured', true).order('created_at', { ascending: false }).range(from, to)
        ]);

        const formatTime = (iso: string) => {
          const d = new Date(iso);
          return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
        };

        const thoughts = (thoughtsRes.data || []).map(t => ({
          type: 'thought', id: `t-${t.id}`, time: formatTime(t.created_at), text: t.content, timestamp: new Date(t.created_at).getTime()
        }));

        const guestbooks = (guestbookRes.data || []).map(g => ({
          type: 'guestbook', id: `g-${g.id}`, time: formatTime(g.created_at), user: g.nickname, message: g.content, reply: g.reply, timestamp: new Date(g.created_at).getTime()
        }));

        const merged = [...thoughts, ...guestbooks];
        if (merged.length === 0) {
          setHasMore(false);
        } else {
          setTimelineData(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            const uniqueNew = merged.filter(i => !existingIds.has(i.id));
            return [...prev, ...uniqueNew].sort((a, b) => b.timestamp - a.timestamp);
          });
          if ((thoughtsRes.data?.length || 0) < PAGE_SIZE && (guestbookRes.data?.length || 0) < PAGE_SIZE) {
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error("拉取数据失败", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [page]);


  // ==========================================
  // 3. UI 渲染：顶层动画 + 底层时间轴
  // ==========================================
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 弹窗组件：原封不动 */}
      <ProjectModal projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* 顶部：原汁原味的金属夹子和名片堆叠区域 */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        // 💥 就是下面这行！把 pt-16 改回 pt-36
        className="relative w-full max-w-[360px] mx-auto pt-36 pb-12 px-2 z-20"
      >
        <div className="relative w-full h-[360px] cursor-pointer group" onClick={handleNextCard}>
          <MetalClipBack />
          <IDCard 
            controls={idCardControls} 
            showSpiritHere={showSpiritHere} 
            isPreparing={isPreparing} 
            jumpType={jumpType} 
            bumpCount={bumpCount} 
            onOpenProfile={() => setShowProfileModal(true)}
          />
          <MetalClipFront controls={clipControls} />
          <ProjectDeck deck={deck} onOpenDetail={setSelectedProjectId} />
        </div>
      </motion.div>

      {/* 过渡动画：向下滚动指示器 */}
      <motion.div className="w-full flex justify-center mt-4 mb-8 opacity-40 z-10" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ArrowDown size={14} className="text-slate-500" />
      </motion.div>

      {/* 底部：动态时间轴与无尽加载 */}
      <div className="relative w-full z-10">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-white/0 via-white/40 to-white/0" />

        {timelineData.map((item, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <div key={item.id} className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'} mb-16 relative`}>
              <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-[50%] w-[15%]' : 'left-[50%] w-[15%]'} h-[1px] bg-white/30 hidden sm:block`} />
              
              <div className="sticky z-20" style={{ top: `${100 + (idx % 5) * 10}px` }}>
                <motion.div
                  className="w-[240px] shadow-lg rounded-[24px] border border-white/50 bg-white/70 backdrop-blur-lg overflow-hidden flex flex-col"
                  style={{ rotate: isLeft ? '-1.5deg' : '1.5deg' }}
                  whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true, margin: "50px" }}
                >
                  <div className="px-5 py-3 border-b border-white/30 bg-white/20 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'guestbook' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{item.time}</span>
                  </div>

                  {item.type === 'thought' ? (
                    // 💥 改动这里：加了 flex 居中、最小高度、文字居中和更舒服的行高
                    // 💥 取消了统一的 p-6，改为 px-6 pt-2 pb-8，利用不对称的内边距把文字往上托！
                  <div className="px-6 pt-2 pb-8 flex-1 flex items-center justify-center min-h-[90px]">
                      <p className="text-[14px] leading-relaxed font-bold text-slate-800/90 whitespace-pre-wrap text-center">
                        {item.text}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><User size={12} className="text-blue-500" /></div>
                        <div className="flex-1 bg-white/60 rounded-[16px] p-3 border border-white/50">
                          <div className="text-[10px] font-bold text-slate-400 mb-1">{item.user}</div>
                          <p className="text-[12px] font-medium text-slate-700">{item.message}</p>
                          {item.reply && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60">
                              <div className="text-[10px] font-bold text-blue-500 flex items-center gap-1">付昱淋 <span className="text-[8px] bg-blue-50 px-1 rounded">站长</span></div>
                              <p className="text-[11px] font-medium text-slate-600">{item.reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}

        {/* 探测器：只要滚到这里，就会加载下一页 */}
        {hasMore && (
          <motion.div 
            onViewportEnter={() => { if (!isLoading) setPage(p => p + 1); }}
            className="w-full flex justify-center py-10"
          >
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </motion.div>
        )}

        {/* 底线：宇宙的尽头 */}
        {!hasMore && timelineData.length > 0 && (
          <div className="w-full flex justify-center py-10 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} /> 到达人类最深处 <Sparkles size={12} /></span>
          </div>
        )}

        {/* 去留言板的引导 */}
        <div className="w-full flex justify-center pt-8 pb-20">
          <motion.div 
            className="group bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 flex items-center gap-5 cursor-pointer shadow-lg active:scale-95 transition-all"
            onClick={() => onNavigate && onNavigate('guestbook')}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center group-hover:scale-105 transition-transform"><MessageSquare size={24} className="text-white/90" /></div>
            <div className="pr-4">
              <div className="font-black text-slate-800 text-lg">留下你的足迹</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Go to Guestbook</div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};