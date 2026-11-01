import React, { useState } from 'react';
import { X, Key, ShieldCheck, Map, Cloud, Save, AlertCircle } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { userSettings, updateUserSettings } = useWeather();
  const [googleKey, setGoogleKey] = useState(userSettings.googleMapsApiKey || '');
  const [weatherKey, setWeatherKey] = useState(userSettings.weatherApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateUserSettings({
      googleMapsApiKey: googleKey.trim(),
      weatherApiKey: weatherKey.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#091126] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">API Configuration</h3>
              <p className="text-xs text-slate-400">Google Maps Platform & Weather Radar Keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm">
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              CLOMAX comes pre-integrated with real-time Open-Meteo Radar and OpenStreetMap 3D vector buildings. Adding your custom Google Maps API key unlocks optional Photorealistic 3D Tiles and Google Elevation API.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-2">
              <Map className="w-3.5 h-3.5 text-cyan-400" /> Google Maps JavaScript API Key (Optional)
            </label>
            <input
              type="text"
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-200 placeholder-slate-400 font-mono text-xs focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Supports Maps JavaScript API, 3D Buildings & Geocoding.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" /> Custom Weather API Key (Optional)
            </label>
            <input
              type="text"
              value={weatherKey}
              onChange={(e) => setWeatherKey(e.target.value)}
              placeholder="Custom OpenWeather / Tomorrow.io Key..."
              className="w-full px-3.5 py-2.5 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-200 placeholder-slate-400 font-mono text-xs focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to use the high-precision ECMWF/Open-Meteo default pipeline.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Credentials saved securely in local storage.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070d1e]/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
