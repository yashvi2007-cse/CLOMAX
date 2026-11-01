import { CommunityReport, GeoLocation } from '../types/weather';

const STORAGE_KEY = 'clomax_community_reports';

export function getInitialCommunityReports(loc: GeoLocation): CommunityReport[] {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${loc.name}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed parsing stored reports', e);
    }
  }

  const baseLat = loc.lat;
  const baseLon = loc.lon;

  const defaults: CommunityReport[] = [
    {
      id: 'rep-heat-1',
      lat: baseLat + 0.006,
      lon: baseLon + 0.010,
      address: `Outer Ring Boulevard & Metro Plaza, ${loc.name}`,
      type: 'heatwave',
      severity: 'critical',
      temperatureC: 43.8,
      description: 'Severe heat island reflection off glass facade. Tarmac temperature estimated > 58°C. Pedestrians feeling dizzy; no shade for 600m.',
      reportedBy: 'Dr. Sameer V. (Health Volunteer)',
      timestamp: '8 minutes ago',
      upvotes: 42,
      credibilityScore: 98,
      status: 'verified',
      photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'rep-shelter-1',
      lat: baseLat - 0.003,
      lon: baseLon + 0.005,
      address: `Central Transit Hub - Concourse Shade, ${loc.name}`,
      type: 'heat_shelter',
      severity: 'low',
      temperatureC: 28.0,
      description: 'Municipal Cool-Zone active: Free cold electrolyte water, mist fans, and air-conditioned rest benches for outdoor commuters.',
      reportedBy: 'City Resiliency Volunteer',
      timestamp: '22 minutes ago',
      upvotes: 67,
      credibilityScore: 99,
      status: 'verified',
    },
    {
      id: 'rep-1',
      lat: baseLat - 0.012,
      lon: baseLon + 0.008,
      address: `Underpass at Sector 4, ${loc.name}`,
      type: 'waterlogging',
      severity: 'critical',
      waterDepthInches: 14,
      description: 'Underpass drainage pump failed. Sedans and hatchbacks are stalling. Only elevated trucks getting through.',
      reportedBy: 'Kunal M. (Verified Resident)',
      timestamp: '18 minutes ago',
      upvotes: 38,
      credibilityScore: 97,
      status: 'verified',
      photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'rep-2',
      lat: baseLat + 0.015,
      lon: baseLon - 0.014,
      address: `Canal Bund Link Road, ${loc.name}`,
      type: 'blocked_road',
      severity: 'critical',
      waterDepthInches: 22,
      description: 'Fallen tree branch blocking middle 2 lanes amid storm runoff. Police diversion placed.',
      reportedBy: 'Anita D. (Commuter)',
      timestamp: '32 minutes ago',
      upvotes: 24,
      credibilityScore: 91,
      status: 'verified',
      photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'rep-3',
      lat: baseLat + 0.004,
      lon: baseLon + 0.012,
      address: `Market Cross Road, ${loc.name}`,
      type: 'waterlogging',
      severity: 'moderate',
      waterDepthInches: 5,
      description: 'Slow curb ponding near vegetable stalls. Passable with slow crawling speeds.',
      reportedBy: 'Sanjay S.',
      timestamp: '47 minutes ago',
      upvotes: 12,
      credibilityScore: 82,
      status: 'verified',
    },
    {
      id: 'rep-4',
      lat: baseLat - 0.019,
      lon: baseLon - 0.009,
      address: `Tech Park Outer Service Road, ${loc.name}`,
      type: 'pothole',
      severity: 'moderate',
      waterDepthInches: 7,
      description: 'Submerged pothole near bus terminal exit causing two-wheeler skids.',
      reportedBy: 'Vikram R.',
      timestamp: '1 hour ago',
      upvotes: 19,
      credibilityScore: 88,
      status: 'verified',
    },
  ];

  localStorage.setItem(`${STORAGE_KEY}_${loc.name}`, JSON.stringify(defaults));
  return defaults;
}

export function saveCommunityReports(locName: string, reports: CommunityReport[]) {
  localStorage.setItem(`${STORAGE_KEY}_${locName}`, JSON.stringify(reports));
}
