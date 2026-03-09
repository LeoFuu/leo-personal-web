// src/components/views/Home/IDCard.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Verified, Github } from 'lucide-react';
import { HolographicAvatar } from '../../ui/HolographicAvatar';
import { VoidSpirit } from '../../features/VoidSpirit';

// 💥 换回你最满意的原版 1024x1024 独立气泡微信！绝不重叠交叉！
const WeChatIcon = ({ size = 12, className = "" }) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} className={`fill-current ${className}`}>
    <path d="M682.666667 362.666667c-17.066667 0-38.4 2.133333-55.466667 4.266666C590.933333 211.2 443.733333 91.733333 268.8 91.733333 119.466667 91.733333 0 196.266667 0 324.266667c0 74.666667 38.4 140.8 98.133333 183.466666-6.4 23.466667-21.333333 51.2-21.333333 51.2s-4.266667 14.933334 10.666667 4.266667c17.066667-12.8 51.2-34.133333 51.2-34.133333 21.333333 6.4 46.933333 8.533333 72.533333 8.533333 6.4 0 14.933333 0 21.333333-2.133333C241.066667 618.666667 334.933333 672 443.733333 672c21.333333 0 42.666667-2.133333 64-4.266667 21.333333 34.133333 68.266667 61.866667 119.466667 61.866667 17.066667 0 34.133333-2.133333 46.933333-6.4 0 0 25.6 14.933333 38.4 23.466667 10.666667 8.533333 8.533333-2.133333 8.533333-2.133333s-10.666667-21.333333-14.933333-38.4c42.666667-29.866667 68.266667-74.666667 68.266667-123.733334C774.4 465.066667 682.666667 362.666667 682.666667 362.666667z M192 256c23.466667 0 42.666667 19.2 42.666667 42.666667S215.466667 341.333333 192 341.333333s-42.666667-19.2-42.666667-42.666666 19.2-42.666667 42.666667-42.666667z m149.333333 85.333333c-23.466667 0-42.666667-19.2-42.666667-42.666666S317.866667 256 341.333333 256s42.666667 19.2 42.666667 42.666667-19.2 42.666667-42.666667 42.666667z m149.333334 162.133334c-14.933333 0-25.6-10.666667-25.6-25.6s10.666667-25.6 25.6-25.6 25.6 10.666667 25.6 25.6-10.666667 25.6-25.6 25.6z m128 0c-14.933333 0-25.6-10.666667-25.6-25.6s10.666667-25.6 25.6-25.6 25.6 10.666667 25.6 25.6-12.8 25.6-25.6 25.6z"/>
  </svg>
);

const DouyinIcon = ({ size = 12, className = "" }) => (
  <svg viewBox="0 0 448 512" width={size} height={size} className={`fill-current ${className}`}>
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

const XIcon = ({ size = 11, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={`fill-current ${className}`}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.29 19.491h2.039L6.486 3.24H4.298Z" />
  </svg>
);

interface IDCardProps {
  controls: any;
  showSpiritHere: boolean;
  isPreparing: boolean;
  jumpType: 'hop' | 'dive' | 'soar';
  bumpCount: number;
  onOpenProfile?: () => void;
}

export const IDCard: React.FC<IDCardProps> = ({ controls, showSpiritHere, isPreparing, jumpType, bumpCount, onOpenProfile }) => {
  
  useEffect(() => {
    if (isPreparing) {
      controls.start({ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    } else {
      controls.start({ rotate: -6, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    }
  }, [isPreparing, controls]);

  return (
    <motion.div 
       onClick={(e) => {
         e.stopPropagation();
         onOpenProfile?.();
       }}
       className="absolute top-[-90px] left-[0px] z-40 bg-[#F8F9FA] rounded-[36px] w-[280px] h-[95px] flex items-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] border border-white/50 cursor-pointer hover:bg-white transition-colors group relative"
       style={{
          transformOrigin: '20px 65px',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
       }}
       initial={{ rotate: -6 }} 
       animate={controls}
       whileHover={{ scale: 1.02 }}
       whileTap={{ scale: 0.98 }}
    >
       {showSpiritHere && (
          <VoidSpirit 
             locationId={`home-card-${bumpCount}`} 
             isPreparing={isPreparing} 
             jumpType={isPreparing ? jumpType : 'hop'} 
          />
       )}

       <div className="relative ml-[52px] shrink-0 z-10 pointer-events-none">
          <div 
            className="w-14 h-14 rounded-full overflow-hidden bg-black/5 border-[2px] border-white shadow-sm"
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', isolation: 'isolate' }}
          >
             <HolographicAvatar className="w-full h-full scale-125" />
          </div>
       </div>
       
       <div className="ml-4 flex flex-col justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tighter leading-none">付昱淋</h1>
            <Verified size={16} className="text-blue-500 fill-blue-50" />
          </div>
          
          <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> 
             FYLNB666
          </div>
       </div>

       {/* 💥 终极微雕排版：*/}
       {/* 1. 颜色极度淡化 text-slate-300，像轻盈的水印。*/}
       {/* 2. 放在绝对的右下角 bottom-[14px] right-[20px]，绝不遮挡文字！ */}
       {/* 3. 整体大幅度缩小，用 w-[14px] 的外壳锁死对齐。 */}
       <div className="absolute bottom-[14px] right-[20px] flex items-center gap-1 text-slate-300/80 z-20 pointer-events-none">
          <div className="w-[14px] h-[14px] flex items-center justify-center">
             {/* 💥 微信 11px，微弱补偿重心 */}
             <WeChatIcon size={11} className="translate-x-[0.5px] translate-y-[0.5px] group-hover:text-[#07C160] transition-colors" />
          </div>
          <div className="w-[14px] h-[14px] flex items-center justify-center">
             {/* 💥 抖音 10px */}
             <DouyinIcon size={10} className="group-hover:text-black transition-colors" />
          </div>
          <div className="w-[14px] h-[14px] flex items-center justify-center">
             {/* 💥 GitHub 11px */}
             <Github size={11} className="group-hover:text-slate-800 transition-colors" />
          </div>
          <div className="w-[14px] h-[14px] flex items-center justify-center">
             {/* 💥 X 9px (因为原版X太满，所以再小一点点) */}
             <XIcon size={9} className="group-hover:text-slate-900 transition-colors" />
          </div>
       </div>

    </motion.div>
  );
};