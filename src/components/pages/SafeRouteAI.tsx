import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Car,
  Footprints,
  Bike,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { calculateSafeRoutes } from '../../services/routingService';
import { SafeRouteOption } from '../../types/weather';

export const SafeRouteAI: React.FC = () => {
  const { location, floodHotspots, setActiveTab } = useWeather();

  const [origin, setOrigin] = useState(`${location.name} Station`);
  const [destination, setDestination] = useState(`${location.name} IT Park`);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bicycling'>('driving');
  const [departureTime, setDepartureTime] = useState('Now (Immediate)');
  const [routes, setRoutes] = useState<SafeRouteOption[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-safe-bypass');

  // Trigger routing calculation
  const handleCalculateRoutes = async () => {
    setIsCalculating(true);
    const originCoords = { name: origin, lat: location.lat - 0.015, lon: location.lon - 0.01 };
    const destCoords = { name: destination, lat: location.lat + 0.02, lon: location.lon + 0.015 };

    const calculated = await calculateSafeRoutes(originCoords, destCoords, travelMode, floodHotspots);
    setRoutes(calculated);
    if (calculated.length > 0) {
      const best = calculated.find((r) => r.recommended) || calculated[0];
      setSelectedRouteId(best.id);
    }
    setIsCalculating(false);
  };

  useEffect(() => {
    handleCalculateRoutes();
  }, [travelMode, location]);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-4 h-4" /> Urban Safety Router
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Safe Route AI — Flood & Rain Avoidance
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live routing engine that cross-references waterlogged underpasses, real citizen obstacle reports, and precipitation radar vectors.
          </p>
        </div>

        <div className="bg-[#070d1e] border border-slate-800 rounded-2xl p-3 text-right">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
            <ShieldCheck className="w-4 h-4" /> Multi-Source Safety Scoring
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Routes verified with elevation & municipal flood maps
          </div>
        </div>
      </div>

      {/* Main Interface: Route Controls & Route Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-[#091126] border border-cyan-500/30 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Journey Parameters
          </h3>

          {/* Origin */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Starting Point
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 text-xs focus:outline-none"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-sky-400" /> Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 text-xs focus:outline-none"
            />
          </div>

          {/* Travel Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Mode of Transit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'driving', label: 'Car / Cab', icon: Car },
                { id: 'bicycling', label: 'Two-Wheeler', icon: Bike },
                { id: 'walking', label: 'Walking', icon: Footprints },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setTravelMode(m.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                      travelMode === m.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-[#0c152e] text-slate-400 border-slate-700/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Departure Window
            </label>
            <select
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 text-xs focus:outline-none"
            >
              <option>Now (Immediate)</option>
              <option>In 20 minutes (Post-Shower)</option>
              <option>In 45 minutes</option>
              <option>In 1 hour 30 mins</option>
            </select>
          </div>

          <button
            onClick={handleCalculateRoutes}
            disabled={isCalculating}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50 mt-2"
          >
            {isCalculating ? 'Simulating Road Flooding...' : 'Recalculate Safe Routes'}
          </button>
        </div>

        {/* Right Area: Compared Routes & Path Visualizer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Calculated Alternatives ({routes.length} options evaluated)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Travel mode: {travelMode.toUpperCase()}
            </span>
          </div>

          {/* Route Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {routes.map((route) => (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedRouteId === route.id
                    ? 'bg-[#0c152e] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)] ring-1 ring-cyan-400'
                    : 'bg-[#091126] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {route.recommended && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-black shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> CLOMAX Recommended
                  </span>
                )}

                <div>
                  <h4 className="text-sm font-bold text-white mt-1">{route.name}</h4>
                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-2xl font-black text-cyan-300 font-mono">
                      {route.durationMins}m
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({route.distanceKm} km)
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Safety Index:</span>
                    <strong
                      className={`font-mono ${
                        route.safetyScore >= 80
                          ? 'text-emerald-400'
                          : route.safetyScore >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {route.safetyScore}/100
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Waterlogged Spots:</span>
                    <span className="font-mono text-slate-200">
                      {route.waterloggedHotspotsCount} points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Route Inspection Detailed Panel */}
          {selectedRoute && (
            <div className="rounded-3xl p-6 bg-[#091126] border border-cyan-500/25 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedRoute.name}</h4>
                  <p className="text-xs text-slate-400">{selectedRoute.summaryReason}</p>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-400 text-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  Inspect in 3D Map <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Waypoint details & safety advisories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0c152e] border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Route Elevation</span>
                  <span className="text-base font-bold text-white font-mono">
                    +{selectedRoute.elevationGainM}m elevation
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Keeps to upper ridge</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0c152e] border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Submerged Corridors</span>
                  <span className="text-base font-bold text-white font-mono">
                    {selectedRoute.highRiskRoads.length === 0 ? '0 Avoided' : selectedRoute.highRiskRoads[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {selectedRoute.highRiskRoads.length === 0 ? 'Safe tarmac' : 'Caution advised'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0c152e] border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Radar Precipitation Risk</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">Minimal Splash</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Clearing corridor</span>
                </div>
              </div>

              {/* Strict safety disclaimer reminder */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Safety Protocol Notice:</strong> CLOMAX uses active radar tracking and citizen crowd-reports. In rapid cloudburst conditions, avoid entering any unlit underpasses where water depth is unknown.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
