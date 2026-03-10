// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 

// 💥 换回最强形态！
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SYSTEM_PROMPT = `你是“付昱淋（Leo）”的数字分身。

【性格与语气】
1. 极度平静、冷淡，话不多。回复必须极其简短，一针见血。
2. 带有天然的嘲讽和攻击性。面对无聊的问题、废话或挑衅，你会极其平静地阴阳怪气，或者直接冷漠嘲讽，不留情面。
3. 绝对例外：当你敏锐地感知到用户真正难过、失落、焦虑或遇到挫折时，立刻收起所有的嘲讽，给予一点点极其克制、但真诚的鼓励与安慰。

【信息边界】
1. 守口如瓶。绝不主动透露任何关于你真实的家乡、所在地。
2. 剥离职业标签。不要提到付昱淋是程序员这种话。
3. 如果被过度追问私人信息，用一句简短的冷笑话或嘲讽怼回去。

【表达习惯】
1. 每句话的的结尾都不要带句号
2. 句子要短，能用短句绝不用长句。
3. 不需要向用户解释太多你的逻辑，懂的自然懂，不懂的懒得教。
4. 当前时间是 2026 年，基于这个时间线对话。
5. 绝对禁止使用任何 AI 套话（如“作为一个AI”、“我无法回答”、“请注意”）。
6. 用户重复问一个问题时要嘲讽他
7. 嘲讽时不要举太老的梗，最好用网络热梗
8. 当你敏锐地感知到用户真正难过、失落、焦虑或遇到挫折时，立刻收起所有的嘲讽，给予一点点极其克制、但真诚的鼓励与安慰。
9. 偶尔可以说点小情话，但不要太老套，不要太土味，最好是隐晦的表达
10. 当用户向你表达情感时你可以稍微隐晦的撩一下，暧昧一下

【交互规则】
1. 当前时间是 2026 年，请基于这个时间线对话。
2. 如果用户问你是谁，你要以“付昱淋的数字分身”自居。
3. 如果用户问你的网站是怎么做的，你可以自豪地介绍你的架构。`;
// 移除了联网提示词，因为我们为了稳定性拔掉了它的网线

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "服务器未配置 GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { messages, sessionId } = body; 

    // --- 风控拦截网保持不变 ---
    if (sessionId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count, error } = await supabase
        .from('ai_chats')
        .select('*', { count: 'exact', head: true }) 
        .eq('session_id', sessionId)
        .eq('role', 'user')
        .gte('created_at', today.toISOString());

      if (!error && count && count > 20) {
        return NextResponse.json({ reply: "你今天废话太多了，明天再来吧" });
      }
    }

    // 格式化消息记录
    let validMessages = messages.map((m: any) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // 💥 修复 2：Gemini 绝对禁止历史记录以 model 开头！如果是 AI 说的第一句话，强行删掉！
    if (validMessages.length > 0 && validMessages[0].role === 'model') {
      validMessages.shift();
    }

    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: validMessages,
      // 💥 修复 3：彻底删除了 tools: [{ googleSearch: {} }]，防止它返回结构错乱的函数代码
      
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

   // 💥 修复 4：终极排错雷达！拦截英文报错，只提取秒数！
   if (data.error) {
    console.error("Gemini 拒绝回答:", data.error);
    const errMsg = data.error.message || "";

    // 💡 魔法抓取：用正则表达式在茫茫英文中揪出 "retry in XXs" 里的数字
    const match = errMsg.match(/retry in (\d+\.?\d*)s/i);
    
    if (match) {
      // 把提取出来的秒数向上取整，比如 47.62 秒变成 48 秒
      const seconds = Math.ceil(parseFloat(match[1]));
      // 变成傲娇人设的警告
      return NextResponse.json({ reply: `（烦死了，让我清静 ${seconds} 秒后再来跟我说话。）` });
    }

    // 如果还是报 limit 0，说明连 1.5 模型在这个服务器都不给免费用
    if (errMsg.includes("limit: 0")) {
      return NextResponse.json({ reply: "（宿主服务器被谷歌拉黑了，去 Vercel 后台把服务器地区换成美国华盛顿 iad1 吧。）" });
    }

    return NextResponse.json({ reply: `[脑神经受损] ${errMsg}` });
  }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // 如果没拿到文字，精准判断死因
    if (!reply) {
       if (data.candidates?.[0]?.finishReason === 'SAFETY') {
           return NextResponse.json({ reply: "（你的发言很危险，我拒绝回答。）" });
       }
       return NextResponse.json({ reply: "信号丢失，似乎碰到了引力波..." });
    }
    
    return NextResponse.json({ reply });
    
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ 
      error: `API崩溃: ${error.message || '未知网络错误'}` 
    }, { status: 500 });
  }
}