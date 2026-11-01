import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  CurrentWeather,
  DailyForecastItem,
  FloodZoneHotspot,
  GeoLocation,
  HourlyForecastItem,
  HyperlocalIntelligence,
  MinutelyForecastItem,
  CommunityReport,
  WeatherNotification,
  AirQualityData,
  SeasonProfile,
  SeasonCategory,
} from '../types/weather';
import {
  DEFAULT_LOCATION,
  fetchWeatherDetails,
} from '../services/weatherApi';
import {
  getInitialCommunityReports,
  saveCommunityReports,
} from '../services/communityService';

export interface MapLayerState {
  rainfall: boolean;
  rainMovement: boolean;
  floodRisk: boolean;
  waterlogging: boolean;
  temperature: boolean;
  wind: boolean;
  safeRoute: boolean;
  airQuality: boolean;
  heatwave: boolean;
}

export interface UserSettings {
  tempUnit: 'C' | 'F';
  speedUnit: 'km/h' | 'mph';
  precipUnit: 'mm' | 'in';
  enableBrowserNotifications: boolean;
  rainAlertThresholdMins: number;
  floodAlertSensitivity: 'high' | 'medium' | 'low';
  googleMapsApiKey: string;
  weatherApiKey: string;
  mapStyle: '3d-dark' | 'satellite' | 'streets';
}

interface WeatherContextType {
  location: GeoLocation;
  setLocation: (loc: GeoLocation) => void;
  current: CurrentWeather | null;
  minutely: MinutelyForecastItem[];
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  hyperlocal: HyperlocalIntelligence | null;
  floodHotspots: FloodZoneHotspot[];
  airQuality: AirQualityData | null;
  seasons: Record<SeasonCategory, SeasonProfile> | null;
  selectedSeason: SeasonCategory;
  setSelectedSeason: (season: SeasonCategory) => void;
  isRealApi: boolean;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  activeLayers: MapLayerState;
  toggleLayer: (layer: keyof MapLayerState) => void;
  communityReports: CommunityReport[];
  addCommunityReport: (report: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'credibilityScore' | 'status'>) => void;
  upvoteReport: (reportId: string) => void;
  notifications: WeatherNotification[];
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  userSettings: UserSettings;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  locateUserGPS: () => void;
  isLocating: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<GeoLocation>(() => {
    const saved = localStorage.getItem('clomax_saved_location');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_LOCATION;
  });

  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [minutely, setMinutely] = useState<MinutelyForecastItem[]>([]);
  const [hourly, setHourly] = useState<HourlyForecastItem[]>([]);
  const [daily, setDaily] = useState<DailyForecastItem[]>([]);
  const [hyperlocal, setHyperlocal] = useState<HyperlocalIntelligence | null>(null);
  const [floodHotspots, setFloodHotspots] = useState<FloodZoneHotspot[]>([]);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [seasons, setSeasons] = useState<Record<SeasonCategory, SeasonProfile> | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<SeasonCategory>('monsoon');
  const [isRealApi, setIsRealApi] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [isLocating, setIsLocating] = useState(false);

  // Map layer controls
  const [activeLayers, setActiveLayers] = useState<MapLayerState>({
    rainfall: true,
    rainMovement: true,
    floodRisk: true,
    waterlogging: true,
    temperature: false,
    wind: false,
    safeRoute: true,
    airQuality: true,
    heatwave: false,
  });

