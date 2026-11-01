import React from 'react';
import { X, Bell, CloudRain, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, dismissNotification } = useWeather();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'flood':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'safe_window':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#080e22] border-l border-slate-800/80 h-full flex flex-col shadow-2xl">
        {/* Sleek Minimal Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">Alerts</h2>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No alerts.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  notif.read
                    ? 'bg-[#0a1228]/50 border-slate-800/60 text-slate-400'
                    : 'bg-[#0d1838] border-cyan-500/30 text-slate-200'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-900/80 mt-0.5 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-100 truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notif.id);
                  }}
                  className="text-slate-400 hover:text-rose-400 p-0.5 ml-1 transition-colors"
                  title="Dismiss"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sleek Minimal Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060b1b] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active
          </span>
          <button
            onClick={() => {
              if ('Notification' in window) {
                Notification.requestPermission();
              }
            }}
            className="text-cyan-400 hover:underline text-[11px]"
          >
            Push Sync
          </button>
        </div>
      </div>
    </div>
  );
};
