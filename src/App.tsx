import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { HomeDashboard } from './components/pages/HomeDashboard';
import { LiveMap3D } from './components/pages/LiveMap3D';
import { RainIntelligence } from './components/pages/RainIntelligence';
import { FloodVision } from './components/pages/FloodVision';
import { SafeRouteAI } from './components/pages/SafeRouteAI';
import { DailyLifeAssistant } from './components/pages/DailyLifeAssistant';
import { CommunityReportsView } from './components/pages/CommunityReportsView';
import { WeatherSimulator } from './components/pages/WeatherSimulator';
import { ForecastHistoryAndSettings } from './components/pages/ForecastHistoryAndSettings';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { SubmitReportModal } from './components/modals/SubmitReportModal';
import { Sparkles, Radio, ShieldCheck, Activity } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, location, airQuality } = useWeather();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard onOpenReportModal={() => setIsReportModalOpen(true)} />;
      case 'map':
        return <LiveMap3D />;
      case 'rain':
        return <RainIntelligence />;
      case 'flood':
        return <FloodVision />;
      case 'route':
        return <SafeRouteAI />;
      case 'community':
        return <CommunityReportsView onOpenReportModal={() => setIsReportModalOpen(true)} />;
      case 'assistant':
        return <DailyLifeAssistant />;
      case 'simulator':
        return <WeatherSimulator />;
      case 'history':
        return <ForecastHistoryAndSettings />;
      default:
        return <HomeDashboard onOpenReportModal={() => setIsReportModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Main Navigation Header */}
      <Header
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Navigation Tabs (VendorCast removed, Heatwave & AQI added) */}
      <Navigation />

      {/* Main View Area */}
      <main className="flex-1 w-full">{renderActiveView()}</main>

      {/* Modals & Slide-over Drawers */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SubmitReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Futuristic Footer */}
      <footer className="border-t border-cyan-500/10 bg-[#060b1b] py-6 px-4 text-xs text-slate-400">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-extrabold text-white tracking-wider">CLOMAX</span>
            <span>— Hyperlocal Weather Intelligence, Flood Safety & Heatwave Defense.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Station: {location.name}</span>
            <span>•</span>
            {airQuality && (
              <span className="flex items-center gap-1 font-mono font-bold" style={{ color: airQuality.color }}>
                <Activity className="w-3.5 h-3.5" /> AQI: {airQuality.aqi} ({airQuality.label})
              </span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Multi-Hazard Urban Grid Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}

export default App;
