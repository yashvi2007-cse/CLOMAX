import React, { useState } from 'react';
import {
  CloudRain,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const RainIntelligence: React.FC = () => {
  const { location, current, minutely, hourly, daily, hyperlocal } = useWeather();
  const [selectedHorizon, setSelectedHorizon] = useState<'now' | '15m' | '30m' | '60m' | '120m' | 'hourly' | '7day'>('now');

  // Derive metrics for the selected time horizon
  const getHorizonDetails = () => {
    switch (selectedHorizon) {
      case 'now':
        return {
          title: 'Immediate Real-Time Radar',
          prob: current?.precipitation ? 98 : (minutely[0]?.probability || 15),
          amountMm: current?.precipitation || 0,
          intensity: hyperlocal?.rainIntensity || 'None',
          startTime: 'Active Now',
          endTime: current?.precipitation ? 'In ~45 mins' : 'No rain observed',
          confidence: 96,
        };
      case '15m':
        return {
          title: 'Next 15 Minutes Forecast',
          prob: minutely[0]?.probability || 25,
          amountMm: minutely[0]?.precipitation || 0,
          intensity: minutely[0]?.intensityLabel || 'None',
          startTime: hyperlocal?.rainExpectedNextMins ? `In ${hyperlocal.rainExpectedNextMins}m` : 'Dry conditions',
          endTime: `Estimated ~+30m`,
          confidence: 94,
        };
      case '30m':
        return {
          title: 'Next 30 Minutes Forecast',
          prob: minutely[1]?.probability || 30,
          amountMm: minutely[1]?.precipitation || 0,
          intensity: minutely[1]?.intensityLabel || 'None',
          startTime: '+30m Front Arrival',
          endTime: '+75m Front Passage',
          confidence: 91,
        };
      case '60m':
        return {
          title: 'Next 60 Minutes Forecast',
          prob: minutely[3]?.probability || 45,
          amountMm: minutely[3]?.precipitation || 0,
          intensity: minutely[3]?.intensityLabel || 'Light',
          startTime: '+45m - +60m Window',
          endTime: '+90m Clearance',
          confidence: 88,
        };
      case '120m':
        return {
          title: 'Next 120 Minutes (2-Hour Envelope)',
          prob: minutely[7]?.probability || 35,
          amountMm: minutely.reduce((acc, m) => acc + m.precipitation, 0),
          intensity: 'Cumulative Envelope',
          startTime: '0m',
          endTime: '+120m',
          confidence: 85,
        };
      default:
        return {
          title: 'Extended Horizon',
          prob: hourly[0]?.precipitationProbability || 20,
          amountMm: hourly[0]?.precipitation || 0,
          intensity: 'Multi-Hour Pattern',
          startTime: 'Today',
          endTime: 'Next 24h',
          confidence: 82,
        };
    }
  };

  const horizon = getHorizonDetails();

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <CloudRain className="w-4 h-4" /> Precipitation Prediction Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Nowcasting & Radar Vector Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Combining Doppler radar reflectivity, satellite downscaling, and thermodynamic soundings for {location.name}.
          </p>
        </div>

        {/* Spatial Resolution & Freshness Chip */}
        <div className="bg-[#070d1e] border border-slate-800 rounded-2xl p-3 text-right">
          <div className="text-xs font-mono font-bold text-cyan-300">
            {hyperlocal?.spatialResolution || '1.1 km Grid Resolution'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Confidence: <span className="text-emerald-400 font-bold">{horizon.confidence}%</span> • Synced {hyperlocal?.lastUpdated || 'just now'}
          </div>
        </div>
      </div>

      {/* Time Horizon Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'now', label: 'Now' },
          { id: '15m', label: 'Next 15 Min' },
          { id: '30m', label: 'Next 30 Min' },
          { id: '60m', label: 'Next 60 Min' },
          { id: '120m', label: 'Next 120 Min' },
          { id: 'hourly', label: 'Hourly Forecast (24h)' },
          { id: '7day', label: '7-Day Outlook' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedHorizon(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedHorizon === tab.id
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                : 'bg-[#0c152e] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Horizon Card */}
      {selectedHorizon !== 'hourly' && selectedHorizon !== '7day' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Intelligence Gauge (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{horizon.title}</h3>
                <p className="text-xs text-slate-400">{location.name} Local Atmosphere</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                {horizon.confidence}% Model Confidence
              </span>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Precip Probability</span>
                <span className="text-2xl font-black text-cyan-300 font-mono">{horizon.prob}%</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Expected Rainfall</span>
                <span className="text-2xl font-black text-sky-300 font-mono">{horizon.amountMm} <span className="text-xs">mm</span></span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Intensity Level</span>
                <span className="text-base font-bold text-white block mt-1">{horizon.intensity}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Precip Window</span>
                <span className="text-xs font-semibold text-slate-200 block mt-1">{horizon.startTime}</span>
              </div>
            </div>

            {/* Radar Visual Intensity Bar */}
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Rainfall Intensity Scale</span>
                <span className="font-mono text-cyan-300">{horizon.amountMm} mm/h</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[20%]" title="Light (0-2.5 mm)" />
                <div className="h-full bg-yellow-400 w-[30%]" title="Moderate (2.5-7.5 mm)" />
                <div className="h-full bg-orange-500 w-[25%]" title="Heavy (7.5-15 mm)" />
                <div className="h-full bg-red-600 w-[25%]" title="Torrential (>15 mm)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 mm</span>
                <span>2.5 mm</span>
                <span>7.5 mm</span>
                <span>15+ mm</span>
              </div>
            </div>

            {/* 15-Minute Timeline Bar Visualizer */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-3">Next 120-Minute Trajectory:</h4>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                {minutely.map((m, i) => (
                  <div key={i} className="p-2 rounded-xl bg-[#0c152e] border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono block">{m.time}</span>
                    <div className="my-2 h-10 flex items-end justify-center">
                      <div
                        className="w-3 rounded-t bg-cyan-400"
                        style={{ height: `${Math.max(4, m.precipitation * 8 + 4)}px` }}
                      />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-100">{m.precipitation}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Affected Micro-Neighborhoods & Resolution Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl p-6 bg-[#091126] border border-cyan-500/25 shadow-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" /> Sector Downpour Propagation
              </div>
              <h3 className="text-base font-bold text-white">Affected Nearby Neighborhoods</h3>
              <p className="text-xs text-slate-400 mt-1">
                Spatial tracking of rain clouds traversing across adjacent sectors:
              </p>

              <div className="mt-4 space-y-2.5">
                {hyperlocal?.nearbyAreasAffected.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0c152e] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{area.name}</div>
                      <div className="text-xs text-slate-400">{area.distanceKm} km from station</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          area.status === 'Raining now'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : area.status === 'Rain within 15m'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {area.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Starts in ~{area.startsInMins}m
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spatial Resolution Transparency Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Sensor Resolution Note
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                CLOMAX computes radar reflectivity from ground stations combined with ECMWF IFS 0.1° numerical grids interpolated to 1.1 km street cells. Microclimates under tall skyscraper canopies may vary ±0.2 mm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Forecast Table (If Selected) */}
      {selectedHorizon === 'hourly' && (
        <div className="rounded-3xl p-6 bg-[#091126] border border-cyan-500/25 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">24-Hour Continuous Hourly Forecast</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c152e] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Temp</th>
                  <th className="p-3">Rainfall</th>
                  <th className="p-3">Precip Prob</th>
                  <th className="p-3">Wind Speed</th>
                  <th className="p-3">Flood Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {hourly.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-cyan-300 font-bold">{h.time}</td>
                    <td className="p-3 font-sans text-slate-200">{h.conditionText}</td>
                    <td className="p-3 text-slate-100 font-bold">{h.temperature}°C</td>
                    <td className="p-3 text-sky-300">{h.precipitation} mm</td>
                    <td className="p-3">{h.precipitationProbability}%</td>
                    <td className="p-3 text-slate-400">{h.windSpeed} km/h</td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          h.floodRiskLevel === 'red'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : h.floodRiskLevel === 'orange'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {h.floodRiskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7-Day Outlook (If Selected) */}
      {selectedHorizon === '7day' && (
        <div className="rounded-3xl p-6 bg-[#091126] border border-cyan-500/25 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">7-Day Extended Weather & Rain Outlook</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {daily.map((d, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800 flex flex-col justify-between text-center"
              >
                <div>
                  <div className="text-sm font-bold text-slate-100">{d.dayName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{d.date}</div>
                  <div className="my-3 text-cyan-300 text-xs font-semibold">{d.conditionText}</div>
                </div>
                <div>
                  <div className="text-lg font-mono font-black text-white">
                    {d.tempMax}° / <span className="text-slate-400 font-normal">{d.tempMin}°</span>
                  </div>
                  <div className="text-xs font-mono text-sky-300 mt-1">
                    {d.precipitationSum} mm ({d.precipitationProbability}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
