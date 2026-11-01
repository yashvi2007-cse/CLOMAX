import React, { useState } from 'react';
import {
  Waves,
  AlertTriangle,
  Layers,
  MapPin,
  TrendingDown,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Filter,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { FloodZoneHotspot } from '../../types/weather';

export const FloodVision: React.FC = () => {
  const { location, floodHotspots, current, hyperlocal, setActiveTab } = useWeather();
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'predicted' | 'user_reported'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'red' | 'orange' | 'green' | 'grey'>('all');
  const [selectedHotspot, setSelectedHotspot] = useState<FloodZoneHotspot | null>(floodHotspots[0] || null);

  const filteredHotspots = floodHotspots.filter((h) => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterRisk !== 'all' && h.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Waves className="w-4 h-4" /> FloodVision AI System
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Urban Flood & Waterlogging Risk Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Correlating topography, storm drainage culverts, tidal levels, and real citizen reports for {location.name}.
          </p>
        </div>

        {/* Status Indicators Legend */}
        <div className="flex items-center gap-2 flex-wrap bg-[#070d1e] border border-slate-800 p-2.5 rounded-2xl text-[11px]">
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Red (High Risk)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Orange (Moderate)
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green (Lower Risk)
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-bold ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Grey (Insufficient Data)
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#091126] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Monitored Hotspots</span>
          <div className="text-2xl font-black text-white font-mono">{floodHotspots.length} Zones</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Across {location.name} metro</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091126] border border-rose-500/30 bg-rose-950/20">
          <span className="text-xs text-rose-300 block mb-1">High Risk / Submerged</span>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {floodHotspots.filter((h) => h.riskLevel === 'red').length} Zones
          </div>
          <span className="text-[11px] text-rose-300/80 mt-0.5 block">Exceeds 25cm standing water</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091126] border border-amber-500/30 bg-amber-950/20">
          <span className="text-xs text-amber-300 block mb-1">Moderate Risk</span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {floodHotspots.filter((h) => h.riskLevel === 'orange').length} Zones
          </div>
          <span className="text-[11px] text-amber-300/80 mt-0.5 block">Curb overflow observed</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091126] border border-cyan-500/30">
          <span className="text-xs text-cyan-400 block mb-1">Drainage Integrity</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">72% Nominal</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Pumping stations operational</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091126] p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">Data Source:</span>
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'verified', label: 'Officially Verified' },
            { id: 'predicted', label: 'Hydrological Predicted' },
            { id: 'user_reported', label: 'Citizen Reported' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === t.id
                  ? 'bg-cyan-400 text-black font-bold'
                  : 'bg-[#0c152e] text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">Risk Level:</span>
          {(['all', 'red', 'orange', 'green', 'grey'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold ${
                filterRisk === r
                  ? 'bg-slate-200 text-black'
                  : 'bg-[#0c152e] text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Master Detail Grid: Hotspots List & Selected Zone Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hotspots Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredHotspots.length === 0 ? (
            <div className="p-8 text-center bg-[#091126] rounded-3xl border border-slate-800 text-slate-400 text-xs">
              No flood hotspots match the selected filter parameters.
            </div>
          ) : (
            filteredHotspots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedHotspot(spot)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedHotspot?.id === spot.id
                    ? 'bg-[#0c152e] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400'
                    : 'bg-[#091126] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 ${
                        spot.riskLevel === 'red'
                          ? 'bg-rose-500 shadow-[0_0_10px_#ef4444]'
                          : spot.riskLevel === 'orange'
                          ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                          : spot.riskLevel === 'green'
                          ? 'bg-emerald-400'
                          : 'bg-slate-500'
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{spot.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{spot.notes}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        spot.riskLevel === 'red'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : spot.riskLevel === 'orange'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {spot.riskLabel}
                    </span>
                    <span className="block text-xs font-mono font-bold text-cyan-300 mt-1">
                      {spot.waterDepthCm} cm depth
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                    Elevation: {spot.elevationMeters}m MSL
                  </span>
                  <span>Drainage: <strong className="text-slate-200">{spot.drainageCapacity}</strong></span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {spot.confidenceScore}% confidence
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Zone Deep Dive Panel (5 cols) */}
        {selectedHotspot && (
          <div className="lg:col-span-5 rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Topographical Risk Profile
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedHotspot.name}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                  selectedHotspot.riskLevel === 'red'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {selectedHotspot.riskLabel}
              </span>
            </div>

            {/* Water Depth Meter */}
            <div className="p-4 rounded-2xl bg-[#0c152e] border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400 font-semibold">Submersion Level</span>
                <span className="text-cyan-300 font-mono font-bold text-base">
                  {selectedHotspot.waterDepthCm} cm ({Math.round(selectedHotspot.waterDepthCm / 2.54)} inches)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, selectedHotspot.waterDepthCm * 2)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {selectedHotspot.waterDepthCm > 25
                  ? 'Hazardous for small cars and motorbikes. Exhaust backpressure stalling likely.'
                  : 'Passable at reduced crawling speeds. Caution for open gutter lids.'}
              </p>
            </div>

            {/* Geo & Infrastructure Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#070d1e] border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Terrain Elevation</span>
                <span className="text-base font-bold text-white font-mono">
                  {selectedHotspot.elevationMeters} meters
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Below sector average</span>
              </div>

              <div className="p-3 rounded-xl bg-[#070d1e] border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Historical Incidents</span>
                <span className="text-base font-bold text-white font-mono">
                  {selectedHotspot.historicalEventsCount} flood events
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Since 2021 municipal logs</span>
              </div>
            </div>

            {/* Affected Corridors */}
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800">
              <h5 className="text-xs font-bold text-slate-300 mb-2">Affected Arterials & Intersections:</h5>
              <div className="space-y-1.5 text-xs text-slate-300">
                {selectedHotspot.affectedRoads.map((road, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{road}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('map')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect on 3D Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
