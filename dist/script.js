<<<<<<< HEAD
import "./forecast"; // Importera utan att exportera något
import { fetchWeatherData, fetchForecastData } from './fetchWeather.js';
=======
>>>>>>> origin/search-bar
// Function to get DOM elements by ID
const getElement = (id) => document.getElementById(id);
// DOM ELEMENTS
const elements = {
    weatherContainer: getElement("weather-container"),
    todaysWeatherContainer: getElement("todays-weather-container")
};
<<<<<<< HEAD
=======
import { fetchWeatherData, fetchForecastData } from './fetchWeather.js';
>>>>>>> origin/search-bar
// ENUMS
var WeatherState;
(function (WeatherState) {
    WeatherState["Clear"] = "clear";
    WeatherState["Sun"] = "sun";
    WeatherState["Clouds"] = "clouds";
    WeatherState["Rain"] = "rain";
    WeatherState["Snow"] = "snow";
})(WeatherState || (WeatherState = {}));
// GLOBAL VARIABLES
let today = new Date();
let currentWeatherState = "";
// FUNCTIONS
const checkWeatherState = (filter) => {
    if (filter === WeatherState.Sun) {
        currentWeatherState = WeatherState.Sun;
    }
    else if (filter === WeatherState.Clouds) {
        currentWeatherState = WeatherState.Clouds;
    }
    else if (filter === WeatherState.Rain) {
        currentWeatherState = WeatherState.Rain;
    }
    else if (filter === WeatherState.Snow) {
        currentWeatherState = WeatherState.Snow;
    }
    return currentWeatherState;
};
const createWeatherCard = (data) => {
    const { weather, forecast } = data;
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
// Function to update the weather display
const updateWeatherDisplay = async (city) => {
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
    }
    catch (error) {
        console.error('Error updating weather display:', error);
        if (elements.weatherContainer) {
            elements.weatherContainer.innerHTML = '<p>Error loading weather data. Please try again.</p>';
        }
    }
};
// Initialize weather display for a default city
document.addEventListener('DOMContentLoaded', () => {
    updateWeatherDisplay('London');
});
