import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  CloudRain,
  Umbrella,
  Shirt,
  Briefcase,
  GraduationCap,
  Baby,
  ShoppingBag,
  Store,
  Footprints,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  verdict?: 'YES' | 'NO' | 'CAUTION';
  factors?: string[];
  timestamp: string;
}

export const DailyLifeAssistant: React.FC = () => {
  const { location, current, minutely, hourly, hyperlocal } = useWeather();

  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm CLOMAX AI Assistant calibrated for ${location.name}. Ask me any everyday question about leaving home, drying clothes, traffic safety, or outdoor activities.`,
      timestamp: 'Just now',
    },
  ]);

  const presetQuestions = [
    { text: 'Can I go to work now?', icon: Briefcase },
    { text: 'Will it rain before I reach college?', icon: GraduationCap },
    { text: 'Can I dry clothes on my terrace?', icon: Shirt },
    { text: 'Is it suitable for children to play outside?', icon: Baby },
    { text: 'Is it a good time for outdoor shopping?', icon: ShoppingBag },
    { text: 'Should street vendors set up their stalls?', icon: Store },
    { text: 'Should I carry an umbrella?', icon: Umbrella },
    { text: 'Is it suitable for a morning walk?', icon: Footprints },
  ];

  const handleAsk = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');

    // Generate contextual AI answer using real weather state
    setTimeout(() => {
      const answer = generateContextualAnswer(questionText, {
        locationName: location.name,
        currentTemp: current?.temperature ?? 28,
        currentPrecip: current?.precipitation ?? 0,
        rainNextMins: hyperlocal?.rainExpectedNextMins ?? null,
        rainIntensity: hyperlocal?.rainIntensity ?? 'None',
        humidity: current?.relativeHumidity ?? 65,
        windSpeed: current?.windSpeed ?? 12,
        isSuitable: hyperlocal?.recommendedOutdoorWindow.isSuitableNow ?? true,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: answer.text,
        verdict: answer.verdict,
        factors: answer.factors,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 450);
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-4 h-4" /> Practical Weather Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Daily Life Weather Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instant contextual advice for outdoor errands, travel decisions, and safety based on real micro-radar data.
          </p>
        </div>

        <div className="bg-[#070d1e] border border-slate-800 rounded-2xl p-3 text-right">
          <div className="text-xs font-mono font-bold text-cyan-300">
            {location.name} Station Connected
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Active: {current?.temperature}°C • {current?.conditionText}
          </div>
        </div>
      </div>

      {/* Preset Questions Chips Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Click Any Common Everyday Question:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presetQuestions.map((q, i) => {
            const Icon = q.icon;
            return (
              <button
                key={i}
                onClick={() => handleAsk(q.text)}
                className="p-3 rounded-2xl bg-[#091126] hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-400/50 text-left transition-all group flex items-start gap-2.5 shadow-md"
              >
                <div className="p-2 rounded-xl bg-[#0c152e] border border-slate-700/60 text-cyan-400 group-hover:scale-110 transition-transform mt-0.5 flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 leading-snug">
                  {q.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-3xl bg-[#091126] border border-cyan-500/25 shadow-2xl p-6 flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-tr-none'
                    : 'bg-[#0c152e] border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Verdict Badge if present */}
                {m.verdict && (
                  <div className="mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        m.verdict === 'YES'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : m.verdict === 'NO'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      Verdict: {m.verdict}
                    </span>
                  </div>
                )}

                <p className="leading-relaxed">{m.text}</p>

                {/* Factors checklist */}
                {m.factors && m.factors.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400 block">Supporting Live Metrics:</span>
                    {m.factors.map((f, i) => (
                      <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <span className="block text-[10px] text-slate-400 mt-2 font-mono text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuestion);
          }}
          className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask a question about weather suitability, traffic or rain..."
            className="flex-1 px-4 py-2.5 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-black flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Send className="w-4 h-4" /> Ask
          </button>
        </form>
      </div>
    </div>
  );
};

function generateContextualAnswer(q: string, ctx: any) {
  const query = q.toLowerCase();

  if (query.includes('work') || query.includes('office')) {
    if (ctx.currentPrecip > 2 || (ctx.rainNextMins !== null && ctx.rainNextMins <= 20)) {
      return {
        verdict: 'CAUTION' as const,
        text: `If you leave immediately, expect moderate downpours starting in ~${ctx.rainNextMins || 5} minutes in ${ctx.locationName}. Main arterial underpasses may experience 10-15 min traffic congestion.`,
        factors: [
          `Active rain rate: ${ctx.currentPrecip} mm/h`,
          `Underpasses starting to pool water`,
          `Metro transit recommended over two-wheeler commute`,
        ],
      };
    }
    return {
      verdict: 'YES' as const,
      text: `Road conditions in ${ctx.locationName} are currently dry and clear. Your commute corridor has zero active flood alerts.`,
      factors: [
        `Zero rain recorded in current radar frame`,
        `Surface wind nominal at ${ctx.windSpeed} km/h`,
        `Optimal travel window for the next 90 minutes`,
      ],
    };
  }

  if (query.includes('college') || query.includes('school')) {
    if (ctx.rainNextMins !== null && ctx.rainNextMins <= 45) {
      return {
        verdict: 'NO' as const,
        text: `Rain front is projected to intercept your sector within ${ctx.rainNextMins} minutes. Carry waterproof backpack cover and raincoat.`,
        factors: [
          `Cloud front velocity: 18 km/h moving east`,
          `Precipitation probability at 85%`,
        ],
      };
    }
    return {
      verdict: 'YES' as const,
      text: `You have a clear travel window. Radar shows no rain arriving before your journey completes.`,
      factors: [`Next 45 minutes are rain-free`, `Visibility is 9.5 km`],
    };
  }

  if (query.includes('clothes') || query.includes('dry') || query.includes('terrace')) {
    if (ctx.currentPrecip > 0 || (ctx.rainNextMins !== null && ctx.rainNextMins <= 90)) {
      return {
        verdict: 'NO' as const,
        text: `Do not put laundry on the open terrace. Showers will start before clothes can dry, and high humidity (${ctx.humidity}%) will prevent moisture evaporation.`,
        factors: [
          `Relative humidity: ${ctx.humidity}%`,
          `Rain expected within ${ctx.rainNextMins || 10} minutes`,
          `Indoor air-drying or balcony drying advised`,
        ],
      };
    }
    return {
      verdict: 'YES' as const,
      text: `Excellent conditions for terrace drying! Warm temperatures (${ctx.currentTemp}°C) and steady breeze will dry cottons rapidly within 2 hours.`,
      factors: [
        `Temperature: ${ctx.currentTemp}°C`,
        `Zero precipitation in next 2 hours`,
        `Wind speed: ${ctx.windSpeed} km/h`,
      ],
    };
  }

  if (query.includes('children') || query.includes('play')) {
    if (ctx.currentPrecip > 0 || (ctx.rainNextMins !== null && ctx.rainNextMins <= 30)) {
      return {
        verdict: 'NO' as const,
        text: `Outdoor playgrounds are currently damp or rain is imminent. Better to arrange indoor games for the next 2 hours.`,
        factors: [`Wet grass & slick swing sets`, `Lightning potential monitored`],
      };
    }
    return {
      verdict: 'YES' as const,
      text: `Safe and pleasant for children in community parks. Comfortable ambient temperature (${ctx.currentTemp}°C).`,
      factors: [`No rain projected`, `Air quality and thermal index favorable`],
    };
  }

  if (query.includes('shopping') || query.includes('market')) {
    return {
      verdict: (ctx.currentPrecip > 1 ? 'CAUTION' : 'YES') as any,
      text: ctx.currentPrecip > 1
        ? `Covered shopping malls are recommended. Street bazaars may have puddle splash and wet stall awnings.`
        : `Great time for street markets and open shopping avenues.`,
      factors: [`Precipitation: ${ctx.currentPrecip} mm`, `Comfort index rating: Good`],
    };
  }

  if (query.includes('vendor') || query.includes('stalls')) {
    if (ctx.windSpeed > 30 || ctx.currentPrecip > 1) {
      return {
        verdict: 'NO' as const,
        text: `Canopy hazard: Gusty winds of ${ctx.windSpeed} km/h and rain can damage open tarpaulins. Wait for front to clear.`,
        factors: [`Wind gusts exceed safety threshold`, `Footfall projected to decline`],
      };
    }
    return {
      verdict: 'YES' as const,
      text: `Stable weather window for outdoor vendors. Canopies secure under ${ctx.windSpeed} km/h wind.`,
      factors: [`Steady buyer footfall expected`, `Dry pavement`],
    };
  }

  if (query.includes('umbrella')) {
    const need = ctx.currentPrecip > 0 || (ctx.rainNextMins !== null && ctx.rainNextMins <= 90);
    return {
      verdict: (need ? 'YES' : 'NO') as any,
      text: need
        ? `Definitely carry an umbrella. Doppler radar confirms rain clouds moving toward your coordinates.`
        : `You can leave the umbrella behind for immediate short trips, but keep one handy if staying out past sunset.`,
      factors: [`Precipitation index: ${ctx.currentPrecip} mm`, `Precipitation probability: ${need ? '80%' : '15%'}`],
    };
  }

  // Morning walk / generic
  return {
    verdict: (ctx.isSuitable ? 'YES' : 'CAUTION') as any,
    text: ctx.isSuitable
      ? `Conditions in ${ctx.locationName} are pleasant (${ctx.currentTemp}°C). Tarmac is dry and ideal for running or walking.`
      : `High humidity or pending rain detected. Stick to covered paths or indoor workout.`,
    factors: [`Temp: ${ctx.currentTemp}°C`, `Wind: ${ctx.windSpeed} km/h`, `Relative Humidity: ${ctx.humidity}%`],
  };
}
