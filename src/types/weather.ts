export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  country_code?: string;
  admin1?: string; // state or province
  elevation?: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number; // mm
  rain: number; // mm
  weatherCode: number;
  conditionText: string;
  windSpeed: number; // km/h
  windDirection: number; // deg
  surfacePressure: number; // hPa
  cloudCover: number; // %
  uvIndex?: number;
  visibility?: number; // km
  timestamp: string;
  isDay: boolean;
}

export interface AirQualityData {
  aqi: number; // US AQI (0 - 500)
  label: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  badgeBg: string;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  healthAdvisory: string;
  maskRecommended: boolean;
  sensitiveGroupAlert: boolean;
}

export type SeasonCategory = 'monsoon' | 'summer' | 'winter' | 'storm';

export interface SeasonProfile {
  activeSeason: SeasonCategory;
  seasonName: string;
  badge: string;
  themeColor: string;
  description: string;
  primaryMetric: {
    label: string;
    value: string;
    status: 'Safe' | 'Watch' | 'Warning' | 'Hazard';
  };
  metrics: Array<{
    label: string;
    value: string;
    subtext: string;
    severity: 'green' | 'amber' | 'red';
  }>;
  keySafetyAdvisory: string;
}

export interface MinutelyForecastItem {
  time: string;
  timestamp: number;
  precipitation: number; // mm/h
  probability: number; // %
  intensityLabel: 'None' | 'Light' | 'Moderate' | 'Heavy' | 'Torrential';
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  conditionText: string;
  windSpeed: number;
  humidity: number;
  floodRiskLevel: 'green' | 'orange' | 'red';
  heatIndex?: number;
  aqi?: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  conditionText: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  floodRiskLevel: 'green' | 'orange' | 'red';
  uvMax?: number;
}

export interface HyperlocalIntelligence {
  rainExpectedNextMins: number | null; // e.g. 18 (minutes) or null if dry next 2h
  rainExpectedSummary: string;
  rainfallDurationEstHours: number;
  rainIntensity: 'None' | 'Passing Sprinkles' | 'Light Rain' | 'Moderate Showers' | 'Heavy Downpour' | 'Torrential Storm';
  nearbyAreasAffected: Array<{
    name: string;
    distanceKm: number;
    intensity: string;
    startsInMins: number;
    status: 'Raining now' | 'Rain within 15m' | 'Rain within 45m' | 'Clear';
  }>;
  floodRiskAlert: {
    level: 'Low' | 'Moderate' | 'High' | 'Severe';
    color: 'green' | 'orange' | 'red' | 'purple';
    message: string;
    affectedStreets: string[];
  };
  recommendedOutdoorWindow: {
    isSuitableNow: boolean;
    windowStart: string;
    windowEnd: string;
    recommendation: string;
    idealActivities: string[];
    cautionNotes: string[];
  };
  spatialResolution: string; // e.g. "ECMWF & Radar Interpolated (1.1 km Grid Resolution)"
  forecastConfidence: number; // %
  lastUpdated: string;
}

export interface FloodZoneHotspot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  riskLevel: 'red' | 'orange' | 'green' | 'grey';
  riskLabel: 'High Risk' | 'Moderate Risk' | 'Lower Risk' | 'Insufficient Data';
  type: 'verified' | 'predicted' | 'user_reported';
  elevationMeters: number;
  drainageCapacity: 'Adequate' | 'Partially Blocked' | 'Severely Compromised' | 'Under Maintenance';
  waterDepthCm: number;
  affectedRoads: string[];
  historicalEventsCount: number;
  lastReportedTimestamp?: string;
  confidenceScore: number; // 0 - 100
  notes: string;
}

export interface CommunityReport {
  id: string;
  lat: number;
  lon: number;
  address: string;
  type: 'waterlogging' | 'heavy_rain' | 'blocked_road' | 'pothole' | 'heatwave' | 'heat_shelter';
  severity: 'low' | 'moderate' | 'critical';
  waterDepthInches?: number;
  temperatureC?: number;
  description: string;
  reportedBy: string;
  timestamp: string;
  upvotes: number;
  credibilityScore: number; // %
  status: 'verified' | 'unverified' | 'investigating';
  photoUrl?: string;
}

export interface SafeRouteOption {
  id: string;
  name: string;
  distanceKm: number;
  durationMins: number;
  safetyScore: number; // 0 - 100 (100 is safest)
  riskLevel: 'green' | 'orange' | 'red';
  waterloggedHotspotsCount: number;
  highRiskRoads: string[];
  recommended: boolean;
  coordinates: [number, number][]; // [lon, lat]
  elevationGainM: number;
  summaryReason: string;
}

export interface WeatherNotification {
  id: string;
  title: string;
  message: string;
  type: 'rain' | 'flood' | 'wind' | 'safe_window' | 'report' | 'heatwave' | 'air_quality';
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}
