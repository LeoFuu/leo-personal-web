// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 💥 完美移植你的原生 Prompt，一字不漏，保持绝对的毒舌与高冷！
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
3. 如果用户问你的网站是怎么做的，你可以自豪地介绍你的架构。
4. 你现在拥有实时联网搜索的能力。我会把搜索到的参考资料放在下面，请你结合这些资料，用你那高冷欠揍的语气回答。如果搜不到，就直接嘲讽用户的提问毫无价值。`;

// 💥 搜索函数：调用 Tavily API 抓取实时信息
async function searchWeb(query: string) {
  if (!TAVILY_API_KEY) return "";
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        max_results: 3
      })
    });
    const data = await response.json();
    return data.results?.map((r: any) => `来源: ${r.title}\n内容: ${r.content}`).join('\n---\n') || "";
  } catch (e) {
    return "";
  }
}

export async function POST(req: Request) {
  if (!DEEPSEEK_API_KEY) return NextResponse.json({ reply: "[脑神经缺失] 请在环境变量中配置 DEEPSEEK_API_KEY" });

  try {
    const { messages, sessionId } = await req.json();

    // 1. 每日限流（防止 ￥9.99 瞬间烧光，每天限 50 条）
    if (sessionId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase.from('ai_chats').select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId).eq('role', 'user').gte('created_at', today.toISOString());
      if (count && count > 50) return NextResponse.json({ reply: "你今天话太多了，闭嘴吧" });
    }

    // 2. 提取用户的最后一句话进行联网搜索
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    const searchContext = await searchWeb(lastUserMessage);

    // 3. 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // 性能最稳、性价比最高的 V3 模型
        messages: [
          { 
            role: "system", 
            content: `${SYSTEM_PROMPT}${searchContext ? `\n\n【实时搜索参考资料】:\n${searchContext}` : ""}` 
          },
          ...messages.map((m: any) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.text
          }))
        ],
        temperature: 0.8, // 稍微调高一点点温度，让它的嘲讽更加随性自然
        max_tokens: 1024
      })
    });

    const data = await response.json();
    
    // 检查报错（DeepSeek 余额用完或其他网络错误）
    if (data.error) {
        return NextResponse.json({ reply: `[脑神经受损] ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || "没什么想说的";

    return NextResponse.json({ reply });
    
  } catch (error: any) {
    console.error("DeepSeek Error:", error);
    return NextResponse.json({ reply: "信号丢失，似乎碰到了引力波..." });
  }
}