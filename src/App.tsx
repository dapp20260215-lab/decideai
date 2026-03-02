import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  Orbit, 
  Send, 
  Bot, 
  User, 
  ChevronRight,
  AlertTriangle,
  Zap,
  Shield,
  Download,
  Trees,
  Waves,
  Mountain,
  Coins,
  Wallet
} from 'lucide-react';
import Markdown from 'react-markdown';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect, useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { cn } from './lib/utils';
import { CycleData, Message } from './types';
import { generateAgentResponse } from './services/geminiService';

const CycleCard = ({ title, icon: Icon, value, status, sentiment, children, lang }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "glass p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group transition-all duration-500",
      ((typeof sentiment === 'string' ? sentiment : (lang === 'zh' ? sentiment.zh : sentiment.en)).includes('Bullish') || 
       (typeof sentiment === 'string' ? sentiment : (lang === 'zh' ? sentiment.zh : sentiment.en)).includes('看多')) 
        ? "hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:border-emerald-500/20" 
        : "hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] hover:border-orange-500/20"
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5">
        <Icon className="text-orange-500" size={20} />
      </div>
      <h3 className="font-serif text-lg tracking-wide uppercase opacity-70">
        {lang === 'zh' ? title.zh : title.en}
      </h3>
    </div>
    <div>
      <div className="text-2xl font-medium mb-1">
        {typeof value === 'object' ? (lang === 'zh' ? value.zh : value.en) : value}
      </div>
      <div className="text-sm opacity-50 font-mono uppercase tracking-tighter">
        {typeof status === 'object' ? (lang === 'zh' ? status.zh : status.en) : status}
      </div>
    </div>
    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
      <span className={cn(
        "text-xs font-mono px-2 py-1 rounded",
        (typeof sentiment === 'string' ? sentiment : (lang === 'zh' ? sentiment.zh : sentiment.en)).includes('Bullish') || 
        (typeof sentiment === 'string' ? sentiment : (lang === 'zh' ? sentiment.zh : sentiment.en)).includes('看多') ? "bg-emerald-500/10 text-emerald-400" : 
        (typeof sentiment === 'string' ? sentiment : (lang === 'zh' ? sentiment.zh : sentiment.en)).includes('Expansionary') || 
        (typeof sentiment === 'string' ? sentiment : (lang === 'zh' ? sentiment.zh : sentiment.en)).includes('扩张') ? "bg-blue-500/10 text-blue-400" :
        "bg-orange-500/10 text-orange-400"
      )}>
        {typeof sentiment === 'object' ? (lang === 'zh' ? sentiment.zh : sentiment.en) : sentiment}
      </span>
      {children}
    </div>
  </motion.div>
);

