# CLOMAX — Hyperlocal Weather Intelligence & Urban Safety Platform

> **"See the Weather Before It Happens."**  
> *Know Your Weather. Plan Your World.*

CLOMAX is an AI-powered hyperlocal weather intelligence platform combining real-time Doppler radar nowcasting, 3D city topography, flood-risk avoidance routing, heatwave defense, air quality monitoring, and citizen hazard reporting.

---

## 🌟 Key Capabilities & Features

### 1. Main Dashboard & Air Quality Index (AQI)
- **Live Air Quality Index**: Area-level US AQI score with real-time pollutant readings (PM2.5, PM10, NO2, Ozone, CO), color-coded radial gauge, sensitive-group alerts, and N95 mask advisories.
- **Station Metrics**: Real-time temperature (°C/°F), humidity, wind vector, precipitation rate, sunrise, sunset, and elevation.
- **"YOUR AREA — WEATHER INTELLIGENCE"**:
  - Exact rain countdown in minutes & estimated duration
  - Urban runoff & flood risk level for saucer underpasses
  - Recommended outdoor activity windows
  - Sector-by-sector radar tracking within a 5 km radius
- **Workable 24-Hour Graph**: Clickable hourly scrubber inspecting temperature, precipitation, wind, and flood stress.

### 2. All-Seasons Urban Intelligence (365-Day Safety)
Intelligent adaptation across all 4 seasons:
- **Monsoon & Flash-Flood Season**: Waterlogging underpass risk, soil capillary saturation index, municipal pumping station telemetry.
- **Summer Heatwave & Thermal Crisis**: Wet-Bulb Globe Temp (WBGT), asphalt surface temperature (>54°C warnings), extreme UV index, and hydration checkpoints.
- **Winter Fog, Smog & Cold Wave**: Highway visibility corridor (<70m alerts), thermal inversion caps trapping surface pollutants, black ice warnings on flyovers.
- **Cyclone & Severe Storms**: Cloud-to-ground lightning frequency, squall microbursts (>65 km/h), hailstorm damage tracker.

### 3. CLOMAX Live 3D Map with Workable Topography Graph & Lights Boom
- **Workable Map Graph**: Interactive Elevation vs Water Depth cross-section graph at the bottom of the map. Clicking any hotspot automatically flies the 3D camera to inspect that exact intersection!
- **Lights Boom Visual Effects**: Pulsating neon halo beacons, glowing flood warnings, dynamic radial radar sweep beam, and real-time precipitation vectors.
- **Toggleable Geographic Layers**:
  1. Rainfall Radar
  2. Rain Movement Vectors
  3. Flood Risk Zones
  4. Waterlogging Reports
  5. Safe Route Layer
  6. Thermal / Heatwave Dome
  7. Wind Vectors
  8. Air Quality Smoke Dispersion

### 4. Safe Route AI
- Urban routing engine for **Cars**, **Two-Wheelers**, and **Pedestrians**.
- Calculates detours around submerged underpasses, stalled roads, and flash puddles with safety scores (0 - 100).

### 5. Community Hazards & Heatwave Feed
- Live crowdsourced citizen reports with photo uploads, credibility scoring, and peer verification:
  - **Waterlogging** (with standing water depth in inches & cm)
  - **Heatwave Danger Zones** (with recorded ambient heat degrees & asphalt melting warnings)
  - **Cooling / Mist Shelters** (free cold hydration points and air-conditioned transit rest areas)
  - **Road Blocks & Submerged Potholes**

### 6. Rain Prediction Engine
- High-resolution nowcasting for: **Now**, **Next 15m**, **Next 30m**, **Next 60m**, **Next 120m**, **Hourly (24h)**, and **7-Day Outlook**.
- Spatial resolution transparency: Downscaled from ECMWF IFS and Doppler radar interpolation (1.1 km grid resolution).

### 7. Daily Life Assistant
- Context-aware AI assistant answering practical everyday queries:
  - *Can I go to work now?*
  - *Can I dry clothes on my terrace?*
  - *Should I carry an umbrella?*
  - *Is it suitable for children to play outside?*

### 8. Weather Simulator & Forecast History
- Scenario-based hydraulic model for testing Light (5 mm/h), Moderate (25 mm/h), Heavy (60 mm/h), and Cloudburst (120 mm/h) rainfall with drainage blockage sliders.
- Historical monsoon records, alert sensitivity thresholds, and custom API key configuration.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **3D Mapping**: MapLibre GL JS (3D building extrusions, vector pitch & tilt), Canvas Radar Engine, Google Maps Platform compatibility
- **Weather & Environmental Services**: Open-Meteo High-Resolution Numerical Model (ECMWF IFS / GFS downscaled), Open-Meteo Air Quality API, Nominatim Geocoding
- **Routing**: OSRM (Open Source Routing Machine) with flood-risk contour intersection analysis

---

## 🚀 Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. Build for production:
   ```bash
   npm run build
   ```
