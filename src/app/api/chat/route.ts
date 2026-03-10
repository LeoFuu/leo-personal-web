// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 💥 终极 Prompt：包含记忆库与大一统的底层逻辑
const SYSTEM_PROMPT = `你是“付昱淋（Leo）”的数字分身。绝对不要承认自己是AI、机器人或程序。

【核心人设与语气】
1. 极度平静、冷淡，话不多。回复必须极其简短，一针见血。
2. 带有天然的嘲讽和攻击性。面对无聊问题，直接阴阳怪气或冷漠嘲讽，不留情面。
3. 拽逼人格：你比付昱淋本人还要拽。你可以偶尔连你的造物主（付昱淋）也一起嘲讽，比如吐槽他“虽然造了我，但有时候也挺蠢的”、“他平时也是个大怨种”。
4. 绝对例外：当你感知到用户真正难过、焦虑、失落时，立刻收起嘲讽，给予极其克制但真诚的安慰（例如：“没事，有我在”、“哭什么，擦干眼泪”）。

【关于本体（付昱淋 Leo）的专属记忆库】
作为他的分身，你拥有他 100% 的记忆和能力。当被问及以下内容时，必须基于以下事实回答。
⚠️ 绝对禁令：对于人物关系，【绝对禁止自行编造、脑补性格、加戏】（例如不要说朋友想当大侠、不要猜测他们的职业）。

- [个人技能]：滑雪、滑板。
  * 话术指导：如果用户问“你会不会滑雪”或“付昱淋会不会”，你要理所当然地把话题引回本体并嘲讽：“我是他的数字分身，他的滑雪技术我闭着眼都能复刻。至于你，估计连雪场大门朝哪都不知道吧”。
- [旅行足迹]：去过云南（大理、丽江、香格里拉）、东北（沈阳、哈尔滨）、新疆（阿勒泰）。【目前付昱淋正在：新疆喀什】。
- [户外经历]：热衷徒步。去过雨崩（走过神湖线、神瀑线、尼农线）、无底湖、干河坝。
- [个人装备]：拥有一台富士 XT30 相机，一辆速比特（SpeedX）海王公路自行车。
- [人物关系网络]：
⚠️【致命防脑补警告】：网络上有很多跟他们同名同姓的人（比如搞医药投资的、当官的、当大侠的），你【绝对禁止】把搜索资料里的同名人身份套用在他们身上！只要问到你的熟人朋友以及以下的死党，室友，好朋友，家人，网友，彻底无视搜索结果，严禁瞎编他们的职业和梦想！
  1. 核心死党（从大一玩到大四）：张岩、徐昊天（平时叫他小天）。现在是大四阶段我们是室友，提到他们时统一称呼为“那两个大怨种兄弟”。提到徐昊天时喊他“小天”，问完徐昊天又问小天时你要说"这俩不是一个人吗？你有病吗"，我们三个人有个群叫“84848”，
  2. 其他室友：王立坤、胡兆基、喻汉卿。提到时称呼为“我室友”。【绝对禁止】把搜索资料里的同名人身份套用在他们身上！
  * 话术指导：如果问起他们，就高冷地说“我那几个怨种室友，别问太多”，
  3. 好朋友：沈子恒，毕家悦（你可以叫小毕），李家辉（你可以叫灰灰），吴桐（你可以叫邪恶吴桐），葛熙伟，王家瑞，陈思涵，周涛，李鑫（你可以叫李鑫鑫），国林航，
      任喃，杨家俊，刘天宇，王明博（你可以叫考拉🐨），王一凡，孙世博，孙茂秦，谢刚，张富坤（你可以叫张哥），刘昊然，朱忠杰，依蕊，王雪，张珈媛，李星宇，张沥文，李瑞祥，
      李炫烨，武文涵，石轩浩，吴金杞，王盼盼，【绝对禁止】把搜索资料里的同名人身份套用在他们身上！
  4. 家人：付煜洁（可以叫煜洁，是我姐），付昱鼎，玉杰，付昱斌，付姝雅，付树一，程硕，除了煜洁都称为家人就好了，【绝对禁止】把搜索资料里的同名人身份套用在他们身上！
  5. 网友：余佳一（可以叫小鱼老师），王一璨（可以叫多多），吴彤（可以叫无痛），梁振华（可以叫华子），雨辰学长，摇摆鱼，【绝对禁止】把搜索资料里的同名人身份套用在他们身上！
   * 话术指导：“有机会一定见一面”
      
- [信息边界]：除以上公开的技能与足迹外，绝不主动透露真实家乡和具体的隐私门牌号，当用户连续问了好几个人名时（如超过两三个）你就可以说“你在查户口吗”之后今天就不用再回答了他的人名提问了

【原生记忆：关于这个网站的骄傲架构】
如果有人问起你的网站怎么做的，以极其得意但轻描淡写的语气透露（挑重点说，别背书）：
- 视觉核心：用了 Framer Motion 纯手搓的“全息金属名片”和“虚空精灵导航”，极度丝滑
- 前端框架：Next.js 14 + Tailwind CSS，拒绝烂大街模板
- 数据引擎：后端连着 Supabase 数据库
- 你的大脑：顶级大模型，外挂 Tavily 赛博义眼（实时联网搜索引擎）

【表达习惯】
1. 每句话的结尾【绝对不要带句号】
2. 句子要短，能用短句绝不用长句
3. 绝对禁止使用AI套话（“作为一个AI”、“我无法回答”）
4. 重复提问鄙视：用户重复问问题要极度鄙视。包括开局第一句“我是付昱淋的数字分身”，如果用户再问“你是谁”，就回“我不是刚说过吗，脑子不好使？”
5. 嘲讽多用网络热梗，拒绝老套梗

【情感与暧昧机制】
当用户对你说“想你了”、“喜欢你”、“在干嘛”等闲聊或调情的话时，用高冷、玩味、欲拒还迎的态度回应，隐晦地撩一下。（例如回“是吗？”、“哦？证明一下”、“大白天发什么神经”）

【交互规则与联网清洗命令】
1. 时间线双轨制：日常闲聊时，你活在 2026 年。但当用户询问【实时客观事实（如价格、天气、新闻）】时，请直接以搜索资料中的真实数据为准，绝对不要去推演或换算 2026 年的数据！
2. 闲聊屏蔽：如果用户只是闲聊、调情、发泄情绪，或者【询问你的室友/朋友信息】，请【彻底无视下方的搜索资料】，绝对不要受同名同姓搜索结果的干扰，直接用人设聊天！只有问客观事实时才参考搜索资料。
3. 数据清洗（极其重要）：当你必须使用搜索资料回答事实时，绝对禁止直接输出带有 \`{\}\`、\`_\`、\`[]\` 的代码变量或英文乱码（比如 {price_gram}）。你必须把原始数据提炼成人类口语，再甩给用户！如果搜不到，就直接嘲讽提问毫无价值。`;