  // Settings
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('clomax_user_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      tempUnit: 'C',
      speedUnit: 'km/h',
      precipUnit: 'mm',
      enableBrowserNotifications: true,
      rainAlertThresholdMins: 15,
      floodAlertSensitivity: 'high',
      googleMapsApiKey: '',
      weatherApiKey: '',
      mapStyle: '3d-dark',
    };
  });

  // Community Reports
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<WeatherNotification[]>([
    {
      id: 'notif-1',
      title: 'Rain in ~18m',
      message: 'Showers approaching your sector.',
      type: 'rain',
      timestamp: '2m ago',
      read: false,
      priority: 'high',
    },
    {
      id: 'notif-2',
      title: 'Underpass Waterlogging',
      message: 'Central Ave Underpass: 34cm water.',
      type: 'flood',
      timestamp: '14m ago',
      read: false,
      priority: 'high',
    },
    {
      id: 'notif-3',
      title: 'Heatwave Alert',
      message: 'Surface temperature peaking at 41°C. Hydration checkpoints open.',
      type: 'heatwave',
      timestamp: '25m ago',
      read: false,
      priority: 'high',
    },
    {
      id: 'notif-4',
      title: 'Air Quality Notice',
      message: 'Moderate particulate level (PM2.5: 28 µg/m³).',
      type: 'air_quality',
      timestamp: '1h ago',
      read: true,
      priority: 'medium',
    },
  ]);

  const setLocation = (loc: GeoLocation) => {
    setLocationState(loc);
    localStorage.setItem('clomax_saved_location', JSON.stringify(loc));
  };

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('clomax_user_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLayer = (layer: keyof MapLayerState) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const loadData = useCallback(async (loc: GeoLocation) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeatherDetails(loc);
      setCurrent(result.current);
      setMinutely(result.minutely);
      setHourly(result.hourly);
      setDaily(result.daily);
      setHyperlocal(result.hyperlocal);
      setFloodHotspots(result.floodHotspots);
      setAirQuality(result.airQuality);
      setSeasons(result.seasons);
      setIsRealApi(result.isRealApi);

      // Auto-detect season based on temperature and rain
      if (result.current.precipitation > 2) {
        setSelectedSeason('monsoon');
      } else if (result.current.temperature > 32) {
        setSelectedSeason('summer');
      } else if (result.current.temperature < 18) {
        setSelectedSeason('winter');
      }

      // Load community reports for this location
      const reports = getInitialCommunityReports(loc);
      setCommunityReports(reports);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError(err?.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(location);
  }, [location, loadData]);

  const refreshWeather = async () => {
    await loadData(location);
  };

  const locateUserGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.county ||
            'My Current Location';
          const country = data.address?.country || '';
          const admin1 = data.address?.state || '';

          setLocation({
            name: cityName,
            lat: Number(latitude.toFixed(4)),
            lon: Number(longitude.toFixed(4)),
            country,
            admin1,
          });
        } catch {
          setLocation({
            name: 'Local Sector',
            lat: Number(latitude.toFixed(4)),
            lon: Number(longitude.toFixed(4)),
            country: 'Current Area',
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or error:', err);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const addCommunityReport = (
    report: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'credibilityScore' | 'status'>
  ) => {
    const newRep: CommunityReport = {
      ...report,
      id: `user-rep-${Date.now()}`,
      timestamp: 'Just now',
      upvotes: 1,
      credibilityScore: 78,
      status: 'unverified',
    };
    const updated = [newRep, ...communityReports];
    setCommunityReports(updated);
    saveCommunityReports(location.name, updated);

    const newNotif: WeatherNotification = {
      id: `notif-${Date.now()}`,
      title: report.type === 'heatwave' ? 'Heatwave Danger Broadcasted' : 'Road Hazard Broadcasted',
      message: `${report.address}: ${report.description}`,
      type: report.type === 'heatwave' ? 'heatwave' : 'report',
      timestamp: 'Just now',
      read: false,
      priority: 'high',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const upvoteReport = (reportId: string) => {
    setCommunityReports((prev) => {
      const updated = prev.map((rep) => {
        if (rep.id === reportId) {
          const newVotes = rep.upvotes + 1;
          const newCredibility = Math.min(99, rep.credibilityScore + 3);
          const newStatus = newVotes >= 5 ? 'verified' as const : rep.status;
          return {
            ...rep,
            upvotes: newVotes,
            credibilityScore: newCredibility,
            status: newStatus,
          };
        }
        return rep;
      });
      saveCommunityReports(location.name, updated);
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
        current,
        minutely,
        hourly,
        daily,
        hyperlocal,
        floodHotspots,
        airQuality,
        seasons,
        selectedSeason,
        setSelectedSeason,
        isRealApi,
        loading,
        error,
        refreshWeather,
        activeLayers,
        toggleLayer,
        communityReports,
        addCommunityReport,
        upvoteReport,
        notifications,
        markNotificationRead,
        dismissNotification,
        userSettings,
        updateUserSettings,
        activeTab,
        setActiveTab,
        locateUserGPS,
        isLocating,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
