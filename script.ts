import "./forecast";  // Importera utan att exportera något
import { ProcessedWeatherData, ProcessedForecastData, fetchWeatherData, fetchForecastData } from './fetchWeather.js';

// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null => document.getElementById(id);

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container"),
  todaysWeatherContainer: getElement("todays-weather-container")
};

// INTERFACES
interface WeatherCardData {
  weather: ProcessedWeatherData;
  forecast: ProcessedForecastData[];
}

// ENUMS
enum WeatherState {
  Clear = "clear",
  Clouds = "clouds",
  Rain = "rain",
  Snow = "snow"
}

// GLOBAL VARIABLES
let today: Date = new Date()
let currentWeatherState: string = ""


// FUNCTIONS

const checkWeatherState = (filter: WeatherState): void => {
  if (filter === WeatherState.Clear) {
    currentWeatherState = WeatherState.Clear
  } else if (filter === WeatherState.Clouds) {
    currentWeatherState = WeatherState.Clouds
  } else if (filter === WeatherState.Rain) {
    currentWeatherState = WeatherState.Rain
  } else if (filter === WeatherState.Snow) {
    currentWeatherState = WeatherState.Snow
  }
};

/*const displayTodaysWeather = (today: Date, data: WeatherCardData) => {
  // Mapping to today is missing
  const { weather } = data
  elements.todaysWeatherContainer.innerHTML = `<p>${currentWeatherState} | ${weather.temperature}</p>
  <p>Sunrise: ${weather.sunrise}</p>
  <p>Sunset: ${weather.sunset}</p>`
};*/

/*const createWeatherCard = (data: WeatherCardData): string => {
  const { weather, forecast } = data;herCardData): string => {
  

// Return displayTodaysWeather, search, displayIcon, displayWeatherDescription and displayForecast
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
{lindas funktion}
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
*/

/*document.addEventListener('DOMContentLoaded', () => {
  updateWeatherDisplay('London');
});*/

