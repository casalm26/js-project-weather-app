import { fetchWeatherData, fetchForecastData } from './fetchWeather';
// Function to get DOM elements by ID
const getElement = (id) => document.getElementById(id);
// DOM ELEMENTS
const elements = {
    weatherContainer: getElement("weather-container"),
};
const createWeatherCard = (data) => {
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
