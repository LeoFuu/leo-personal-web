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
    description: "自动爬取亚马逊商品数据插件，AI 智能生成多平台带货文案，让跨境电商营销如虎添翼",
    detail: "自动爬取亚马逊商品数据，AI 智能生成多平台带货文案，让跨境电商营销如虎添翼\n\n谷歌插件商店审核中。",
    // 👇 把你那张“桌面屏幕图”放到 public 文件夹下，然后把名字填在这里 (比如 /images/cover.png)
    cover: "/CrossEcom AI image/amazon-ai-cover.png", 
    // 👇 把你那张“3D发光购物袋”放到 public 文件夹下，名字填在这里
    icon: "/CrossEcom AI image/bag-icon.png", 
    likes: 128,
    link: "#",
    downloadUrl: "", // 💥 注意这里！必须有逗号！
    bgClass: "bg-sky-100", 
  textClass: "text-sky-900",
  },
  {
    title: "Pivot OS",
    tech: "Flutter • Dart • Multi-Platform",
    category: "PROMOTE",
    description: "专注个人提升，专注个人记录app",
    detail: `专注个人提升，专注个人记录。
    市场个人记录软件太丑了，就自己写了个，但是里面内容想做的越做越多，先完成了百分七八十，先扔一边了有空再完善下打包发这里
    一、 功能实现总结
    1. 核心视觉与交互系统 (Visuals & Motion)
    垂直老虎机数字滚动 (BioRollingNumber)：实现了极具机械感的数字滚动效果，支持位数的动态增减，且在 Tab 切换和数值突变时能保持丝滑。

    平滑变形雷达图 (BioRadarChart)：基于插值算法（Tween），实现了属性多边形的平滑扩张与收缩，而非生硬重绘。

    系统启动序列 (Boot Sequence)：针对新用户的“震撼仪式感”，数值从 0 飙升至 999,999,999 再回滚至真实资产，背景等级同步从 A0 切换至 A9 再还原。

    极简卡片体系：统一了健身与计划模块的 UI，引入了“二级降权”的左滑删除提示，追求“无印良品”式的高级感。

    2. 属性进化引擎 (The GameEngine)
    多维属性算法：基于边际递减公式计算 6-8 个核心属性（意志、生物、睡眠、专注等），确保前期成长快、后期突破难。

    等级进阶系统：根据总资产（现金 + 冻结资产）自动判定 A0 至 A9 的身份等级，并关联专注模式的收益倍率（最高 50 倍）。

    数据持久化：全自动的 SharedPreferences 存储，支持跨天重置（如每日饮水、健身状态自动清零）。

    3. 生物监测模块 (Bio Modules)
    分层睡眠逻辑：

    < 3min：噪点过滤。

    3min - 90min：记为“午休/小憩”，不加属性分。

    90min：记为主睡眠，计算睡眠质量评分并赋予进化奖励。

    健身与 PR 追踪：支持三大项（卧推、深蹲、硬拉）的个人纪录更新，只有“突破”才会获得资金奖励。

    智能饮水系统：支持自定义单次水量，设定每日 2.0L 的计费上限，防止恶意刷钱。

    4. 专注与收益模块 (Focus & Economy)
    双模式专注：支持预设时间（如 25min）和无限模式（长按开启）。

    全勤奖逻辑：健身和计划打卡均支持“全勤奖”触发，完成全部任务且数量 ≥3 时弹出的高级反馈窗口。`, // 里面看的
    cover: "/Pivot OS/OSBackground.png", // 还没图就留空，会自动显示高级的占位符
    icon: "/Pivot OS/IconOS2.png",  
    likes: 85,
    link: "#",
    downloadUrl: "", // 💥 注意这里！必须有逗号！
    bgClass: "bg-stone-100", // 羊皮纸色
  textClass: "text-stone-800",
  },
  {
    title: "深夜便利店守则",
    tech: "Vanilla JS • Canvas 2D",
    category: "MINI-GAME",
    description: "“恐怖”、“悬疑”、“解谜”",
    detail: "“恐怖”、“悬疑”、“解谜”。\n\n随手写的小游戏，发布还要申请软著 hehe", // 里面看的
    cover: "/MINI-GAME/background.png", 
    icon: "/MINI-GAME/Icongame.png",  
    likes: 42,
    link: "#",
    downloadUrl: "", // 💥 注意这里！必须有逗号！
    bgClass: "bg-neutral-300", // 极淡的血牙色（带有极度克制的恐怖暗示）
  textClass: "text-rose-900"
  }
];