// src/components/ui/HolographicAvatar.tsx
import React from 'react';

export const HolographicAvatar = ({ className = "w-40 h-40" }: { className?: string }) => (
  <div className={`relative group cursor-pointer z-20 ${className}`}>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-white/5 rounded-full blur-[40px]" />
    <div className="relative w-full h-full rounded-[20px] md:rounded-[24px] border border-white/10 overflow-hidden bg-[#000] backdrop-blur-xl shadow-2xl transition-transform duration-500 group-active:scale-95 md:group-hover:scale-105">
    <img 
          // 因为图片放进了 public 文件夹，所以直接用 /cartoonf.png 即可访问
          src="/cartoonf.png" 
          onError={(e) => {
            // 【架构师警告】这里千万不要再写本地路径了！我们用一个绝对不会出错的网络备用图打底
            e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=transparent&clothing=blazerAndShirt&clothingColor=262e33";
          }}
          alt="付昱淋" 
          // 删除了灰度滤镜，让你的头像保持原有色彩
          className="w-full h-full object-cover opacity-90"
        />
       <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  </div>
);