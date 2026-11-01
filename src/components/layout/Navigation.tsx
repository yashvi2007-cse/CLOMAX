import React from 'react';
import {
  LayoutDashboard,
  Map,
  CloudRain,
  Waves,
  Navigation as NavigationIcon,
  Bot,
  Flame,
  Users,
  Cpu,
  History,
  Activity,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, hyperlocal, airQuality } = useWeather();

  const navItems: NavItem[] = [
    { id: 'map', label: 'Live 3D Map', shortLabel: '3D Map', icon: Map, badge: 'Live 3D' },
    { id: 'home', label: 'Main Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'rain',
      label: 'Rain Engine',
      shortLabel: 'Rain',
      icon: CloudRain,
      badge: hyperlocal?.rainExpectedNextMins !== null && hyperlocal?.rainExpectedNextMins !== undefined && hyperlocal.rainExpectedNextMins <= 45 ? 'RAIN' : undefined,
    },
    { id: 'flood', label: 'FloodVision', shortLabel: 'Flood', icon: Waves },
    { id: 'route', label: 'Safe Route AI', shortLabel: 'Routes', icon: NavigationIcon, badge: 'Anti-Flood' },
    { id: 'community', label: 'Hazards & Heatwave', shortLabel: 'Hazards', icon: Flame, badge: 'Community' },
    { id: 'assistant', label: 'Life Assistant', shortLabel: 'AI', icon: Bot },
    { id: 'simulator', label: 'Simulator', shortLabel: 'Sim', icon: Cpu },
    { id: 'history', label: 'Settings', shortLabel: 'Config', icon: History },
  ];

  return (
    <nav className="bg-[#060b1b]/95 border-b border-cyan-500/15 sticky top-[61px] z-30 overflow-x-auto no-scrollbar backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-600/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'
                  }`}
                />
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.shortLabel}</span>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.badge === 'RAIN'
                        ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_8px_#ef4444]'
                        : item.badge === '3D Boom'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_#00f0ff]'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Live AQI quick chip on navigation bar */}
        {airQuality && (
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all"
            style={{
              backgroundColor: airQuality.badgeBg,
              borderColor: `${airQuality.color}55`,
              color: airQuality.color,
            }}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AQI {airQuality.aqi} • {airQuality.label}</span>
          </div>
        )}
      </div>
    </nav>
  );
};
