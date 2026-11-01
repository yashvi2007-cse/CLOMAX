import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  ThumbsUp,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  Plus,
  Filter,
  Eye,
  Droplets,
  Flame,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

interface CommunityReportsViewProps {
  onOpenReportModal: () => void;
}

export const CommunityReportsView: React.FC<CommunityReportsViewProps> = ({ onOpenReportModal }) => {
  const { location, communityReports, upvoteReport, setActiveTab } = useWeather();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = communityReports.filter((rep) => {
    if (filterType !== 'all' && rep.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner with Heatwave Alert Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0c152e] via-[#091126] to-[#070d1e] border border-cyan-500/25 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Crowdsourced Urban Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Community Weather, Flood & Heatwave Feed
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time citizen alerts for {location.name}: waterlogging underpasses, submerged potholes, heatwave zones, and mist cooling shelters.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-5 py-3 rounded-2xl text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Report Hazard / Heatwave
        </button>
      </div>

      {/* Filter Chips Bar with Heatwave & Shelter options */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Reports' },
          { id: 'heatwave', label: 'Heatwave Hotspots', icon: Flame },
          { id: 'heat_shelter', label: 'Cooling Shelters', icon: Sun },
          { id: 'waterlogging', label: 'Waterlogging', icon: Droplets },
          { id: 'blocked_road', label: 'Road Blocks' },
          { id: 'pothole', label: 'Potholes' },
          { id: 'heavy_rain', label: 'Cloudburst Rain' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === f.id
                  ? f.id === 'heatwave'
                    ? 'bg-orange-500 text-black font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                    : 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-[#0c152e] text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Reports Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((rep) => {
          const isHeat = rep.type === 'heatwave';
          const isShelter = rep.type === 'heat_shelter';

          return (
            <div
              key={rep.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                isHeat
                  ? 'bg-gradient-to-b from-[#180e0c] to-[#091126] border-orange-500/30 hover:border-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                  : isShelter
                  ? 'bg-gradient-to-b from-[#0c1815] to-[#091126] border-emerald-500/30 hover:border-emerald-400/60'
                  : 'bg-[#091126] border-cyan-500/20 hover:border-cyan-400/50'
              }`}
            >
              <div>
                {/* Top Row: Type & Verification Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isHeat
                        ? 'bg-orange-950/80 text-orange-300 border border-orange-500/40'
                        : isShelter
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {isHeat && <Flame className="w-3 h-3 text-orange-400" />}
                    {isShelter && <Sun className="w-3 h-3 text-emerald-400" />}
                    {rep.type.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      rep.status === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {rep.status === 'verified' ? 'Peer Verified' : 'Unverified Submission'}
                  </span>
                </div>

                {/* Address & Timestamp */}
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{rep.address}</span>
                </h4>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" /> {rep.timestamp} by {rep.reportedBy}
                </div>

                {/* Photo preview if available */}
                {rep.photoUrl && (
                  <div className="my-3 rounded-2xl overflow-hidden border border-slate-800 h-36 bg-slate-900 relative">
                    <img
                      src={rep.photoUrl}
                      alt="Hazard verification"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-slate-300 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Citizen Photo Attached
                    </div>
                  </div>
                )}

                {/* Metric Box (Water Depth or Temperature) */}
                {rep.waterDepthInches && (
                  <div className="my-2 p-2 rounded-xl bg-[#0c152e] border border-slate-800 text-xs flex items-center justify-between font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Depth:
                    </span>
                    <strong className="text-cyan-300 font-bold">
                      {rep.waterDepthInches} inches ({Math.round(rep.waterDepthInches * 2.54)} cm)
                    </strong>
                  </div>
                )}

                {rep.temperatureC && (
                  <div className="my-2 p-2 rounded-xl bg-[#1a0e08] border border-orange-500/30 text-xs flex items-center justify-between font-mono">
                    <span className="text-orange-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" /> Recorded Surface Heat:
                    </span>
                    <strong className="text-orange-400 font-black text-sm">
                      {rep.temperatureC}°C
                    </strong>
                  </div>
                )}

                {/* Description text */}
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              {/* Bottom Row: Credibility Score & Upvote Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Credibility Score
                  </span>
                  <span className="font-mono text-cyan-300 font-bold text-sm">
                    {rep.credibilityScore}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('map')}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    title="View on Map"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => upvoteReport(rep.id)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                    title="Corroborate this report"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Upvote ({rep.upvotes})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
