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
    description: "自动爬取亚马逊商品数据，AI 智能生成多平台带货文案，让跨境电商营销如虎添翼",
    detail: "自动爬取亚马逊商品数据，AI 智能生成多平台带货文案，让跨境电商营销如虎添翼。\n\n第一次写爬虫工具，发布到谷歌插件商店审核中。",
    // 👇 把你那张“桌面屏幕图”放到 public 文件夹下，然后把名字填在这里 (比如 /images/cover.png)
    cover: "/CrossEcom AI image/amazon-ai-cover.png", 
    // 👇 把你那张“3D发光购物袋”放到 public 文件夹下，名字填在这里
    icon: "/CrossEcom AI image/bag-icon.png", 
    likes: 128,
    link: "#",
    downloadUrl: "", // 💥 注意这里！必须有逗号！
    bgClass: "bg-[#D9F99D]", 
    textClass: "text-[#3F6212]"
  },
  {
    title: "Pivot OS",
    tech: "Flutter • Dart • Multi-Platform",
    category: "PROMOTE",
    description: "专注个人提升，专注个人记录",
    detail: "专注个人提升，专注个人记录。\n\n市场个人记录软件太丑了，就自己写了个，但是想做的东西越做越多了，现在完成了百分七八十，先扔一边了有空再完善下打包发这里", // 里面看的
    cover: "/Pivot OS/OSBackground.png", // 还没图就留空，会自动显示高级的占位符
    icon: "/Pivot OS/IconOS.png.png",  
    likes: 85,
    link: "#",
    downloadUrl: "", // 💥 注意这里！必须有逗号！
    bgClass: "bg-[#E9D5FF]",
    textClass: "text-[#6B21A8]"
  },
  {
    title: "深夜便利店守则",
    tech: "Vanilla JS • Canvas 2D",
    category: "MINI-GAME",
    description: "“恐怖”、“悬疑”、“解谜”",
    detail: "“恐怖”、“悬疑”、“解谜”。\n\n随手写的小游戏，还没打包。", // 里面看的
    cover: "/MINI-GAME/background.png", 
    icon: "/MINI-GAME/Icongame.png",  
    likes: 42,
    link: "#",
    downloadUrl: "", // 💥 注意这里！必须有逗号！
    bgClass: "bg-zinc-900", 
    textClass: "text-red-600"
  }
];