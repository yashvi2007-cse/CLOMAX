import React, { useState } from 'react';
import { X, Camera, AlertTriangle, Send, MapPin, Droplets, CheckCircle, Flame, Sun, ShieldCheck } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({ isOpen, onClose }) => {
  const { location, addCommunityReport } = useWeather();

  const [reportType, setReportType] = useState<'waterlogging' | 'heavy_rain' | 'blocked_road' | 'pothole' | 'heatwave' | 'heat_shelter'>('waterlogging');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'critical'>('moderate');
  const [address, setAddress] = useState(`${location.name} Sector Main Rd`);
  const [depthInches, setDepthInches] = useState(8);
  const [temperatureC, setTemperatureC] = useState(42);
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addCommunityReport({
        lat: location.lat + (Math.random() - 0.5) * 0.015,
        lon: location.lon + (Math.random() - 0.5) * 0.015,
        address: address.trim() || `${location.name} Local Street`,
        type: reportType,
        severity,
        waterDepthInches: reportType === 'waterlogging' ? depthInches : undefined,
        temperatureC: reportType === 'heatwave' || reportType === 'heat_shelter' ? temperatureC : undefined,
        description: description.trim() || `Verified ${reportType.replace('_', ' ')} incident reported by citizen.`,
        reportedBy: 'You (Citizen Scout)',
        photoUrl: photoPreview || undefined,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#091126] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Report Weather Hazard</h3>
              <p className="text-xs text-slate-400">Crowdsource waterlogging, road blocks & heatwaves</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Report Broadcasted</h4>
            <p className="text-xs text-slate-300">
              Your report is now live on the CLOMAX Community Feed and Map.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
            {/* Hazard Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Hazard Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'waterlogging', label: 'Waterlogging' },
                  { id: 'heatwave', label: 'Heatwave Danger' },
                  { id: 'heat_shelter', label: 'Cooling / Mist Shelter' },
                  { id: 'heavy_rain', label: 'Torrential Rain' },
                  { id: 'blocked_road', label: 'Blocked Road' },
                  { id: 'pothole', label: 'Submerged Pothole' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setReportType(t.id as any)}
                    className={`py-2 px-2.5 rounded-xl font-medium text-xs border text-center transition-all ${
                      reportType === t.id
                        ? t.id === 'heatwave'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-400'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-[#0c152e] text-slate-400 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low', color: 'border-emerald-500/50 text-emerald-300' },
                  { id: 'moderate', label: 'Moderate', color: 'border-amber-500/50 text-amber-300' },
                  { id: 'critical', label: 'Critical', color: 'border-rose-500/50 text-rose-300' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeverity(s.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      severity === s.id
                        ? `bg-slate-800 ${s.color} ring-1 ring-cyan-400`
                        : 'bg-[#0c152e] text-slate-400 border-slate-700/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Street / Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Affected Street / Intersection
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 5th Cross Underpass, Ring Road Junction"
                className="w-full px-3.5 py-2 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-200 placeholder-slate-400 text-xs focus:outline-none"
              />
            </div>

            {/* Water Depth Slider (if waterlogging) */}
            {reportType === 'waterlogging' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Standing Water Depth
                  </label>
                  <span className="font-mono text-cyan-300 font-bold text-xs">
                    {depthInches} inches ({Math.round(depthInches * 2.54)} cm)
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="36"
                  value={depthInches}
                  onChange={(e) => setDepthInches(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}

            {/* Heatwave Temperature Slider */}
            {(reportType === 'heatwave' || reportType === 'heat_shelter') && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Recorded Ambient Temperature
                  </label>
                  <span className="font-mono text-orange-300 font-bold text-xs">
                    {temperatureC}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="52"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-400"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Details & Safety Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Are vehicles stalling? Is there free hydration? Asphalt softening?"
                className="w-full px-3.5 py-2 bg-[#0c152e] border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-200 placeholder-slate-400 text-xs focus:outline-none resize-none"
              />
            </div>

            {/* Photo Upload simulation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" /> Evidence Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photoPreview ? (
                  <span className="text-[11px] text-emerald-400 font-medium">Photo attached</span>
                ) : (
                  <span className="text-[11px] text-slate-400">JPG, PNG supported</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Verifying & Broadcasting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
