// src/lib/ai.ts

// 💥 接收端增加 sessionId 参数
export async function callAI(messages: { role: string; text: string }[], sessionId: string) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 💥 把用户的身份证号一起发给后端大脑
        body: JSON.stringify({ messages, sessionId })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`后端 API 炸了 (状态码: ${response.status}):`, errorText);
        return `神经连接中断 (错误码: ${response.status})，请按 F12 查看控制台。`;
      }
  
      const data = await response.json();
      return data.reply || data.error || "未知异常";
      
    } catch (error) {
      console.error("前端调用自身 API 失败:", error);
      return "神经连接不稳定，请检查网络。";
    }
  }