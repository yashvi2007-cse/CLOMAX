import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CloudRain,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Waves,
  TrendingUp,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const WeatherSimulator: React.FC = () => {
  const { location, floodHotspots } = useWeather();

  const [preset, setPreset] = useState<'light' | 'moderate' | 'heavy' | 'extreme'>('heavy');
  const [rainRateMmH, setRainRateMmH] = useState(60);
  const [durationHours, setDurationHours] = useState(2);
  const [drainageCompromisePercent, setDrainageCompromisePercent] = useState(30);

  // Playback timeline in simulation (0 to 180 mins)
  const [simMinute, setSimMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Apply preset values
  const applyPreset = (type: 'light' | 'moderate' | 'heavy' | 'extreme') => {
    setPreset(type);
    setSimMinute(0);
    setIsPlaying(false);
    switch (type) {
      case 'light':
        setRainRateMmH(5);
        setDurationHours(1);
        setDrainageCompromisePercent(10);
        break;
      case 'moderate':
        setRainRateMmH(25);
        setDurationHours(2);
        setDrainageCompromisePercent(25);
        break;
      case 'heavy':
        setRainRateMmH(60);
        setDurationHours(3);
        setDrainageCompromisePercent(45);
        break;
      case 'extreme':
        setRainRateMmH(120);
        setDurationHours(4);
        setDrainageCompromisePercent(70);
        break;
    }
  };

  // Timeline playback ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimMinute((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 180;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Derived simulation metrics
  const totalWaterMm = Number(((rainRateMmH * simMinute) / 60).toFixed(1));
  const effectiveDrainageMmH = 20 * (1 - drainageCompromisePercent / 100);
  const drainedWaterMm = Number(((effectiveDrainageMmH * simMinute) / 60).toFixed(1));
  const accumulatedWaterMm = Math.max(0, Number((totalWaterMm - drainedWaterMm).toFixed(1)));
  const subwayPondingCm = Math.round(accumulatedWaterMm * 0.85);

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Hydrological What-If Model
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Urban Weather & Runoff Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulate scenario-based rainfall volumes against topography Saucer basins and stormwater drainage pipelines in {location.name}.
          </p>
        </div>

        <div className="p-3 bg-[#070d1e] border border-slate-800 rounded-2xl text-[11px] text-slate-400 max-w-xs text-right">
          <span className="font-bold text-amber-400 flex items-center gap-1 justify-end">
            <Info className="w-3.5 h-3.5" /> Scenario Model Only
          </span>
          Outputs represent simulated hydraulic stresses, not certified flash flood predictions.
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'light', label: 'Light Rainfall', rate: '5 mm/h', desc: 'Passing drizzle, no pooling' },
          { id: 'moderate', label: 'Moderate Rainfall', rate: '25 mm/h', desc: 'Curb splash, slow drainage' },
          { id: 'heavy', label: 'Heavy Storm', rate: '60 mm/h', desc: 'Subways ponding, lane closures' },
          { id: 'extreme', label: 'Cloudburst Crisis', rate: '120 mm/h', desc: 'Severe flooding, impassable roads' },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              preset === p.id
                ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400'
                : 'bg-[#091126] border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {p.label}
            </span>
            <div className="text-xl font-black text-white font-mono my-1">{p.rate}</div>
            <p className="text-[11px] text-slate-400">{p.desc}</p>
          </button>
        ))}
      </div>

      {/* Simulation Controls & Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders & Parameters (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> Scenario Controls
          </h3>

          {/* Rain Rate Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">Rainfall Rate</span>
              <span className="text-cyan-300 font-mono font-bold">{rainRateMmH} mm/h</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              value={rainRateMmH}
              onChange={(e) => setRainRateMmH(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">Storm Duration</span>
              <span className="text-cyan-300 font-mono font-bold">{durationHours} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Drainage Compromise */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">Drainage Grate Blockage</span>
              <span className="text-amber-400 font-mono font-bold">{drainageCompromisePercent}% Blocked</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={drainageCompromisePercent}
              onChange={(e) => setDrainageCompromisePercent(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Timeline Playback Bar */}
          <div className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Elapsed Simulation Timeline:</span>
              <span className="text-sm font-mono font-bold text-cyan-300">
                T + {simMinute} mins
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={simMinute}
              onChange={(e) => setSimMinute(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause Simulation' : 'Run Simulation'}
              </button>
              <button
                onClick={() => {
                  setSimMinute(0);
                  setIsPlaying(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Water Accumulation Cross-Section (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Saucer Depression Hydraulic Response
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Subway Underpass Cross-Section
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                  subwayPondingCm > 30
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : subwayPondingCm > 12
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {subwayPondingCm > 30 ? 'CRITICAL FLOODING' : subwayPondingCm > 12 ? 'MODERATE PONDING' : 'SAFE DRAINAGE'}
              </span>
            </div>

            {/* Cross-section visual box */}
            <div className="my-5 p-5 rounded-2xl bg-[#060b1b] border border-slate-800 h-52 relative overflow-hidden flex flex-col justify-end">
              {/* Rain Particle drops simulated */}
              <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-around">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[1.5px] bg-cyan-300 animate-pulse"
                    style={{
                      height: `${15 + (i % 5) * 8}px`,
                      marginTop: `${(i * 12) % 40}px`,
                    }}
                  />
                ))}
              </div>

              {/* Water level layer */}
              <div
                className="w-full bg-gradient-to-t from-cyan-600/80 via-blue-500/70 to-cyan-400/60 transition-all duration-300 relative border-t-2 border-cyan-300"
                style={{ height: `${Math.min(100, (subwayPondingCm / 60) * 100)}%` }}
              >
                <div className="absolute -top-6 right-3 px-2 py-0.5 rounded bg-black/70 text-cyan-300 font-mono text-xs font-bold">
                  Standing Water: {subwayPondingCm} cm
                </div>
              </div>

              {/* Road / Ground base */}
              <div className="w-full h-8 bg-slate-900 border-t border-slate-700 flex items-center justify-between px-3 text-[10px] text-slate-400 font-mono z-10">
                <span>Elevation: 4.2m MSL</span>
                <span>Subway Sump Basin</span>
                <span>Culvert Outlet</span>
              </div>
            </div>

            {/* Simulated Hotspots Impact Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">Projected Hotspot Impacts at T+{simMinute}m:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {floodHotspots.slice(0, 4).map((h, i) => {
                  const projectedCm = Math.round(subwayPondingCm * (h.elevationMeters < 6 ? 1.2 : 0.4));
                  return (
                    <div key={i} className="p-2.5 rounded-xl bg-[#0c152e] border border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate pr-2">{h.name}</span>
                      <span
                        className={`font-mono font-bold whitespace-nowrap ${
                          projectedCm > 25 ? 'text-rose-400' : projectedCm > 10 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        ~{projectedCm} cm
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <strong>Simulation Insights:</strong> At {rainRateMmH} mm/h precipitation with {drainageCompromisePercent}% blocked culverts, urban runoff overwhelms roadside catch-basins within {Math.round(20 * (100 / Math.max(10, rainRateMmH)))} minutes.
          </div>
        </div>
      </div>
    </div>
  );
};
