import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Crosshair,
  Bell,
  Clock,
  Radio,
  Sliders,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { searchLocations, POPULAR_CITIES } from '../../services/weatherApi';
import { GeoLocation } from '../../types/weather';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenSettings }) => {
  const {
    location,
    setLocation,
    current,
    isRealApi,
    locateUserGPS,
    isLocating,
    notifications,
    setActiveTab,
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle location search with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(POPULAR_CITIES);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results.length > 0 ? results : POPULAR_CITIES);
      setIsSearching(false);
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#070d1e]/90 backdrop-blur-xl border-b border-cyan-500/15 transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => setActiveTab('map')}
          className="flex items-center gap-3.5 min-w-max cursor-pointer group"
          title="Open Live 3D Map"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-violet-600/30 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,240,255,0.25)] group-hover:border-cyan-300 transition-all">
            {/* Spinning Radar Icon */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="w-full h-full border border-cyan-400/20 rounded-full animate-ping opacity-25" />
            </div>
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full ring-2 ring-[#070d1e] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 font-display">
                CLOMAX
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Hyperlocal AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-tight">
              See the Weather Before It Happens.
            </p>
          </div>
        </div>

        {/* Search Location Bar with Geolocation */}
        <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400/70 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search city, neighborhood or district..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-10 pr-24 py-2 text-sm bg-[#0c152e]/80 border border-slate-700/70 hover:border-cyan-500/50 focus:border-cyan-400 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
            />
            {/* Current GPS Button */}
            <button
              onClick={locateUserGPS}
              disabled={isLocating}
              title="Detect Current GPS Location"
              className="absolute right-1.5 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Area'}</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#091126] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl">
              <div className="p-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">
                  {searchQuery.trim() ? 'Matching Locations' : 'Quick Jump Cities'}
                </span>
                {isSearching && <span className="text-cyan-400 animate-pulse text-[11px]">Searching radar...</span>}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {searchResults.map((loc, idx) => (
                  <button
                    key={`${loc.name}-${loc.lat}-${idx}`}
                    onClick={() => {
                      setLocation(loc);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-cyan-950/40 hover:border-l-4 hover:border-cyan-400 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Active Location & Live Metrics Widget */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0c152e]/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                {location.name}
                <span className="text-[10px] text-cyan-400 font-normal">({location.country_code || 'GPS'})</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400/80" />
                {currentTime || 'Syncing...'}
              </div>
            </div>
          </div>

          {current && (
            <div className="pl-3 border-l border-slate-700/60 flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-base font-extrabold text-cyan-300 font-mono">
                  {current.temperature}°C
                </div>
                <div className="text-[10px] text-slate-400">
                  {current.conditionText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges & Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Real API Status Badge */}
          <div
            title={isRealApi ? 'Connected to live Open-Meteo & Radar API' : 'Calibrated simulation mode'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Live Radar Sync</span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-cyan-300 bg-[#0c152e] hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all"
            title="Weather Alerts & Warnings"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-cyan-300 bg-[#0c152e] hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all"
            title="Settings & System Configuration"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
