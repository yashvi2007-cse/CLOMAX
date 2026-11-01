import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import {
  Layers,
  Eye,
  EyeOff,
  Compass,
  Plus,
  Minus,
  AlertTriangle,
  CloudRain,
  Navigation,
  Wind,
  Thermometer,
  ShieldCheck,
  MapPin,
  Sparkles,
  Flame,
  Activity,
  TrendingDown,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { FloodZoneHotspot } from '../../types/weather';
import { weatherSound } from '../../services/soundService';

export const LiveMap3D: React.FC = () => {
  const {
    location,
    current,
    activeLayers,
    toggleLayer,
    floodHotspots,
    airQuality,
  } = useWeather();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);

  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<FloodZoneHotspot | null>(null);
  const [isRadarPlaying, setIsRadarPlaying] = useState(true);
  const [radarTimeOffset, setRadarTimeOffset] = useState(0);
  const [activeGraphPoint, setActiveGraphPoint] = useState<number | null>(null);
  const [isSoundActive, setIsSoundActive] = useState(false);

  // Toggle ambient weather sound
  const toggleSound = () => {
    const next = !isSoundActive;
    setIsSoundActive(next);
    weatherSound.setMuted(!next);
  };

  // Fly to hotspot coordinates on map when clicked on the graph or list
  const flyToHotspot = (spot: FloodZoneHotspot) => {
    setSelectedHotspot(spot);
    weatherSound.playHazardAlertTone();
    mapRef.current?.flyTo({
      center: [spot.lon, spot.lat],
      zoom: 15.2,
      pitch: 60,
      bearing: -30,
      duration: 1500,
    });
  };

  // Periodic subtle radar ping if sound is active and radar is playing
  useEffect(() => {
    if (!isSoundActive || !isRadarPlaying) return;
    const interval = setInterval(() => {
      weatherSound.playRadarSweepPing();
    }, 4000);
    return () => clearInterval(interval);
  }, [isSoundActive, isRadarPlaying]);

  // Initialize MapLibre GL map with clean Esri Dark Gray Base (clamped to maxzoom 15 with overscaling to eliminate 'Map data not available' watermarks)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-dark-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 15,
            attribution: '© Esri, OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'esri-dark-tiles-layer',
            type: 'raster',
            source: 'esri-dark-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [location.lon, location.lat],
      zoom: 14.5,
      maxZoom: 18,
      pitch: is3DMode ? 55 : 0,
      bearing: -20,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add 3D Extrusion Buildings
      map.addSource('custom-3d-city', {
        type: 'geojson',
        data: generateCityBuildingsGeoJson(location.lat, location.lon),
      });

      map.addLayer({
        id: '3d-buildings',
        source: 'custom-3d-city',
        type: 'fill-extrusion',
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'height'],
            0, '#0e244d',
            40, '#163b7c',
            100, '#00f0ff',
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.82,
        },
      });

      // Add Safe Route and Risky Route GeoJSON Layer
      const routeGeoJson = generateMockRoutesGeoJson(location.lat, location.lon);
      map.addSource('route-lines', {
        type: 'geojson',
        data: routeGeoJson,
      });

      map.addLayer({
        id: 'route-lines-layer',
        source: 'route-lines',
        type: 'line',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': 0.95,
          'line-dasharray': ['case', ['==', ['get', 'type'], 'risky'], ['literal', [2, 2]], ['literal', [1]]],
        },
      });

      // Add Current Location Pulse Marker with Glowing Boom Halos
      const el = document.createElement('div');
      el.className = 'w-8 h-8 relative flex items-center justify-center';
      el.innerHTML = `
        <div class="absolute w-8 h-8 rounded-full bg-cyan-400 opacity-40 animate-ping"></div>
        <div class="absolute w-12 h-12 rounded-full border border-cyan-400/50 opacity-30 animate-pulse"></div>
        <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_20px_#00f0ff]"></div>
      `;
      new maplibregl.Marker({ element: el })
        .setLngLat([location.lon, location.lat])
        .addTo(map);

      // Add Flood Hotspots Markers with Glowing Boom Lights
      floodHotspots.forEach((spot) => {
        const markerDiv = document.createElement('div');
        markerDiv.className = 'cursor-pointer group';
        const color = spot.riskLevel === 'red' ? '#ef4444' : spot.riskLevel === 'orange' ? '#f59e0b' : '#10b981';
        markerDiv.innerHTML = `
          <div class="relative flex flex-col items-center">
            <div class="px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-lg whitespace-nowrap mb-1 animate-pulse" style="background-color: ${color}; box-shadow: 0 0 15px ${color}">
              ${spot.waterDepthCm > 0 ? `${spot.waterDepthCm}cm` : spot.riskLabel}
            </div>
            <div class="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative" style="background-color: ${color}; box-shadow: 0 0 20px ${color}">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span class="absolute -inset-1 rounded-full animate-ping opacity-30" style="background-color: ${color}"></span>
            </div>
          </div>
        `;
        markerDiv.addEventListener('click', () => flyToHotspot(spot));

        new maplibregl.Marker({ element: markerDiv })
          .setLngLat([spot.lon, spot.lat])
          .addTo(map);
      });
    });

    return () => {
      map.remove();
    };
  }, [location, is3DMode]);

  // Update map layer visibility based on activeLayers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer('route-lines-layer')) {
      map.setLayoutProperty('route-lines-layer', 'visibility', activeLayers.safeRoute ? 'visible' : 'none');
    }
  }, [activeLayers]);

  // Animated Radar Precipitation Overlay & Glowing Light Beam on Canvas
  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    if (!canvas || !activeLayers.rainfall) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeLayers.rainfall && isRadarPlaying) {
        frame += 0.02;
        const cx = canvas.width / 2 + Math.sin(frame * 0.5) * 40;
        const cy = canvas.height / 2 + Math.cos(frame * 0.3) * 30;

        // Overlapping radar cloud blobs with precipitation intensity colors
        const blobs = [
          { r: 250, color: 'rgba(0, 240, 255, 0.18)' },
          { r: 170, color: 'rgba(14, 165, 233, 0.30)' },
          { r: 100, color: 'rgba(234, 179, 8, 0.38)' },
          { r: 45, color: 'rgba(239, 68, 68, 0.55)' },
        ];

        blobs.forEach((b, i) => {
          const grad = ctx.createRadialGradient(cx, cy, 10, cx + (i * 12), cy - (i * 8), b.r);
          grad.addColorStop(0, b.color);
          grad.addColorStop(0.7, b.color.replace('0.55', '0.2').replace('0.38', '0.15').replace('0.30', '0.08'));
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx + (i * 12), cy - (i * 8), b.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Glowing radar beam sweep light effect
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(frame * 2.5);
        const beamGrad = ctx.createLinearGradient(0, 0, 240, 0);
        beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.6)');
        beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 240, -0.2, 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Rain Movement Vectors
        if (activeLayers.rainMovement) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.5;
          const time = Date.now() * 0.001;

          for (let x = 80; x < canvas.width; x += 110) {
            for (let y = 80; y < canvas.height; y += 110) {
              const offset = Math.sin(time + x * 0.01 + y * 0.01) * 20;
              ctx.beginPath();
              ctx.moveTo(x + offset, y + offset);
              ctx.lineTo(x + offset + 18, y + offset + 22);
              ctx.stroke();

              ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
              ctx.beginPath();
              ctx.arc(x + offset + 18, y + offset + 22, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeLayers.rainfall, activeLayers.rainMovement, isRadarPlaying]);

  const zoomIn = () => {
    weatherSound.playClickTick();
    mapRef.current?.zoomIn();
  };
  const zoomOut = () => {
    weatherSound.playClickTick();
    mapRef.current?.zoomOut();
  };
  const resetNorth = () => {
    weatherSound.playClickTick();
    mapRef.current?.resetNorthPitch();
  };
  const toggle3D = () => {
    weatherSound.playClickTick();
    setIs3DMode((prev) => {
      const next = !prev;
      mapRef.current?.easeTo({
        pitch: next ? 55 : 0,
        bearing: next ? -20 : 0,
        duration: 1000,
      });
      return next;
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-125px)] bg-[#040814] overflow-hidden select-none flex flex-col font-sans">
      {/* Top Map Action Bar with Sound Controls & Lights Boom Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Active Location & Weather Status */}
        <div className="pointer-events-auto bg-[#070d1e]/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-extrabold text-sm text-white">{location.name} 3D Command Map</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-700 text-xs">
            <span className="text-cyan-300 font-mono font-bold">{current?.temperature}°C</span>
            <span className="text-slate-400">{current?.conditionText}</span>
            {airQuality && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: airQuality.badgeBg, color: airQuality.color }}>
                AQI {airQuality.aqi}
              </span>
            )}
          </div>
        </div>

        {/* Right: Audio Toggle, Map View Toggles & Radar Slider */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Sound Toggle Button (Atmospheric Audio) */}
          <button
            onClick={toggleSound}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all shadow-xl flex items-center gap-1.5 ${
              isSoundActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                : 'bg-[#070d1e]/90 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Live Weather Sound & Radar Sonar"
          >
            {isSoundActive ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSoundActive ? 'Audio ON' : 'Audio OFF'}</span>
          </button>

          {/* Radar Scrubber */}
          <div className="bg-[#070d1e]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-2xl">
            <button
              onClick={() => {
                weatherSound.playClickTick();
                setIsRadarPlaying(!isRadarPlaying);
              }}
              className="text-xs font-bold px-2 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40"
            >
              {isRadarPlaying ? 'Pause Radar' : 'Play Radar'}
            </button>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {[0, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    weatherSound.playClickTick();
                    setRadarTimeOffset(mins);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    radarTimeOffset === mins
                      ? 'bg-cyan-400 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  +{mins}m
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={toggle3D}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all shadow-xl flex items-center gap-1.5 ${
              is3DMode
                ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                : 'bg-[#070d1e]/90 text-slate-300 border-slate-700 hover:border-cyan-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 3D Buildings
          </button>
        </div>
      </div>

      {/* Main Map Container (Using Clean Esri Dark Tiles without 'API Key Required' Text) */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />
        <canvas
          ref={canvasOverlayRef}
          className="absolute inset-0 pointer-events-none z-10"
        />
      </div>

      {/* WORKABLE MAP GRAPH: Elevation vs Water Depth Cross-Section Scrubber (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto hidden md:flex flex-col bg-[#070d1e]/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-3 shadow-[0_0_25px_rgba(0,240,255,0.25)] w-[580px]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-cyan-400" /> Workable Topography & Flood Depth Graph
          </span>
          <span className="text-[10px] text-cyan-300 font-mono">
            Click hotspot bar to Fly & Inspect
          </span>
        </div>

        {/* Clickable Cross-Section Bar Graph */}
        <div className="grid grid-cols-5 gap-2 items-end h-20 pt-2 border-t border-slate-800">
          {floodHotspots.map((h, i) => {
            const isTarget = selectedHotspot?.id === h.id || activeGraphPoint === i;
            return (
              <div
                key={h.id}
                onClick={() => flyToHotspot(h)}
                onMouseEnter={() => {
                  weatherSound.playClickTick();
                  setActiveGraphPoint(i);
                }}
                className={`flex flex-col items-center justify-end h-full p-1 rounded-xl cursor-pointer transition-all ${
                  isTarget
                    ? 'bg-cyan-500/20 border border-cyan-400 shadow-[0_0_12px_#00f0ff]'
                    : 'hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div
                  className={`w-3.5 rounded-t transition-all ${
                    h.riskLevel === 'red'
                      ? 'bg-rose-500 shadow-[0_0_10px_#ef4444]'
                      : h.riskLevel === 'orange'
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-emerald-400'
                  }`}
                  style={{
                    height: `${Math.max(12, Math.min(50, (h.waterDepthCm / 45) * 50))}px`,
                  }}
                />
                <span className="text-[10px] font-mono font-bold text-white mt-1">
                  {h.waterDepthCm}cm
                </span>
                <span className="text-[9px] text-slate-400 truncate w-20 text-center">
                  ~{h.elevationMeters}m elev
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Layer Controls Bar (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto bg-[#070d1e]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl max-w-sm w-full">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Layers className="w-4 h-4" /> Toggle Map Layers
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { key: 'rainfall', label: '1. Rainfall Radar', icon: CloudRain, active: activeLayers.rainfall },
            { key: 'rainMovement', label: '2. Rain Movement', icon: Wind, active: activeLayers.rainMovement },
            { key: 'floodRisk', label: '3. Flood Risk Zones', icon: AlertTriangle, active: activeLayers.floodRisk },
            { key: 'waterlogging', label: '4. Waterlogging Reports', icon: DropletsIcon, active: activeLayers.waterlogging },
            { key: 'safeRoute', label: '5. Safe Route Layer', icon: Navigation, active: activeLayers.safeRoute },
            { key: 'temperature', label: '6. Thermal / Heatwave', icon: Flame, active: activeLayers.temperature },
            { key: 'wind', label: '7. Wind Vectors', icon: Compass, active: activeLayers.wind },
            { key: 'airQuality', label: '8. Air Quality Smoke', icon: Activity, active: activeLayers.airQuality },
          ].map((l) => {
            const Icon = l.icon;
            return (
              <button
                key={l.key}
                onClick={() => {
                  weatherSound.playClickTick();
                  toggleLayer(l.key as any);
                }}
                className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                  l.active
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-[#0c152e]/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-[11px] font-medium">{l.label}</span>
                </div>
                {l.active ? (
                  <Eye className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                ) : (
                  <EyeOff className="w-3 h-3 text-slate-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Map Navigation Tools (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="p-3 rounded-xl bg-[#070d1e]/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 shadow-xl"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-3 rounded-xl bg-[#070d1e]/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 shadow-xl"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={resetNorth}
          className="p-3 rounded-xl bg-[#070d1e]/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 shadow-xl"
          title="Reset Bearing"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Hotspot Inspection Popup Modal */}
      {selectedHotspot && (
        <div className="absolute top-20 right-6 z-30 pointer-events-auto w-80 bg-[#091126] border border-cyan-500/40 rounded-2xl p-4 shadow-2xl animate-fade-in text-xs font-sans">
          <div className="flex items-start justify-between">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                selectedHotspot.riskLevel === 'red'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {selectedHotspot.riskLabel} ({selectedHotspot.type})
            </span>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-bold text-white mt-2">{selectedHotspot.name}</h4>
          <p className="text-slate-400 mt-1">{selectedHotspot.notes}</p>

          <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-xl bg-[#070d1e] border border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400">Water Depth:</span>
              <strong className="block text-cyan-300 font-mono">{selectedHotspot.waterDepthCm} cm</strong>
            </div>
            <div>
              <span className="text-slate-400">Drainage Status:</span>
              <strong className="block text-slate-200">{selectedHotspot.drainageCapacity}</strong>
            </div>
            <div>
              <span className="text-slate-400">Elevation:</span>
              <strong className="block text-slate-200 font-mono">~{selectedHotspot.elevationMeters}m</strong>
            </div>
            <div>
              <span className="text-slate-400">Historical Events:</span>
              <strong className="block text-slate-200">{selectedHotspot.historicalEventsCount} times</strong>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            <strong>Affected Corridors:</strong>
            <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-300">
              {selectedHotspot.affectedRoads.map((road, i) => (
                <li key={i}>{road}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

function DropletsIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className || 'w-4 h-4'}
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M17 20.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S17.29 10.75 17 9.3c-.29 1.45-1.14 2.84-2.29 3.76S13 15.1 13 16.25c0 2.22 1.8 4.05 4 4.05z" />
    </svg>
  );
}

function generateCityBuildingsGeoJson(lat: number, lon: number): any {
  const features: any[] = [];
  const count = 48;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist = 0.003 + (i % 6) * 0.0025;
    const bLat = lat + Math.sin(angle) * dist;
    const bLon = lon + Math.cos(angle) * dist;
    const size = 0.0008 + (i % 3) * 0.0004;

    const height = 15 + (i * 7) % 110;

    features.push({
      type: 'Feature' as const,
      properties: {
        height,
        name: `Urban Block ${i + 1}`,
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [bLon - size, bLat - size],
            [bLon + size, bLat - size],
            [bLon + size, bLat + size],
            [bLon - size, bLat + size],
            [bLon - size, bLat - size],
          ],
        ],
      },
    });
  }

  return {
    type: 'FeatureCollection' as const,
    features,
  };
}

function generateMockRoutesGeoJson(lat: number, lon: number): any {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          type: 'safe',
          color: '#00f0ff',
          width: 5,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [lon, lat],
            [lon + 0.006, lat + 0.004],
            [lon + 0.012, lat + 0.011],
            [lon + 0.018, lat + 0.016],
          ],
        },
      },
      {
        type: 'Feature' as const,
        properties: {
          type: 'risky',
          color: '#ef4444',
          width: 4,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [lon, lat],
            [lon + 0.004, lat - 0.004],
            [lon + 0.009, lat - 0.008],
            [lon + 0.018, lat + 0.016],
          ],
        },
      },
    ],
  };
}
