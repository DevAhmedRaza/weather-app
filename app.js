// app.js - Simple Weather App using Open-Meteo

const form = document.getElementById('searchForm');
const input = document.getElementById('cityInput');
const unitsSelect = document.getElementById('units');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const cityNameEl = document.getElementById('cityName');
const temperatureEl = document.getElementById('temperature');
const conditionsEl = document.getElementById('conditions');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const timeEl = document.getElementById('time');
const iconEl = document.getElementById('weatherIcon');

// Weather code -> emoji mapping (simple)
const weatherIcons = {
  0: '☀️',
  1: '☀️',
  2: '🌤️',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '❄️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
};

const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

function showStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.display = 'block';
  statusEl.classList.toggle('hidden', false);
  statusEl.style.background = isError ? '#ffe8e8' : '#fff3c4';
}

function hideStatus() {
  statusEl.classList.add('hidden');
}

function showResult() {
  resultEl.classList.remove('hidden');
}

function hideResult() {
  resultEl.classList.add('hidden');
}

async function lookupCity(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding API error');
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  return data.results[0];
}

async function fetchWeather(lat, lon, units = 'metric') {
  // Use Open-Meteo's current weather + hourly for humidity
  // We'll fetch current_weather and hourly relative humidity
  const windspeedUnit = units === 'imperial' ? 'mph' : 'kmh';
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,weathercode&timezone=auto&windspeed_unit=${windspeedUnit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API error');
  return await res.json();
}

function formatTemperature(celsius, units) {
  if (units === 'metric') return `${Math.round(celsius)}°C`;
  // convert to F
  const f = (celsius * 9/5) + 32;
  return `${Math.round(f)}°F`;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  hideResult();
  showStatus('Searching...');
  try {
    const city = await lookupCity(query);
    if (!city) {
      showStatus('City not found', true);
      return;
    }
    showStatus(`Fetching weather for ${city.name}, ${city.country}`);
    const units = unitsSelect.value; // metric or imperial
    const data = await fetchWeather(city.latitude, city.longitude, units);
    const current = data.current_weather;
      // humidity: try find from hourly for the current hour
      let humidity = '--';
      if (data.hourly && data.hourly.relativehumidity_2m && Array.isArray(data.hourly.time)) {
        const timeIndex = data.hourly.time.indexOf(current.time);
        if (timeIndex >= 0) humidity = data.hourly.relativehumidity_2m[timeIndex] + '%';
      }

    cityNameEl.textContent = `${city.name}, ${city.country}`;
    temperatureEl.textContent = formatTemperature(current.temperature, units);
    const windUnitLabel = units === 'imperial' ? 'mph' : 'km/h';
    conditionsEl.textContent = `Wind ${current.windspeed} ${windUnitLabel} | ${weatherDescriptions[current.weathercode] || '—'}`;
      windEl.textContent = `${current.windspeed} ${windUnitLabel}`;
    humidityEl.textContent = humidity;
    timeEl.textContent = new Date(current.time).toLocaleString();
    iconEl.textContent = weatherIcons[current.weathercode] || '🌤️';
    hideStatus();
    showResult();
  } catch (err) {
    console.error(err);
    showStatus('Error fetching weather: ' + err.message, true);
  }
});

// Default example display
(function init() {
  input.value = 'New York';
  unitsSelect.value = 'metric';
  // Run a default search on load
  form.dispatchEvent(new Event('submit'));
})();

// Geolocation support
const locBtn = document.getElementById('locBtn');
locBtn?.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    showStatus('Geolocation not supported by this browser', true);
    return;
  }
  showStatus('Getting your location...');
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const units = unitsSelect.value;
    try {
      const data = await fetchWeather(lat, lon, units);
      const current = data.current_weather;
      cityNameEl.textContent = `Your location`;
      temperatureEl.textContent = formatTemperature(current.temperature, units);
      const windUnitLabel = units === 'imperial' ? 'mph' : 'km/h';
      conditionsEl.textContent = `Wind ${current.windspeed} ${windUnitLabel} | ${weatherDescriptions[current.weathercode] || '—'}`;
      windEl.textContent = `${current.windspeed} ${windUnitLabel}`;
      // try resolve humidity from hourly dataset
      let humidity = '--';
      if (data.hourly && Array.isArray(data.hourly.time) && data.hourly.relativehumidity_2m) {
        const timeIndex = data.hourly.time.indexOf(current.time);
        if (timeIndex >= 0) humidity = data.hourly.relativehumidity_2m[timeIndex] + '%';
      }
      humidityEl.textContent = humidity;
      timeEl.textContent = new Date(current.time).toLocaleString();
      iconEl.textContent = weatherIcons[current.weathercode] || '🌤️';
      hideStatus();
      showResult();
    } catch (err) {
      showStatus('Error fetching weather: ' + err.message, true);
    }
  }, (err) => showStatus('Unable to get your location: ' + err.message, true));
});

