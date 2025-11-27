# Simple Weather App

This is a simple weather web app built with HTML/CSS/JS that uses the Open-Meteo APIs (no API key required).

Features
- Search for a city; uses Open-Meteo geocoding API
- Fetch current weather (temperature, wind, humidity)
- Displays a simple icon and friendly output
- Toggle between Celsius and Fahrenheit

How to run
1. Open `index.html` in your browser directly (no server required for basic use).
2. Or serve locally with Python:

```powershell
cd "e:\VS CODES\weather"
python -m http.server 8080
# Open http://localhost:8080 in your browser
```

3. Or use an optional Node server (if you want):

```powershell
cd "e:\VS CODES\weather"
npm install
node server.js
# Open http://localhost:8080
```

Notes
- This app is intentionally lightweight and does not require an API key. The Open-Meteo geocoding and weather endpoints are used for city lookup and weather data.
 - Geolocation ("Use my location") requires HTTPS or localhost in many browsers; open the app via a local server (e.g., `http://localhost:8080`) to use geolocation.
- The app maps 'weathercode' to a few emoji icons; you can add a richer icon set later.

Enhancements you can request:
- Add forecast graph/5-day forecast
- Add location autofill using browser geolocation
- Add caching and history
- Add weather icons (SVG) and nicer animations

Enjoy! ☀️🌧️🌨️
