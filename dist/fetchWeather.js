import 'dotenv/config';
import fetch from 'node-fetch';
;
;
;
;
;
;
;
;
const API_KEY = "081d5769835e0277d80d7efa7aca13c6";
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
export function fetchWeatherData(city) {
    return fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        return response.json();
    })
        .then((data) => {
        const formatTime = (timestamp) => {
            return new Date(timestamp * 1000).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };
        return {
            cityName: data.name,
            temperature: Math.round(data.main.temp),
            weatherDescription: data.weather[0].description,
            weatherId: data.weather[0].id,
            sunrise: formatTime(data.sys.sunrise),
            sunset: formatTime(data.sys.sunset),
        };
    })
        .catch((error) => {
        console.error('Error fetching weather data:', error);
        throw error;
    });
}
;
export function fetchForecastData(city) {
    return fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Forecast data fetch failed');
        }
        return response.json();
    })
        .then((data) => {
        // Get one forecast per day for the next 4 days
        const processedForecasts = new Map();
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            // Only store the first forecast we see for each day
            if (!processedForecasts.has(date)) {
                processedForecasts.set(date, {
                    date,
                    temperature: Math.round(item.main.temp),
                    weatherDescription: item.weather[0].description,
                    weatherId: item.weather[0].id,
                });
            }
        });
        // Convert Map to Array and take first 4 days
        return Array.from(processedForecasts.values()).slice(0, 4);
    })
        .catch((error) => {
        console.error('Error fetching forecast data:', error);
        throw error;
    });
}
;
