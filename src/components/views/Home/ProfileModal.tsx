// src/components/views/Home/ProfileModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ChevronRight, MapPin } from 'lucide-react';
import { HolographicAvatar } from '../../ui/HolographicAvatar';

// 💥 换回原版 1024x1024 双气泡微信
const WeChatIcon = ({ size = 18, className = "" }) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} className={`fill-current ${className}`}>
    <path d="M682.666667 362.666667c-17.066667 0-38.4 2.133333-55.466667 4.266666C590.933333 211.2 443.733333 91.733333 268.8 91.733333 119.466667 91.733333 0 196.266667 0 324.266667c0 74.666667 38.4 140.8 98.133333 183.466666-6.4 23.466667-21.333333 51.2-21.333333 51.2s-4.266667 14.933334 10.666667 4.266667c17.066667-12.8 51.2-34.133333 51.2-34.133333 21.333333 6.4 46.933333 8.533333 72.533333 8.533333 6.4 0 14.933333 0 21.333333-2.133333C241.066667 618.666667 334.933333 672 443.733333 672c21.333333 0 42.666667-2.133333 64-4.266667 21.333333 34.133333 68.266667 61.866667 119.466667 61.866667 17.066667 0 34.133333-2.133333 46.933333-6.4 0 0 25.6 14.933333 38.4 23.466667 10.666667 8.533333 8.533333-2.133333 8.533333-2.133333s-10.666667-21.333333-14.933333-38.4c42.666667-29.866667 68.266667-74.666667 68.266667-123.733334C774.4 465.066667 682.666667 362.666667 682.666667 362.666667z M192 256c23.466667 0 42.666667 19.2 42.666667 42.666667S215.466667 341.333333 192 341.333333s-42.666667-19.2-42.666667-42.666666 19.2-42.666667 42.666667-42.666667z m149.333333 85.333333c-23.466667 0-42.666667-19.2-42.666667-42.666666S317.866667 256 341.333333 256s42.666667 19.2 42.666667 42.666667-19.2 42.666667-42.666667 42.666667z m149.333334 162.133334c-14.933333 0-25.6-10.666667-25.6-25.6s10.666667-25.6 25.6-25.6 25.6 10.666667 25.6 25.6-10.666667 25.6-25.6 25.6z m128 0c-14.933333 0-25.6-10.666667-25.6-25.6s10.666667-25.6 25.6-25.6 25.6 10.666667 25.6 25.6-12.8 25.6-25.6 25.6z"/>
  </svg>
);

const DouyinIcon = ({ size = 18, className = "" }) => (
  <svg viewBox="0 0 448 512" width={size} height={size} className={`fill-current ${className}`}>
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

const XIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={`fill-current ${className}`}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.29 19.491h2.039L6.486 3.24H4.298Z" />
  </svg>
);

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div 
            className="relative w-full max-w-[340px] bg-white/80 backdrop-blur-3xl border border-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] rounded-[40px] overflow-hidden p-6"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors z-50"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col items-center pt-2 pb-5 border-b border-slate-200/50">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-slate-200 to-white shadow-md mb-4">
                 <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-50 relative" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                   <HolographicAvatar className="w-full h-full scale-125 absolute inset-0" />
                 </div>
              </div>
              
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">付昱淋</h2>
              
              <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                 <MapPin size={12} />
                 <span className="text-[11px] font-bold uppercase tracking-wider">Shenzhen, China</span>
              </div>
              
              <p className="text-[13px] font-medium text-slate-600 mt-3 text-center px-4 leading-relaxed">
                独立开发者 / UI设计爱好者 <br/> 探索极致的数字交互美学。
              </p>
            </div>

            <div className="pt-4 space-y-2.5">
               <SocialRow 
                 icon={<WeChatIcon size={20} className="translate-x-[1.5px] translate-y-[1.5px]" />} 
                 title="WeChat" 
                 desc="扫描二维码添加好友" 
                 iconBg="bg-[#07C160]/10" 
                 iconColor="text-[#07C160]" 
               />
               <SocialRow 
                 icon={<DouyinIcon size={16} />} 
                 title="Douyin" 
                 desc="日常灵感与数字生活" 
                 iconBg="bg-slate-900/5" 
                 iconColor="text-slate-800" 
               />
               <SocialRow 
                 icon={<Github size={18} />} 
                 title="GitHub" 
                 desc="@LeoFuu" 
                 iconBg="bg-slate-900/5" 
                 iconColor="text-slate-800" 
               />
               <SocialRow 
                 icon={<XIcon size={16} />} 
                 title="Twitter (X)" 
                 desc="碎片化产品思考" 
                 iconBg="bg-slate-900/5" 
                 iconColor="text-slate-900" 
               />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SocialRow = ({ icon, title, desc, iconBg, iconColor }: { icon: React.ReactNode, title: string, desc: string, iconBg: string, iconColor: string }) => (
  <div className="group flex items-center p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all cursor-pointer active:scale-[0.98]">
     <div className={`w-10 h-10 rounded-[14px] ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
     </div>
     <div className="ml-3 flex-1">
        <div className="text-[14px] font-bold text-slate-800 tracking-tight">{title}</div>
        <div className="text-[11px] font-medium text-slate-400 mt-0.5">{desc}</div>
     </div>
     <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-slate-800 group-hover:bg-slate-100 transition-all">
        <ChevronRight size={16} />
     </div>
  </div>
);