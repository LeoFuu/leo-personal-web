// src/config/site.ts

export const thoughts = [
  {
    id: 1,
    content: "独立开发不仅是写代码，更是对产品灵魂的雕琢。",
    date: "2024-05-20"
  },
  // 以后想写新想法，直接在这里加一条就行
];

export const projects: any = [
  {
    // 💥 这是你刚才发截图的那个牛逼项目
    title: "CrossEcom AI",
    tech: "Next.js • OpenAI • Scraper",
    category: "AI TOOLS",
    description: "自动爬取亚马逊商品数据，AI 智能生成多平台带货文案，让跨境电商营销如虎添翼。",
    // 👇 把你那张“桌面屏幕图”放到 public 文件夹下，然后把名字填在这里 (比如 /images/cover.png)
    cover: "/CrossEcom AI image/amazon-ai-cover.png", 
    // 👇 把你那张“3D发光购物袋”放到 public 文件夹下，名字填在这里
    icon: "/CrossEcom AI image/bag-icon.png", 
    likes: 128,
    link: "#",
    downloadUrl: ""
  },
  {
    title: "Quant Log",
    tech: "Next.js • Finance",
    category: "FINANCE",
    description: "量化交易日志管理工具，让每一笔交易都有迹可循。",
    cover: "", // 还没图就留空，会自动显示高级的占位符
    icon: "",  
    likes: 85,
    link: "#",
    downloadUrl: ""
  },
  {
    title: "Spatial Portal",
    tech: "React • Motion",
    category: "EXPERIMENTAL",
    description: "一个极具空间感的交互入口，探索 Web 3D 边界。",
    cover: "", 
    icon: "",  
    likes: 42,
    link: "#",
    downloadUrl: ""
  }
];