import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Wind,
  Compass,
  Sunrise,
  Sunset,
  Clock,
  ShieldAlert,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MapPin,
  Waves,
  Navigation,
  Eye,
  CheckCircle2,
  TrendingUp,
  Flame,
  Sun,
  Snowflake,
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { SeasonCategory } from '../../types/weather';

interface HomeDashboardProps {
  onOpenReportModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onOpenReportModal }) => {
  const {
    location,
    current,
    minutely,
    hourly,
    daily,
    hyperlocal,
    airQuality,
    seasons,
    selectedSeason,
    setSelectedSeason,
    loading,
    setActiveTab,
  } = useWeather();

  const [activeHourlyIndex, setActiveHourlyIndex] = useState(0);

  if (loading && !current) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <CloudRain className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">Syncing Radar & Air Quality Sensors...</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Fetching high-resolution precipitation forecasts, urban terrain elevation, and air pollution measurements.
        </p>
      </div>
    );
  }

  const todayForecast = daily[0];
  const activeSeasonData = seasons ? seasons[selectedSeason] : null;

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner Alert (Rain, Flood, or Heatwave) */}
      {hyperlocal && (
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative overflow-hidden ${
            hyperlocal.floodRiskAlert.level === 'Severe' || hyperlocal.floodRiskAlert.level === 'High'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
              : hyperlocal.rainExpectedNextMins !== null && hyperlocal.rainExpectedNextMins <= 30
              ? 'bg-cyan-950/60 border-cyan-400/50 text-cyan-200 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
              : current && current.temperature > 38
              ? 'bg-orange-950/50 border-orange-500/40 text-orange-200 shadow-[0_0_30px_rgba(249,115,22,0.2)]'
              : 'bg-[#0b142c]/80 border-cyan-500/25 text-slate-200 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
          }`}
        >
          {/* Neon Light Boom Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

          <div className="flex items-center gap-3.5">
            <div
              className={`p-2.5 rounded-xl border relative ${
                hyperlocal.floodRiskAlert.level === 'Severe' || hyperlocal.floodRiskAlert.level === 'High'
                  ? 'bg-rose-900/80 border-rose-400 text-rose-300'
                  : current && current.temperature > 38
                  ? 'bg-orange-900/80 border-orange-400 text-orange-300'
                  : 'bg-cyan-900/80 border-cyan-400 text-cyan-300'
              }`}
            >
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 border border-current">
                  {hyperlocal.rainExpectedNextMins !== null && hyperlocal.rainExpectedNextMins <= 30
                    ? `Precipitation in ${hyperlocal.rainExpectedNextMins}m`
                    : current && current.temperature > 38
                    ? 'Heatwave Danger Advisory'
                    : `Urban Runoff: ${hyperlocal.floodRiskAlert.level} Risk`}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  Updated {hyperlocal.lastUpdated}
                </span>
              </div>
              <p className="text-sm font-semibold mt-1">
                {hyperlocal.rainExpectedSummary} {hyperlocal.floodRiskAlert.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setActiveTab('map')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Eye className="w-3.5 h-3.5" /> View on 3D Map
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200"
            >
              Report Hazard
            </button>
          </div>
        </div>
      )}

      {/* Hero 3-Column Grid: Weather Station (4 cols), Hyperlocal Prediction (5 cols), Air Quality Index (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Current Weather Station (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-[#0c152e] via-[#091126] to-[#060b1b] border border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> Hyperlocal Station
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                  {location.name}
                </h2>
                <p className="text-xs text-slate-400">
                  {[location.admin1, location.country].filter(Boolean).join(', ')} • Elevation ~{location.elevation || 14}m
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  <Clock className="w-3 h-3 text-cyan-400" /> Live
                </span>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Temperature & Main Icon with Glowing Radar Sweep Dial */}
            <div className="my-6 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-300 font-mono tracking-tighter">
                    {current?.temperature ?? '--'}°
                  </span>
                  <span className="text-xl font-bold text-cyan-400">C</span>
                </div>
                <p className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-2">
                  {current?.conditionText || 'Nominal'}
                  <span className="text-xs text-slate-400 font-normal">
                    (Feels like {current?.apparentTemperature ?? '--'}°C)
                  </span>
                </p>
              </div>

              {/* Glowing Animated Radar Dial */}
              <div className="relative w-24 h-24 rounded-full bg-slate-900/90 border border-cyan-400/60 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(0,240,255,0.35)]">
                <div className="absolute inset-1 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-3 rounded-full border border-dashed border-cyan-400/50" />
                <div className="w-full h-full absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin opacity-80" />
                <CloudRain className="w-10 h-10 text-cyan-300 z-10" />
              </div>
            </div>

            {/* Core Weather Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-xl bg-[#070d1e]/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity
                </div>
                <div className="font-mono text-base font-bold text-slate-100">
                  {current?.relativeHumidity ?? 65}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#070d1e]/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" /> Wind
                </div>
                <div className="font-mono text-base font-bold text-slate-100">
                  {current?.windSpeed ?? 12} <span className="text-[10px] font-normal text-slate-400">km/h</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#070d1e]/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Precip Prob
                </div>
                <div className="font-mono text-base font-bold text-slate-100">
                  {minutely[0]?.probability ?? todayForecast?.precipitationProbability ?? 20}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#070d1e]/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" /> Rain Rate
                </div>
                <div className="font-mono text-base font-bold text-slate-100">
                  {current?.precipitation ?? 0} <span className="text-[10px] font-normal text-slate-400">mm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sunrise: <strong className="text-slate-200 font-mono">{todayForecast?.sunrise || '06:15'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <span>Sunset: <strong className="text-slate-200 font-mono">{todayForecast?.sunset || '18:35'}</strong></span>
            </div>
          </div>
        </div>

        {/* Center: "YOUR AREA — WEATHER INTELLIGENCE" (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Hyperlocal Prediction Engine
                </span>
                <h3 className="text-lg font-black text-white mt-0.5 tracking-tight">
                  YOUR AREA — WEATHER INTELLIGENCE
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                {hyperlocal?.spatialResolution || '1.1km Resolution'}
              </span>
            </div>

            {/* 3 Core Quick Decision Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3.5 rounded-2xl bg-[#0c152e] border border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Precipitation Timing</span>
                <div className="my-1.5">
                  <div className="text-lg font-black text-cyan-300 font-mono">
                    {hyperlocal?.rainExpectedNextMins !== null
                      ? hyperlocal?.rainExpectedNextMins === 0
                        ? 'Raining Now'
                        : `In ~${hyperlocal?.rainExpectedNextMins}m`
                      : 'Clear (2h)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Duration: {hyperlocal?.rainfallDurationEstHours || 0} hrs
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Intensity: <span className="text-cyan-400">{hyperlocal?.rainIntensity || 'None'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c152e] border border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Urban Flood Risk</span>
                <div className="my-1.5">
                  <div
                    className={`text-lg font-black font-mono ${
                      hyperlocal?.floodRiskAlert.level === 'Severe'
                        ? 'text-purple-400'
                        : hyperlocal?.floodRiskAlert.level === 'High'
                        ? 'text-rose-400'
                        : hyperlocal?.floodRiskAlert.level === 'Moderate'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {hyperlocal?.floodRiskAlert.level || 'Low'} Risk
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {hyperlocal?.floodRiskAlert.affectedStreets[0] || 'Underpasses clear'}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  Drainage status: Normal
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c152e] border border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Outdoor Window</span>
                <div className="my-1.5">
                  <div className="text-lg font-black text-emerald-300 font-mono">
                    {hyperlocal?.recommendedOutdoorWindow.isSuitableNow ? 'Favorable' : 'Stay Covered'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {hyperlocal?.recommendedOutdoorWindow.windowStart} - {hyperlocal?.recommendedOutdoorWindow.windowEnd}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {hyperlocal?.recommendedOutdoorWindow.idealActivities[0] || 'Safe outdoors'}
                </div>
              </div>
            </div>

            {/* Nearby Areas Affected Table */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Nearby Micro-Neighborhoods Radar Status</span>
                <span className="text-[11px] text-slate-400 font-normal">Within 5 km radius</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {hyperlocal?.nearbyAreasAffected.slice(0, 4).map((area, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#070d1e]/90 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          area.status === 'Raining now'
                            ? 'bg-rose-500 animate-ping'
                            : area.status === 'Rain within 15m'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-semibold text-slate-200">{area.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-cyan-300">
                        {area.status}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {area.distanceKm} km away
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400 hidden sm:block">
              {hyperlocal?.recommendedOutdoorWindow.recommendation}
            </p>
            <button
              onClick={() => setActiveTab('route')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 flex items-center gap-1.5 transition-all ml-auto"
            >
              Plan Safe Trip <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: NEW AIR QUALITY INDEX (AQI) IN AREA CARD (3 cols) */}
        <div className="lg:col-span-3 rounded-3xl p-6 bg-gradient-to-br from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4 text-cyan-400" /> Air Quality (AQI)
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Live Sensor
              </span>
            </div>

            {/* Glowing Big AQI Score Dial */}
            {airQuality && (
              <div className="my-4 text-center">
                <div
                  className="w-24 h-24 mx-auto rounded-full flex flex-col items-center justify-center border-4 shadow-xl transition-all"
                  style={{
                    borderColor: airQuality.color,
                    boxShadow: `0 0 25px ${airQuality.color}55`,
                    backgroundColor: 'rgba(7, 13, 30, 0.9)',
                  }}
                >
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">
                    {airQuality.aqi}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                    US AQI
                  </span>
                </div>

                <div className="mt-3">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                    style={{
                      backgroundColor: airQuality.badgeBg,
                      color: airQuality.color,
                      border: `1px solid ${airQuality.color}60`,
                    }}
                  >
                    {airQuality.label}
                  </span>
                </div>
              </div>
            )}

            {/* Pollutants breakdown list */}
            {airQuality && (
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">PM2.5 Fine Particles:</span>
                  <strong className="font-mono text-cyan-300">{airQuality.pm2_5} µg/m³</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">PM10 Coarse Dust:</span>
                  <strong className="font-mono text-slate-200">{airQuality.pm10} µg/m³</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Nitrogen Dioxide (NO2):</span>
                  <strong className="font-mono text-slate-200">{airQuality.no2} µg/m³</strong>
                </div>
              </div>
            )}
          </div>

          {/* Health Recommendation Box */}
          {airQuality && (
            <div className="mt-4 p-3 rounded-2xl bg-[#070d1e] border border-slate-800 text-[11px] text-slate-300">
              <span className="text-cyan-400 font-bold block mb-0.5">Health Advisory:</span>
              <p className="leading-snug">{airQuality.healthAdvisory}</p>
              {airQuality.maskRecommended && (
                <span className="inline-block mt-1 text-[10px] font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                  N95 Mask Advised Outdoors
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ALL SEASONS INTELLIGENCE MODULE (Monsoon, Summer Heatwave, Winter Fog, Severe Storm) */}
      <div className="rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Lights Boom Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-orange-400 to-sky-400 shadow-[0_0_15px_#00f0ff]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 365-Day Environmental Preparedness
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              ALL-SEASONS URBAN INTELLIGENCE & SAFETY
            </h3>
          </div>

          {/* 4 Season Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'monsoon' as SeasonCategory, label: 'Monsoon / Flood', icon: CloudRain, color: 'text-cyan-400' },
              { id: 'summer' as SeasonCategory, label: 'Summer Heatwave', icon: Flame, color: 'text-orange-400' },
              { id: 'winter' as SeasonCategory, label: 'Winter Fog & Smog', icon: Snowflake, color: 'text-sky-400' },
              { id: 'storm' as SeasonCategory, label: 'Cyclone & Storms', icon: Zap, color: 'text-violet-400' },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = selectedSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-[#0c152e] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : s.color}`} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Season Active Profile Panel */}
        {activeSeasonData && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: `${activeSeasonData.themeColor}22`,
                    color: activeSeasonData.themeColor,
                    border: `1px solid ${activeSeasonData.themeColor}55`,
                  }}
                >
                  {activeSeasonData.badge}
                </span>
                <span className="text-xs text-slate-400">Urban Safety Grid</span>
              </div>
              <h4 className="text-xl font-black text-white">{activeSeasonData.seasonName}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeSeasonData.description}
              </p>

              <div className="p-3 rounded-2xl bg-[#0c152e] border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5 font-medium">Seasonal Safety Playbook:</span>
                <strong className="text-slate-100">{activeSeasonData.keySafetyAdvisory}</strong>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeSeasonData.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <span className="text-[11px] text-slate-400 font-medium">{m.label}</span>
                  <div className="my-2">
                    <span
                      className={`text-base font-black font-mono ${
                        m.severity === 'red'
                          ? 'text-rose-400'
                          : m.severity === 'amber'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {m.value}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">{m.subtext}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WORKABLE INTERACTIVE GRAPH: 24-Hour Continuous Scrubber (Temp, Rain, Flood Risk) */}
      <div className="rounded-3xl p-6 bg-[#091126] border border-cyan-500/25 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Workable 24-Hour Weather & Flood Projection Graph
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click / Hover any hour column to view urban metrics
          </span>
        </div>

        {/* Interactive Scrubbing Graph */}
        <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-24 gap-1.5 text-center">
          {hourly.slice(0, 24).map((h, idx) => {
            const isSelected = activeHourlyIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveHourlyIndex(idx)}
                onMouseEnter={() => setActiveHourlyIndex(idx)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.35)] ring-1 ring-cyan-400'
                    : 'bg-[#0c152e]/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-300">{h.time}</span>

                {/* Vertical Bar Graph */}
                <div className="h-16 flex items-end justify-center my-1">
                  <div
                    className={`w-2.5 rounded-t transition-all ${
                      h.floodRiskLevel === 'red'
                        ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]'
                        : h.precipitation > 1
                        ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                        : 'bg-slate-600'
                    }`}
                    style={{
                      height: `${Math.max(6, Math.min(60, h.temperature * 1.5 + h.precipitation * 6))}px`,
                    }}
                  />
                </div>

                <div>
                  <span className="text-[11px] font-black font-mono text-white block">
                    {h.temperature}°
                  </span>
                  <span className="text-[9px] text-cyan-300 font-mono">
                    {h.precipitation > 0 ? `${h.precipitation}m` : '0m'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Hour Active Inspector */}
        {hourly[activeHourlyIndex] && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#070d1e] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <strong className="text-white font-mono">{hourly[activeHourlyIndex].time} Inspection:</strong>
              <span className="text-slate-300 font-semibold">{hourly[activeHourlyIndex].conditionText}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Temp: <strong className="text-white">{hourly[activeHourlyIndex].temperature}°C</strong></span>
              <span>Precip: <strong className="text-cyan-300">{hourly[activeHourlyIndex].precipitation} mm</strong></span>
              <span>Wind: <strong className="text-slate-300">{hourly[activeHourlyIndex].windSpeed} km/h</strong></span>
              <span>Humidity: <strong className="text-slate-300">{hourly[activeHourlyIndex].humidity}%</strong></span>
              <span>Flood Risk: <strong className={`uppercase ${hourly[activeHourlyIndex].floodRiskLevel === 'red' ? 'text-rose-400' : 'text-emerald-400'}`}>{hourly[activeHourlyIndex].floodRiskLevel}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Killer Features Showcase Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 3D Map */}
        <div
          onClick={() => setActiveTab('map')}
          className="p-5 rounded-2xl bg-[#0a1228] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all hover:-translate-y-1 group shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
              Live 3D City & Radar Map <ArrowRight className="w-4 h-4 text-cyan-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              3D buildings, moving radar rain vectors, and street water-depth markers.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-cyan-400 font-mono font-bold">
            Interactive 3D Engine →
          </span>
        </div>

        {/* Card 2: Safe Route AI */}
        <div
          onClick={() => setActiveTab('route')}
          className="p-5 rounded-2xl bg-[#0a1228] border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all hover:-translate-y-1 group shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Navigation className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
              Safe Route AI Navigation <ArrowRight className="w-4 h-4 text-emerald-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Avoids submerged underpasses and waterlogged corridors with safety scoring.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-emerald-400 font-mono font-bold">
            Anti-Flooding Router →
          </span>
        </div>

        {/* Card 3: Community Hazards & Heatwave */}
        <div
          onClick={() => setActiveTab('community')}
          className="p-5 rounded-2xl bg-[#0a1228] border border-orange-500/30 hover:border-orange-400 cursor-pointer transition-all hover:-translate-y-1 group shadow-[0_0_20px_rgba(249,115,22,0.15)] flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-orange-300 flex items-center justify-between">
              Community Hazards & Heatwave <ArrowRight className="w-4 h-4 text-orange-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Citizen reports for waterlogging depths, road blocks, and extreme heat shelters.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-orange-400 font-mono font-bold">
            Crowdsourced Safety →
          </span>
        </div>
      </div>
    </div>
  );
};