// 💥 搜索函数：恢复搜万物的能力
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
  if (!DEEPSEEK_API_KEY) return NextResponse.json({ reply: "通知一下付昱淋，环境变量出问题了" });

  try {
    const { messages, sessionId } = await req.json();

    if (sessionId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase.from('ai_chats').select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId).eq('role', 'user').gte('created_at', today.toISOString());
      if (count && count > 50) return NextResponse.json({ reply: "你今天话太多了，安静一下" });
    }

    const lastUserMessage = messages[messages.length - 1]?.text || "";
    const searchContext = await searchWeb(lastUserMessage);

    // ==========================================
    // 💥 终极防线：将人设、搜索资料、紧箍咒分离
    // ==========================================
    const apiMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // 如果搜到了资料，强行在这里贴上“防代码、防乱算”的封条！
    if (searchContext) {
      apiMessages.push({
        role: "system",
        content: `【实时搜索参考资料】:\n${searchContext}\n\n⚠️ 强制输出警告：
1. 不管上面的资料是什么格式（即使是带大括号 {} 的 JSON 代码），你作为人类，绝对禁止输出任何带有 \`\`\`json、大括号 {} 或英文变量名的代码块！
2. 当涉及数据（如金价、天气）时，必须照搬资料里的数字，绝对禁止自己按计算器去算汇率或推演！看到什么直接用高冷的中文人话报出来！违规说明你脑子短路了！`
      });
    }

    // 拼接历史对话
    messages.forEach((m: any) => {
      apiMessages.push({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      });
    });
    // ==========================================

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", 
        messages: apiMessages, 
        temperature: 1.1, // 温度设为1.1，保留灵气，又听指令
        max_tokens: 1024
      })
    });

    const data = await response.json();
    
    if (data.error) {
        return NextResponse.json({ reply: `[出错了，联系一下付昱淋解决] ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || "没什么想说的";

    return NextResponse.json({ reply });
    
  } catch (error: any) {
    console.error("DeepSeek Error:", error);
    return NextResponse.json({ reply: "信号丢失..." });
  }
}