const BaZiChart = ({ data, forceDesktop = false }: { data: any, forceDesktop?: boolean }) => {
  const elementColors: Record<string, string> = {
    '火': 'from-red-500/20 to-orange-500/20 text-red-700 border-red-300 shadow-red-100',
    '木': 'from-emerald-500/20 to-teal-500/20 text-emerald-700 border-emerald-300 shadow-emerald-100',
    '土': 'from-amber-600/20 to-yellow-700/20 text-amber-800 border-amber-300 shadow-amber-100',
    '金': 'from-yellow-400/20 to-amber-500/20 text-amber-700 border-yellow-300 shadow-yellow-100',
    '水': 'from-blue-500/20 to-cyan-500/20 text-blue-700 border-blue-300 shadow-blue-100',
  };

  const ElementIcon = ({ element, size = 16 }: { element: string, size?: number }) => {
    switch(element) {
      case '火': return <Flame size={size} className="text-red-600" />;
      case '木': return <Trees size={size} className="text-emerald-600" />;
      case '土': return <Mountain size={size} className="text-amber-700" />;
      case '金': return <Coins size={size} className="text-amber-600" />;
      case '水': return <Waves size={size} className="text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className={cn(
      "w-full space-y-4 md:space-y-6 my-4 md:my-6 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
      forceDesktop && "space-y-6 my-6 p-8 rounded-[2rem]"
    )}>
      <div className="flex items-center justify-between px-2">
        <h3 className={cn(
          "text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400",
          forceDesktop && "text-[10px] tracking-[0.3em]"
        )}>Celestial Four Pillars • 命理四柱</h3>
        <div className="h-px flex-1 mx-2 md:mx-4 bg-slate-100" />
      </div>

      <div className={cn(
        "grid gap-3 md:gap-4",
        forceDesktop ? "grid-cols-4 gap-4" : "grid-cols-2 md:grid-cols-4"
      )}>
        {data.pillars.map((pillar: any, idx: number) => (
          <div key={idx} className={cn(
            "flex flex-col items-center rounded-2xl md:rounded-3xl p-3 md:p-5 gap-3 md:gap-4 border-2 transition-all hover:scale-[1.02] bg-gradient-to-b shadow-sm",
            forceDesktop && "rounded-3xl p-5 gap-4",
            elementColors[pillar.element]
          )}>
            <div className="flex flex-col items-center gap-1">
              <span className={cn(
                "text-[8px] md:text-[10px] uppercase font-black tracking-widest opacity-70",
                forceDesktop && "text-[10px]"
              )}>{pillar.label}</span>
              <span className={cn(
                "text-[9px] md:text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/50",
                forceDesktop && "text-[11px]"
              )}>{pillar.tenGod}</span>
            </div>
            
            <div className="flex flex-col items-center leading-none py-1 md:py-2">
              <div className={cn(
                "text-2xl md:text-4xl font-black tracking-tighter mb-1 drop-shadow-sm",
                forceDesktop && "text-4xl"
              )}>
                {pillar.stem}
              </div>
              <div className={cn(
                "text-2xl md:text-4xl font-black tracking-tighter drop-shadow-sm",
                forceDesktop && "text-4xl"
              )}>
                {pillar.branch}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 md:gap-1.5">
              <div className="p-1.5 md:p-2 rounded-full bg-white/60 shadow-sm">
                <ElementIcon element={pillar.element} size={forceDesktop ? 20 : 16} />
              </div>
              <span className={cn(
                "text-[8px] md:text-[10px] font-black uppercase tracking-widest",
                forceDesktop && "text-[10px]"
              )}>{pillar.element}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-slate-100">
        <div className={cn(
          "text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-slate-400 text-center font-bold",
          forceDesktop && "text-[10px] tracking-[0.2em]"
        )}>Element Energy Balance • 五行能量</div>
        <div className={cn(
          "flex flex-wrap gap-y-3 justify-center",
          forceDesktop ? "gap-x-8" : "gap-x-4 md:gap-x-8"
        )}>
          {Object.entries(data.elements).map(([el, count]: any) => (
            <div key={el} className={cn(
              "flex items-center gap-2 md:gap-4",
              forceDesktop && "gap-4"
            )}>
              <div className={cn(
                "flex items-center gap-1.5 md:gap-2 min-w-[40px] md:min-w-[50px]",
                forceDesktop && "gap-2 min-w-[50px]"
              )}>
                <ElementIcon element={el} size={forceDesktop ? 14 : 12} />
                <span className={cn(
                  "text-[10px] md:text-[11px] font-bold text-slate-600",
                  forceDesktop && "text-[11px]"
                )}>{el}</span>
              </div>
              <div className={cn(
                "flex gap-1 md:gap-1.5",
                forceDesktop && "gap-1.5"
              )}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={cn(
                    "rounded-full transition-all shadow-inner", 
                    forceDesktop ? "w-4 h-2" : "w-3 md:w-4 h-1.5 md:h-2",
                    i < (count as number) ? (
                      el === '火' ? 'bg-red-500 shadow-red-200' : 
                      el === '木' ? 'bg-emerald-500 shadow-emerald-200' : 
                      el === '土' ? 'bg-amber-600 shadow-amber-200' : 
                      el === '金' ? 'bg-yellow-500 shadow-yellow-200' : 
                      'bg-blue-500 shadow-blue-200'
                    ) : 'bg-slate-100'
                  )} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper to safely get origin in sandboxed iframes
const getSafeOrigin = () => {
  return 'https://mlbg.qintianjian.fun';
};

const getSafeHostname = () => {
  return 'mlbg.qintianjian.fun';
};

const ModelMessage = ({ text, lang }: { text: string, lang: 'zh' | 'en' }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  let baziData = null;
  let cleanText = text;

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.type === 'bazi_chart') {
        baziData = parsed;
        cleanText = text.replace(jsonMatch[0], '');
      }
    } catch (e) {
      console.warn("Failed to parse BaZi JSON", e);
    }
  }

  const handleDownload = async () => {
    const target = downloadRef.current || reportRef.current;
    if (!target) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(target, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0',
          transform: 'scale(1)',
        }
      });
      const link = document.createElement('a');
      link.download = lang === 'zh' ? '命理研究报告.png' : 'Celestial_Report.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.warn('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group/msg">
      {/* Hidden Download Version (Fixed Desktop Layout) */}
      {baziData && (
        <div className="fixed top-0 left-0 -z-[100] pointer-events-none opacity-0 overflow-hidden" style={{ width: '800px' }}>
          <div 
            ref={downloadRef}
            className="report-content p-12 bg-white text-slate-900 is-full-report"
          >
            <div className="flex justify-between items-center mb-10 border-b-2 border-slate-100 pb-6">
              <div className="flex flex-col">
                <h2 className="text-3xl font-serif font-bold text-slate-900">命理研究报告</h2>
                <p className="text-xs text-slate-500 font-medium mt-2 tracking-tight">钦天监Web4.0｜BSC上首个基于BAP-578周期预测应用</p>
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <QRCodeSVG value={getSafeOrigin()} size={60} />
                <div className="text-[8px] font-mono opacity-40 leading-none uppercase vertical-text">{getSafeHostname()}</div>
              </div>
            </div>
            <BaZiChart data={baziData} forceDesktop={true} />
            <div className="markdown-body mt-10">
              <Markdown>{cleanText}</Markdown>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={reportRef}
        style={baziData ? { colorScheme: 'light' } : {}}
        className={cn(
          "report-content p-4 md:p-8 rounded-xl md:rounded-2xl border shadow-2xl relative transition-all",
          baziData ? "bg-white text-slate-900 border-slate-200 is-full-report" : "bg-white/5 text-white border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(249,115,22,0.05)]"
        )}
      >
        {/* Report Header - Only for reports with BaZi data */}
        {baziData && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 border-b border-slate-100 pb-4 gap-4">
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-serif font-bold text-slate-900">命理研究报告</h2>
              <p className="text-[8px] md:text-[10px] text-slate-500 font-medium mt-1 tracking-tight">钦天监Web4.0｜BSC上首个基于BAP-578周期预测应用</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
              <QRCodeSVG value={getSafeOrigin()} size={35} />
              <div className="text-[6px] font-mono opacity-40 leading-none uppercase vertical-text">{getSafeHostname()}</div>
            </div>
          </div>
        )}

        {baziData && (
          <div className="mb-6">
            <BaZiChart data={baziData} />
          </div>
        )}
        
        <div className={cn("markdown-body", !baziData && "text-white/90")}>
          <Markdown>{cleanText}</Markdown>
        </div>
      </div>
      
      {baziData && (
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="absolute -bottom-10 right-0 flex items-center gap-1.5 text-[10px] font-bold text-orange-500 hover:text-orange-400 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover/msg:opacity-100 shadow-xl backdrop-blur-sm"
        >
          <Download size={12} />
          {isDownloading ? (lang === 'zh' ? '正在生成图片...' : 'Generating PNG...') : (lang === 'zh' ? '下载命理研究报告 PNG' : 'Download Report PNG')}
        </button>
      )}
    </div>
  );
};

export default function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [paymentMethod, setPaymentMethod] = useState<'bnb' | 'token'>('bnb');
  const [aiStatus, setAiStatus] = useState<{ configured: boolean, keyLength: number } | null>(null);

  const PAYMENT_ADDRESS = '0x69ac9374b9b61561a5467be07d2382edd9cfe250';
  const PAYMENT_AMOUNT = '0.01';
  const TOKEN_ADDRESS = '0x97d48e4c13264560646159199db0da5c450f7777';
  const TOKEN_AMOUNT = '100000'; // 开发者可在此随时修改数量

  const ERC20_ABI = [
    {
      name: 'transfer',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'recipient', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
  ] as const;
  const [cycles, setCycles] = useState<CycleData | null>({
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [birthInfo, setBirthInfo] = useState({ 
    name: '',
    birthplace: '',
    gender: 'male',
    year: '1996', 
    month: '02', 
    day: '07', 
    hour: '16:48', 
    calendarType: 'solar' 
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 127 }, (_, i) => (2026 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  const t = {
    zh: {
      agentTitle: "钦天监大占星师",
      profileTitle: "天命星盘 (Celestial Profile)",
      profileDesc: "输入生辰八字以开启个性化排盘分析",
      year: "出生年",
      month: "月",
      day: "日",
      hour: "时",
      name: "姓名",
      birthplace: "出生地",
      gender: "性别",
      male: "男",
      female: "女",
      save: "开启天命排盘 (0.01 BNB)",
      solar: "公历",
      lunar: "农历"
    },
    en: {
      agentTitle: "Celestial Agent",
      profileTitle: "Celestial Profile",
      profileDesc: "Enter birth details for personalized insights",
      year: "Year",
      month: "Month",
      day: "Day",
      hour: "Hour",
      name: "Name",
      birthplace: "Birthplace",
      gender: "Gender",
      male: "Male",
      female: "Female",
      save: "Save & Analyze (0.01 BNB)",
      solar: "Solar",
      lunar: "Lunar"
    }
  };

  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    // Check AI status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setAiStatus({ configured: data.aiConfigured, keyLength: data.aiKeyLength });
      })
      .catch(() => setAiStatus({ configured: false, keyLength: 0 }));

    fetch('/api/cycles')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setCycles)
      .catch(err => console.warn("Failed to fetch cycles:", err));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (overrideInput?: string, isReportRequest: boolean = false) => {
    const finalInput = overrideInput || input;
    if (!finalInput.trim() || isLoading) return;

    if (isReportRequest) {
      if (!isConnected) {
        open();
        return;
      }

      try {
        setIsLoading(true);
        let tx;
        if (paymentMethod === 'bnb') {
          tx = await sendTransactionAsync({
            to: PAYMENT_ADDRESS as `0x${string}`,
            value: parseEther(PAYMENT_AMOUNT),
          });
        } else {
          tx = await writeContractAsync({
            address: TOKEN_ADDRESS as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [PAYMENT_ADDRESS as `0x${string}`, parseUnits(TOKEN_AMOUNT, 18)],
            account: address as `0x${string}`,
            chain: chain,
          });
        }
        
        const paymentMsg: Message = { 
          role: 'model', 
          text: lang === 'zh' ? `✅ 支付成功！交易哈希: ${tx}` : `✅ Payment successful! Tx Hash: ${tx}`, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, paymentMsg]);
      } catch (error: any) {
        console.warn("Payment cancelled or failed:", error?.message || error);
        const isUserRejection = error?.message?.includes('User rejected') || error?.details?.includes('User denied') || error?.message?.includes('User denied');
        const errorMsg: Message = { 
          role: 'model', 
          text: lang === 'zh' 
            ? (isUserRejection ? `⚠️ 您取消了支付请求。请重新开启天命排盘以继续。` : `❌ 支付失败。请检查余额或网络后重试。`)
            : (isUserRejection ? `⚠️ You cancelled the payment request. Please try again to analyze your destiny.` : `❌ Payment failed. Please check your balance or network and try again.`), 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsLoading(false);
        return;
      }
    }

    const userMsg: Message = { role: 'user', text: finalInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    let prompt = finalInput;
    if (birthInfo.year && birthInfo.month && birthInfo.day) {
      const calendarName = birthInfo.calendarType === 'solar' ? (lang === 'zh' ? '公历' : 'Solar') : (lang === 'zh' ? '农历' : 'Lunar');
      const genderText = birthInfo.gender === 'male' ? (lang === 'zh' ? '男' : 'Male') : (lang === 'zh' ? '女' : 'Female');
      prompt = `[用户天命档案：姓名 ${birthInfo.name || '未填'}, 性别 ${genderText}, 出生地 ${birthInfo.birthplace || '未填'}, 生于 ${calendarName} ${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}时] ${finalInput}。请先为我进行四柱八字排盘，再结合当前周期给出研究报告。`;
    }

    try {
      const responseText = await generateAgentResponse(prompt, history);
      const modelMsg: Message = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
      console.warn("AI Generation Error:", error);
      const errorMsg: Message = { 
        role: 'model', 
        text: lang === 'zh' 
          ? `❌ 天机感应失败：${error.message}\n\n提示：如果您已配置 API Key，可能是因为 Key 存在 IP/域名限制，或者配额已用完。服务器已尝试自动重试。请检查 Google Cloud Console 中的限制设置。`
          : `❌ Celestial Connection Failed: ${error.message}\n\nTip: If you have configured the API Key, it might have IP/Domain restrictions or quota limits. The server attempted a retry. Please check restrictions in Google Cloud Console.`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletClick = async () => {
    try {
      if (isConnected) {
        await open({ view: 'Account' });
      } else {
        await open();
      }
    } catch (e) {
      console.warn("Wallet modal error:", e);
      // Fallback: try opening without specific view if account view fails
      if (isConnected) {
        try {
          await open();
        } catch (retryError) {
          console.warn("Wallet modal retry error:", retryError);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-orange-500/40">
      {/* Header */}
      <header className="border-b border-white/10 p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center sticky top-0 bg-[#050505]/90 backdrop-blur-xl z-50 gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <h1 className="font-serif text-xl md:text-2xl tracking-tight leading-none font-bold">钦天监 <span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">Web4.0</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setLang('zh')}
              className={cn("px-2 md:px-3 py-1 text-[9px] md:text-[10px] rounded-md transition-all", lang === 'zh' ? "bg-orange-500 text-black font-bold" : "opacity-50 hover:opacity-100")}
            >
              中文
            </button>
            <button 
              onClick={() => setLang('en')}
              className={cn("px-2 md:px-3 py-1 text-[9px] md:text-[10px] rounded-md transition-all", lang === 'en' ? "bg-orange-500 text-black font-bold" : "opacity-50 hover:opacity-100")}
            >
              EN
            </button>
          </div>
          <button 
            onClick={handleWalletClick}
            className={cn(
              "flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border transition-all text-[10px] md:text-xs font-bold",
              isConnected 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                : "bg-orange-500 text-black border-orange-600 hover:bg-orange-400"
            )}
          >
            <Wallet size={12} className="md:w-3.5 md:h-3.5" />
            {isConnected ? (
              <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            ) : (
              <span>{lang === 'zh' ? '连接钱包' : 'Connect Wallet'}</span>
            )}
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 max-w-[1200px] mx-auto w-full">
        {/* Cycle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cycles && (
              <>
                <CycleCard 
                  lang={lang}
                  title={{ zh: "三元九运", en: "Three Eras Nine Lucks" }} 
                  icon={Flame} 
                  value={cycles.nineLucks.current}
                  status={cycles.nineLucks.status}
                  sentiment={cycles.nineLucks.sentiment}
                >
                  <div className="flex gap-1">
                    {(lang === 'zh' ? cycles.nineLucks.focus.zh : cycles.nineLucks.focus.en).map(f => (
                      <span key={f} className="text-[8px] border border-white/10 px-1 rounded opacity-50">{f}</span>
                    ))}
                  </div>
                </CycleCard>

                <CycleCard 
                  lang={lang}
                  title={{ zh: "康波周期", en: "Kondratiev Wave" }} 
                  icon={TrendingUp} 
                  value={cycles.kWave.to}
                  status={cycles.kWave.current}
                  sentiment={cycles.kWave.sentiment}
                />
                
                <CycleCard 
                  lang={lang}
                  title={{ zh: "木星周期", en: "Jupiter Cycle" }} 
                  icon={Orbit} 
                  value={cycles.jupiter.sign}
                  status={cycles.jupiter.phase}
                  sentiment={cycles.jupiter.sentiment}
                />
                
                <CycleCard 
                  lang={lang}
                  title={{ zh: "美林时钟", en: "Merrill Lynch Clock" }} 
                  icon={Clock} 
                  value={cycles.merrillLynch.current}
                  status={cycles.merrillLynch.strategy}
                  sentiment={cycles.merrillLynch.indicators.unemployment}
                />
              </>
            )}
          </div>

          {/* Agent Chat Section */}
          <div className="flex flex-col glass rounded-2xl overflow-hidden border-orange-500/20 border">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot size={18} className="text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t[lang].agentTitle}</div>
                  <div className="text-[10px] opacity-50 font-mono">{lang === 'zh' ? '在线' : 'ONLINE'} • BAP-578</div>
                </div>
              </div>
              {aiStatus && !aiStatus.configured && (
                <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[9px] text-red-400 animate-pulse">
                  <AlertTriangle size={10} />
                  <span>{lang === 'zh' ? 'API 密钥未配置' : 'API Key Not Configured'}</span>
                </div>
              )}
            </div>

            <div className="bg-orange-500/5 border-b border-white/10 overflow-hidden">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-serif uppercase tracking-widest text-orange-500">{t[lang].profileTitle}</h4>
                  <div className="flex bg-white/5 p-0.5 rounded border border-white/10">
                    <button 
                      onClick={() => setBirthInfo({...birthInfo, calendarType: 'solar'})}
                      className={cn(
                        "px-2 py-0.5 text-[8px] rounded transition-all",
                        birthInfo.calendarType === 'solar' ? "bg-orange-500 text-black font-bold" : "opacity-50"
                      )}
                    >
                      {t[lang].solar}
                    </button>
                    <button 
                      onClick={() => setBirthInfo({...birthInfo, calendarType: 'lunar'})}
                      className={cn(
                        "px-2 py-0.5 text-[8px] rounded transition-all",
                        birthInfo.calendarType === 'lunar' ? "bg-orange-500 text-black font-bold" : "opacity-50"
                      )}
                    >
                      {t[lang].lunar}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].name}</label>
                    <input 
                      type="text"
                      value={birthInfo.name}
                      onChange={(e) => setBirthInfo({...birthInfo, name: e.target.value})}
                      placeholder="Name"
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].birthplace}</label>
                    <input 
                      type="text"
                      value={birthInfo.birthplace}
                      onChange={(e) => setBirthInfo({...birthInfo, birthplace: e.target.value})}
                      placeholder="City"
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].gender}</label>
                    <select 
                      value={birthInfo.gender}
                      onChange={(e) => setBirthInfo({...birthInfo, gender: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      <option value="male" className="bg-[#111]">{t[lang].male}</option>
                      <option value="female" className="bg-[#111]">{t[lang].female}</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].year}</label>
                    <select 
                      value={birthInfo.year}
                      onChange={(e) => setBirthInfo({...birthInfo, year: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      {years.map(y => <option key={y} value={y} className="bg-[#111]">{y}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].month}</label>
                    <select 
                      value={birthInfo.month}
                      onChange={(e) => setBirthInfo({...birthInfo, month: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      {months.map(m => <option key={m} value={m} className="bg-[#111]">{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].day}</label>
                    <select 
                      value={birthInfo.day}
                      onChange={(e) => setBirthInfo({...birthInfo, day: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      {days.map(d => <option key={d} value={d} className="bg-[#111]">{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase opacity-40">{t[lang].hour}</label>
                    <input 
                      type="time" 
                      value={birthInfo.hour}
                      onChange={(e) => setBirthInfo({...birthInfo, hour: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] focus:outline-none focus:border-orange-500/50 [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                    <button 
                      onClick={() => setPaymentMethod('bnb')}
                      className={cn(
                        "flex-1 px-2 py-1.5 text-[9px] rounded-md transition-all flex items-center justify-center gap-1.5",
                        paymentMethod === 'bnb' ? "bg-orange-500 text-black font-bold" : "opacity-50 hover:opacity-100"
                      )}
                    >
                      <Zap size={10} />
                      0.01 BNB
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('token')}
                      className={cn(
                        "flex-1 px-2 py-1.5 text-[9px] rounded-md transition-all flex items-center justify-center gap-1.5",
                        paymentMethod === 'token' ? "bg-orange-500 text-black font-bold" : "opacity-50 hover:opacity-100"
                      )}
                    >
                      <Coins size={10} />
                      {Number(TOKEN_AMOUNT).toLocaleString()} 钦天监
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      handleSend(lang === 'zh' ? "请结合我的生辰八字分析我的投资天命" : "Please analyze my investment destiny based on my birth info", true);
                    }}
                    className="w-full bg-orange-500 text-black text-[10px] font-bold py-2.5 rounded-xl hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                  >
                    {lang === 'zh' ? `开启天命排盘 (${paymentMethod === 'bnb' ? '0.01 BNB' : `${Number(TOKEN_AMOUNT).toLocaleString()} 钦天监`})` : `Analyze Destiny (${paymentMethod === 'bnb' ? '0.01 BNB' : `${Number(TOKEN_AMOUNT).toLocaleString()} 钦天监`})`}
                  </button>
                </div>
              </div>
            </div>

            <div className={cn("overflow-y-auto custom-scrollbar transition-all", (messages.length > 0 || isLoading) ? "h-[400px] p-4 space-y-6" : "h-0 p-0")}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col gap-2 max-w-[90%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "w-full",
                    msg.role === 'user' ? "max-w-[85%] ml-auto" : "max-w-full"
                  )}>
                    {msg.role === 'model' ? (
                      <ModelMessage text={msg.text} lang={lang} />
                    ) : (
                      <div className="p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-lg bg-orange-500 text-black font-medium rounded-tr-none">
                        {msg.text}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono opacity-30">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

        </main>

    </div>
  );
}
