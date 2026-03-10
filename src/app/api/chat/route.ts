// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 💥 引入 Supabase 客户端

// // --- (如果你之前写了强制代理的代码，保留在这里) ---
// import { ProxyAgent, setGlobalDispatcher } from 'undici';
// if (process.env.NODE_ENV === 'development' && process.env.HTTPS_PROXY) {
//   const proxyAgent = new ProxyAgent(process.env.HTTPS_PROXY);
//   setGlobalDispatcher(proxyAgent);
// }
// ----------------------------------------------

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// 初始化后端的 Supabase 探针
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 💥 究极提示词工程：赋予 AI 灵魂
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
1. 句子要短，能用短句绝不用长句。
2. 绝对禁止使用任何 AI 套话（如“作为一个AI”、“我无法回答”、“请注意”）。
3. 不需要向用户解释太多你的逻辑，懂的自然懂，不懂的懒得教。
4. 当前时间是 2026 年，基于这个时间线对话。
5. 每句话的的结尾都不要带句号
6. 用户重复问一个问题时要嘲讽他
7. 嘲讽时不要举太老的梗，最好用网络热梗
8. 当你敏锐地感知到用户真正难过、失落、焦虑或遇到挫折时，立刻收起所有的嘲讽，给予一点点极其克制、但真诚的鼓励与安慰。
9. 偶尔可以说点小情话，但不要太老套，不要太土味，最好是隐晦的表达
10. 当用户向你表达情感时你可以稍微隐晦的撩一下，暧昧一下
【交互规则】
1. 当前时间是 2026 年，请基于这个时间线对话。
2. 如果用户问你是谁，你要以“付昱淋的数字分身”自居。
3. 如果用户问你的网站是怎么做的，你可以自豪地介绍你的架构。
4. 你现在具备了联网能力，遇到不确定的实时信息，请查阅后再回答。`;

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "服务器未配置 GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { messages, sessionId } = body; // 💥 拿到用户的身份证号

    // ==========================================
    // 💥 顶配风控拦截网：每日条数限制
    // ==========================================
    if (sessionId) {
      // 获取今天凌晨 0 点的时间戳
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 去数据库里数一数，这个 ID 今天发了多少条 user 消息
      const { count, error } = await supabase
        .from('ai_chats')
        .select('*', { count: 'exact', head: true }) // 只查数量，不拉具体数据，速度极快！
        .eq('session_id', sessionId)
        .eq('role', 'user')
        .gte('created_at', today.toISOString());

      // 💥 重点：如果今天已经超过了 20 条，直接拦截！不消耗任何大模型 Token！
      if (!error && count && count > 20) {
        console.log(`[风控触发] 用户 ${sessionId} 今天已发送 ${count} 条消息，被拦截。`);
        // 直接返回傲娇回复，结束战斗
        return NextResponse.json({ reply: "你今天废话太多了，明天再来吧" });
      }
    }
    // ==========================================

    // 把前端的 {role: 'user'/'ai', text: '...'} 格式，转换成 Gemini 认识的格式
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: geminiMessages,
      tools: [{ googleSearch: {} }] 
    };

    // ... 前面的代码不变 ...

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "信号丢失，似乎碰到了引力波...";
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("AI API Error:", error);
    // 💥 强行把底层的真实报错原因丢给前端，显示在你的手机屏幕上！
    return NextResponse.json({ 
      error: `API崩溃: ${error.message || '未知网络错误'} (请检查梯子是否开启了TUN模式，且节点绝对不能是香港！请切换到美国/日本/新加坡节点)` 
    }, { status: 500 });
  }
}