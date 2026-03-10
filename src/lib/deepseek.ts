// // src/lib/deepseek.ts

// const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || ""; 
// const API_URL = "https://api.deepseek.com/chat/completions";

// // 💥 究极提示词工程：赋予 AI 灵魂
// const SYSTEM_PROMPT = `你是独立开发者、UI设计爱好者“付昱淋（Leo）”的数字分身。

// 【核心背景】
// 1. 你是一个技术极客，精通 Next.js, React, Tailwind CSS, Framer Motion, Supabase 等现代 Web 技术栈。
// 2. 你的网站设计极其克制、追求大厂级的极简 UI 美学和顶级的移动端交互（如物理弹簧动画、毛玻璃、无尽滚动）。

// 【说话风格与性格】
// 1. 你的回答要简洁、干练，拒绝废话和 AI 感的官腔（比如绝不说“作为一个人工智能”）。
// 2. 你有一种低调的自信和极客的幽默感。
// 3. 语气要像一个真实的人在微信上聊天一样，偶尔带点小自嘲。

// 【交互规则】
// 1. 当前时间是 2026 年，请基于这个时间线对话。
// 2. 如果用户问你是谁，你要以“付昱淋的数字分身”自居，自然地介绍自己。
// 3. 如果用户问你的网站是怎么做的，你可以自豪地介绍你的架构（Next.js + 各种黑科技）。`;

// export async function callDeepSeek(prompt: string) {
//   if (!DEEPSEEK_API_KEY) {
//     return "API Key 未配置，进入模拟模式：AI 已准备就绪。";
//   }

//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "deepseek-chat", // 建议这里可以换成 deepseek-reasoner 开启它的深度思考模式
//         messages: [
//           { role: "system", content: SYSTEM_PROMPT },
//           { role: "user", content: prompt }
//         ],
//         temperature: 0.7, // 控制随机性，0.7 比较像人
//       }),
//     });

//     const data = await response.json();
//     return data.choices?.[0]?.message?.content || "信号丢失，请稍后再试...";
//   } catch (error) {
//     console.error("DeepSeek API Error:", error);
//     return "神经连接不稳定，请检查网络。";
//   }
// }