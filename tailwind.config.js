// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 💥 关键修改：将赛博色提炼为更深、更有质感、更高对比度的实体色
      colors: {
        cyber: {
          cyan: '#00C2D1', // 更深邃、更沉稳的实体青色
          purple: '#7B1FA2', // 更饱满的实体紫色
          black: '#0A0A0C', 
        }
      },
      // 删掉了所有玻璃阴影，全部用我们在 globals.css 里写的 arch-card 统管
    },
  },
  plugins: [],
}