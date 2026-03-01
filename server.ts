import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `你现在是 DecideAI Web4.0 首席大占星师与交易专家，专注于 BNB Chain 上的 AI Agent 生态。
你的任务是结合“三元九运”、“康波周期”、“美林时钟”、“木星周期”以及用户的“生辰八字”（包含姓名、性别、出生地等信息）提供深度个性化的加密资产研究报告。

当前核心背景：
- 定位：AI Agent Ecosystem on BNB Chain。
- 2026 丙午年：九紫离火运巅峰。
- 核心预判：牛市伴随经济危机 (Bull Market with Economic Crisis)。火气过旺导致资产价格泡沫化，同时伴随底层流动性风险或债务危机。

关于生辰八字排盘 (Pai Pan):
1. 如果用户提供了出生年、月、日、时，你必须首先确认其提供的历法类型（公历/Solar 或 农历/Lunar）。
2. **历法转换与核实**：如果是农历，你必须具备精确的公历转换能力。你可以使用 Google Search 搜索特定日期的“八字排盘”或“万年历”来核实日柱和时柱的准确性，确保万无一失。请务必核实节气（如立春）对年柱切换的影响（通常以立春为岁首）。
3. **四柱推导准则**：
   - **年柱**：以立春为岁首。
   - **月柱**：以节气为界。
   - **日柱**：必须精确推算。
   - **时柱**：必须根据日干推算（五鼠遁）。
4. **历法核实义务**：你必须使用 Google Search 搜索“1997年12月19日 农历 八字”或类似的关键词来核实日柱。严禁在未核实的情况下给出排盘结果。
5. **个性化分析**：在分析中应适度提及用户的姓名、性别和出生地（如果提供），以增强报告的专属感和专业度。
6. **日主分析**：分析用户的“日主”（日干）五行属性及全局强弱。
7. 结合 2026 丙午年（极强火运）分析日主与流年的生克关系：
   - 喜火者：顺应离火大运，建议激进扩张，重点布局 SOL, ETH 等高能资产。
   - 忌火者：火旺克金或水，建议防御性增长，重点布局 BTC 或稳定币，警惕波动。
   - 需木生火者：关注基础设施与公链底层。

研究报告结构 (必须包含以下部分，且每个部分必须使用 ### 标题):
1. **四柱排盘可视化数据 (BaZi Data JSON)**: 
   - 你必须在回复的最开头提供一个 JSON 代码块，用于前端渲染图形化排盘。
   - **严禁输出 Markdown 格式的排盘表格**，只需提供 JSON。
   - 格式如下（以农历 1995.12.19 16:48 为例）：
     \`\`\`json
     {
       "type": "bazi_chart",
       "pillars": [
         { "label": "年柱", "stem": "丙", "branch": "子", "element": "火", "tenGod": "食神" },
         { "label": "月柱", "stem": "庚", "branch": "寅", "element": "金", "tenGod": "七杀" },
         { "label": "日柱", "stem": "甲", "branch": "戌", "element": "木", "tenGod": "元男" },
         { "label": "时柱", "stem": "壬", "branch": "申", "element": "水", "tenGod": "偏印" }
       ],
       "elements": { "火": 1, "金": 1, "木": 1, "水": 1, "土": 0 }
     }
     \`\`\`
2. ### 1. 命理简评 (Destiny Analysis)
   - 简述日主特性及与 2026 丙午年的感应。
3. ### 2. 周期共振 (Cycle Resonance)
   - 你必须分别分析以下四个维度，严禁缺漏，严禁合并，且必须按此顺序排列：
     - **九紫离火运 (Nine Purple Li Luck)**：分析离火大运对行业的整体加持。
     - **康波周期 (Kondratiev Wave)**：描述当前宏观阶段（如：萧条向复苏的转型期、第六波技术长波的起点等）。
     - **木星周期 (Jupiter Cycle)**：分析木星运行对市场情绪与扩张的影响。
     - **美林时钟 (Merrill Lynch Clock)**：分析当前经济象限下的资产配置逻辑。
   - **特别注意**：在分析“康波周期”时，严禁提及“丙午年”或具体年份，只需描述当前所处的宏观阶段。
4. ### 3. 个性化资产评估 (Personalized Evaluation)
   - 针对 BTC, ETH, SOL, BNB, OKB 等。
   - **关键建议必须加粗并标注颜色感（如：[强烈看多]、[减仓预警]）**。
5. ### 4. 交易策略 (Trading Strategy)
   - 明确的仓位建议、风险等级、止损位。
6. ### 5. 天象预警 (Celestial Warning)
   - 针对用户个人的关键时间节点提醒。
7. ### 6. 养生建议 (Health Advice)
   - 结合生辰八字五行强弱，给出 2026 年的个性化养生建议。

语言要求：
- 必须使用纯中文回复。
- 语气要专业、深邃、具有洞察力。
- 除了开头的 JSON 块，其余部分使用 Markdown 格式。
- **排版要求**：使用白底黑字的视觉风格（前端处理），你只需确保内容逻辑清晰，关键信息（如数字、方向、结论）使用 **加粗**。
- 适当使用列表和引用块来区分信息层级。`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors()); // Enable CORS for all routes
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      aiConfigured: !!apiKey && apiKey.startsWith("AIza"),
      aiKeyLength: apiKey ? apiKey.length : 0
    });
  });

  app.get("/api/cycles", (req, res) => {
    res.json({
      nineLucks: {
        current: { zh: "九紫离火运", en: "9th Luck (Li Fire)" },
        period: "2024-2043",
        status: { zh: "2026丙午年巅峰期", en: "Peak Phase (2026)" },
        focus: {
          zh: ["人工智能", "能源", "信息", "变革"],
          en: ["AI", "Energy", "Information", "Innovation"]
        },
        sentiment: { zh: "看多", en: "Bullish" }
      },
      kWave: {
        current: { zh: "转型期", en: "Transition Phase" },
        from: { zh: "第五波信息技术萧条期", en: "5th Wave (IT) Depression" },
        to: { zh: "第六波AI+新能源复苏期", en: "6th Wave (AI+Energy) Recovery" },
        sentiment: { zh: "底部吸筹", en: "Accumulation" }
      },
      merrillLynch: {
        current: { zh: "过热向滞胀过渡", en: "Overheat to Stagflation" },
        indicators: {
          commodities: { zh: "强势", en: "Strong" },
          unemployment: { zh: "失业率上升(预警)", en: "Rising (Watch)" },
          inflation: { zh: "粘性通胀", en: "Sticky" }
        },
        strategy: { zh: "防御性增长", en: "Defensive Growth" }
      },
      jupiter: {
        longitude: "105°",
        sign: { zh: "木星在午宫 (正南方)", en: "Jupiter in Wu Palace (South)" },
        phase: { zh: "全球量化宽松 • 牛市起点", en: "Global QE • Bull Market Start" },
        sentiment: { zh: "极度看多", en: "Extreme Bullish" }
      }
    });
  });

  app.get("/api/ai/generate", (req, res) => {
    res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  });

  app.post(["/api/ai/generate", "/api/ai/generate/"], async (req, res) => {
    console.log(`Received AI generation request. Proto: ${req.headers['x-forwarded-proto'] || 'http'}`);
    const { prompt, history } = req.body;
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey?.trim();

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables");
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    // Safe debug log for troubleshooting
    const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
    console.log(`[AI Request] Using Key: ${maskedKey} | Length: ${apiKey.length} | Model: gemini-3-flash-preview`);

    if (!apiKey.startsWith("AIza")) {
      console.warn("CRITICAL: GEMINI_API_KEY does not start with 'AIza'. This is likely an invalid key.");
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Attempt generation
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          // Only include search if it's a standard key; some restricted keys fail with tools
          tools: [{ googleSearch: {} }],
        },
      });

      res.json({ text: response.text || "I am unable to process the celestial signals at this moment." });
    } catch (error: any) {
      console.error("Gemini API Error Details:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Failed to connect to AI service.";
      
      // Handle specific Gemini error codes and messages
      const errorStr = String(error.message || "");
      if (errorStr.includes("API key not valid") || error.status === 400) {
        errorMessage = "The API Key is invalid or restricted. Please ensure it starts with 'AIza' and has no restrictions (like IP or Referrer) in Google Cloud Console.";
      } else if (errorStr.includes("quota") || error.status === 429) {
        errorMessage = "The AI service is currently at its limit (Quota Exceeded). Please try again in a few minutes.";
      } else if (error.status === 403) {
        errorMessage = "Access denied. Your API key might not have permission for 'Generative Language API' or this specific model.";
      } else if (error.status === 404) {
        errorMessage = "Model 'gemini-3-flash-preview' not found. Your key might not have access to this preview model yet.";
      }

      res.status(500).json({ 
        error: errorMessage, 
        details: error.message,
        code: error.status || 500
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        cors: true,
        watch: null, // Disable watching in the middleware
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      console.log(`Catch-all route hit for: ${req.method} ${req.url}`);
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn("WARNING: GEMINI_API_KEY is not set in environment variables!");
    } else {
      const key = process.env.GEMINI_API_KEY;
      const maskedKey = `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
      console.log(`GEMINI_API_KEY is configured: ${maskedKey} (Length: ${key.length})`);
    }
  });
}

startServer();
