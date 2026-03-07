// src/lib/deepseek.ts

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || ""; 
const API_URL = "https://api.deepseek.com/chat/completions";

export async function callDeepSeek(prompt: string) {
  if (!DEEPSEEK_API_KEY) {
    return "API Key 未配置，进入模拟模式：AI 已准备就绪。";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是 Leo 的数字分身，说话风格严谨但带一点极客的幽默。" },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "信号丢失，请稍后再试...";
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return "神经连接不稳定，请检查网络。";
  }
}