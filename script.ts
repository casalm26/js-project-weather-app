// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null => document.getElementById(id);

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container"),
};

import { ProcessedWeatherData, ProcessedForecastData, fetchWeatherData, fetchForecastData } from './fetchWeather.js';

interface WeatherCardData {
  weather: ProcessedWeatherData;
  forecast: ProcessedForecastData[];
}

// ENUMS
enum WeatherState {
  Clear = "clear",
  Sun = "sun", // What do we call this?
  Clouds = "clouds",
  Rain = "rain",
  Snow = "snow"
}

// GLOBAL VARIABLES
let today: Date = new Date()


// FUNCTIONS

const checkWeatherState = (filter: WeatherState): string => {
  let currentWeatherState: string = ""

  if (filter === WeatherState.Sun) {
    currentWeatherState = WeatherState.Sun
  } else if (filter === WeatherState.Clouds) {
    currentWeatherState = WeatherState.Clouds
  } else if (filter === WeatherState.Rain) {
    currentWeatherState = WeatherState.Rain
  } else if (filter === WeatherState.Snow) {
    currentWeatherState = WeatherState.Snow
  }
  return currentWeatherState
}

const displayTodaysWeather = (today: Date, currentWeatherState: string) => {
  // Print current weather in the weatherCard
  // WeatherState | WeatherState.State(temp)
  // Sunrise today.sunrise(time)
  // Sunset today.sunrise(time)
}

const createWeatherCard = (data: WeatherCardData): string => {
  const { weather, forecast } = data;
  
  return `
    <div id="weather-content" class="weather-card">
      <div id="today-info">
        <h2>${weather.cityName}</h2>
        <div class="current-weather">
          <img id="weather-icon" src="https://openweathermap.org/img/wn/${weather.weatherId}@2x.png" alt="${weather.weatherDescription}">
          <div id="weather-description">
            <p>${weather.temperature}°C</p>
            <p>${weather.weatherDescription}</p>
            <p>Sunrise: ${weather.sunrise}</p>
            <p>Sunset: ${weather.sunset}</p>
          </div>
        </div>
      </div>
      <div id="weather-forecast">
        <h3>4-Day Forecast</h3>
        <ul>
          ${forecast.map(day => `
            <li>
              <p>${day.date}</p>
              <img src="https://openweathermap.org/img/wn/${day.weatherId}@2x.png" alt="${day.weatherDescription}">
              <p>${day.temperature}°C</p>
              <p>${day.weatherDescription}</p>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
};

// Function to update the weather display
const updateWeatherDisplay = async (city: string): Promise<void> => {
  try {
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(city),
      fetchForecastData(city)
    ]);

    if (elements.weatherContainer) {
      elements.weatherContainer.innerHTML = createWeatherCard({
        weather: weatherData,
        forecast: forecastData
      });
    }
  } catch (error) {
    console.error('Error updating weather display:', error);
    if (elements.weatherContainer) {
      elements.weatherContainer.innerHTML = '<p>Error loading weather data. Please try again.</p>';
    }
  }
};

// Initialize weather display for a default city
document.addEventListener('DOMContentLoaded', () => {
  updateWeatherDisplay('London');
})
;