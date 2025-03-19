//import "./forecast";  // Importera utan att exportera något
//import { ProcessedWeatherData, ProcessedForecastData, fetchWeatherData, fetchForecastData } from './fetchWeather.js';
// Function to get DOM elements by ID
const getElement = (id) => document.getElementById(id);
// DOM ELEMENTS
const elements = {
    weatherContainer: getElement("weather-container"),
    weatherContainerChild: getElement("weather-container-child"),
    todaysWeatherContainer: getElement("todays-weather-container"),
    iconTextContainer: getElement("iconText-container"),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    lastSearched: document.getElementById('last-searched'),
    searchStatus: document.getElementById('search-status'),
};
// ENUMS
var WeatherState;
(function (WeatherState) {
    WeatherState["Clear"] = "Clear";
    WeatherState["Clouds"] = "Clouds";
    WeatherState["Rain"] = "Rain";
    WeatherState["Snow"] = "Snow";
})(WeatherState || (WeatherState = {}));
;
;
;
;
;
;
;
;
// Use a hardcoded API key for now (you should move this to a secure configuration later)
const API_KEY = '081d5769835e0277d80d7efa7aca13c6'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
export function fetchWeatherData(city) {
    return fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then(response => {
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
        .catch(error => {
        console.error('Error fetching weather data:', error);
        throw error;
    });
}
;
export function fetchForecastData(city) {
    return fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        .then(response => {
        if (!response.ok) {
            throw new Error('Forecast data fetch failed');
        }
        return response.json();
    })
        .then((data) => {
        const processedForecasts = new Map();
        // Get today's and tomorrow's dates for comparison
        const today = new Date();
        const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toISOString().split("T")[0]; // YYYY-MM-DD
            // Ignore today's forecasts, start from tomorrow
            if (date > todayString && !processedForecasts.has(date)) {
                processedForecasts.set(date, {
                    date: date, // Store in ISO format (YYYY-MM-DD)
                    temperature: Math.round(item.main.temp),
                    weatherDescription: item.weather[0].description,
                    weatherId: item.weather[0].id,
                });
            }
        });
        return Array.from(processedForecasts.values()).slice(0, 4); // Ensure only 4 future days
    })
        .catch(error => {
        console.error('Error fetching forecast data:', error);
        throw error;
    });
}
;
// Define WeatherState as an Enum - Redan gjort i mindre skala, längre upp
/*enum WeatherState {
  Clear = 'Clear',
  Clouds = 'Clouds',
  Rain = 'Rain',
  Drizzle = 'Drizzle',
  Thunderstorm = 'Thunderstorm',
  Snow = 'Snow',
  Mist = 'Mist',
  Smoke = 'Smoke',
  Haze = 'Haze',
  Dust = 'Dust',
  Fog = 'Fog',
  Sand = 'Sand',
  Ash = 'Ash',
  Squall = 'Squall',
  Tornado = 'Tornado',
}*/
// GLOBAL VARIABLES
let today = new Date();
let weatherDescription = "";
// FUNCTIONS
const checkWeatherState = (filter) => {
    if (filter === WeatherState.Clear) {
        weatherDescription = WeatherState.Clear;
    }
    else if (filter === WeatherState.Clouds) {
        weatherDescription = WeatherState.Clouds;
    }
    else if (filter === WeatherState.Rain) {
        weatherDescription = WeatherState.Rain;
    }
    else if (filter === WeatherState.Snow) {
        weatherDescription = WeatherState.Snow;
    }
    return weatherDescription;
};
// handleErrorMessages
const displayTodaysWeather = (today, data) => {
    // Mapping to today is missing
    const { weather } = data;
    if (elements.todaysWeatherContainer == null) {
        //handleErrorMessages(error)
        return;
    }
    else {
        elements.todaysWeatherContainer.innerHTML = `<p>${weatherDescription} | ${weather.temperature}</p>
  <p>Sunrise: ${weather.sunrise}</p>
  <p>Sunset: ${weather.sunset}</p>`;
    }
};
//Bild och rolig text-funktion
// Define catchyTextTemplate using city from API as a placeholder
const catchyTextTemplate = {
    [WeatherState.Clear]: "Get your sunnies on. {city} is looking rather great today.",
    [WeatherState.Rain]: "Don't forget your umbrella. It's wet in {city} today.",
    [WeatherState.Clouds]: "Light a fire and get cosy. {city} is looking grey today.",
    [WeatherState.Snow]: "Time for a snowball fight! {city} is covered in snow."
};
// Function to render and Icoon and text `iconText-container`
export const renderWeatherIconAndText = (fetchWeatherData) => {
    // Get the container where we will append the new weather card
    // Debugging
    if (elements.iconTextContainer === null) {
        //handleErrorMessage
        console.error('iconText-container not found in the DOM!');
        throw Error;
    }
    // Extract the weather state from API response
    const weatherStateString = fetchWeatherData.weather[0].main;
    // Ensure the condition is a valid WeatherState or default to "Clear"
    let validWeatherState;
    if (Object.values(WeatherState).includes(weatherStateString)) {
        validWeatherState = weatherStateString;
    }
    else {
        validWeatherState = WeatherState.Clear;
    }
    // Get the city name from API response (if no name = "your location")
    const cityName = fetchWeatherData.name || 'your location';
    // Replace {city} with the actual city name in catchy text
    const message = catchyTextTemplate[validWeatherState].replace('{city}', cityName);
    // Get the weather icon URL from OpenWeatherMap
    const iconUrl = `Assets/weather_icons/${validWeatherState}.svg`;
    // Create a new div for the weather card
    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card'); // Optional class for styling
    weatherCard.innerHTML = `
        <img src="${iconUrl}" alt="${validWeatherState}">
        <p>${message}</p>
    `;
    // Append the new weather card inside the `iconText-container`
    if (elements.iconTextContainer === null) {
        //handleErrorMessage()
        console.error('iconText-container not found in the DOM!');
        throw new Error('iconText-container not found in the DOM!');
    }
    else {
        elements.iconTextContainer.appendChild(weatherCard);
    }
};
// FORECAST
const renderForecast = (city) => {
    const forecastContainer = document.getElementById("forecast-container");
    if (!forecastContainer) {
        console.warn("⚠️ forecastContainer not found in the DOM!");
        return;
    }
    forecastContainer.innerHTML = "";
    console.log(`🔍 Fetching forecast data for: ${city}`);
    fetchForecastData(city)
        .then((forecastData) => {
        console.log("✅ API Response:", forecastData);
        if (!forecastData.length) {
            console.warn(`⚠️ No forecast data available for ${city}`);
            forecastContainer.innerHTML = `<p>No forecast available for ${city}.</p>`;
            return;
        }
        // Get tomorrow's date for comparison
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        forecastData.forEach((day, index) => {
            let displayDate;
            if (index === 0) {
                displayDate = "Tomorrow"; // CHANGED: First day is "Tomorrow"
            }
            else {
                const dateObj = new Date(day.date + "T00:00:00Z");
                displayDate = dateObj.toLocaleDateString('en-GB'); // CHANGED: DD/MM format
            }
            const row = document.createElement("div");
            row.classList.add("forecast-row");
            row.innerHTML = `
          <span class="day">${displayDate}</span>
          <span class="temp">${day.temperature}°</span>
        `;
            forecastContainer.appendChild(row);
        });
    })
        .catch((error) => {
        console.error("❌ Error fetching forecast data:", error);
    });
};
// SEARCH
// Default city if no search is performed
const DEFAULT_CITY = 'Stockholm';
// Event handler for search form submission
const handleSearch = async (event) => {
    event.preventDefault();
    /*const city = elements.searchInput.value.trim();
    const searchCity = city || DEFAULT_CITY;
    
    // Update debug info
    if (elements.lastSearched) elements.lastSearched.textContent = searchCity;
    if (elements.lastSearched) elements.searchStatus.textContent = 'Searching...';*/
    const city = elements.searchInput?.value.trim() || DEFAULT_CITY;
    try {
        // Fetch both weather and forecast data
        const [weatherData, forecastData] = await Promise.all([
            fetchWeatherData(city),
            fetchForecastData(city)
        ]);
        // Get weather state from weather description
        const weatherMain = weatherData.weatherDescription.split(' ')[0];
        const weatherState = weatherMain === 'clear' ? WeatherState.Clear :
            weatherMain === 'rain' ? WeatherState.Rain :
                weatherMain === 'snow' ? WeatherState.Snow :
                    WeatherState.Clouds;
        // Update today's weather
        if (elements.todaysWeatherContainer) {
            elements.todaysWeatherContainer.innerHTML = `
                <p>${weatherState} | ${weatherData.temperature}°C</p>
                <p>sunrise ${weatherData.sunrise}</p>
                <p>sunset ${weatherData.sunset}</p>
            `;
        }
        // Update icon and text
        if (elements.iconTextContainer) {
            elements.iconTextContainer.innerHTML = ''; // Clear previous content
            const message = catchyTextTemplate[weatherState].replace('{city}', weatherData.cityName);
            const iconUrl = `Assets/weather_icons/${weatherState}.svg`;
            elements.iconTextContainer.innerHTML = `
                <img src="${iconUrl}" alt="${weatherState}" class="weather-icon">
                <p>${message}</p>
            `;
        }
        // Update forecast
        const forecastContainer = document.getElementById("forecast-container");
        if (forecastContainer) {
            forecastContainer.innerHTML = ''; // Clear previous content
            forecastData.forEach((day) => {
                const row = document.createElement("div");
                row.classList.add("forecast-row");
                const dayName = new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' });
                row.innerHTML = `
                    <span class="day">${dayName}</span>
                    <span class="temp">${day.temperature}°C</span>
                `;
                forecastContainer.appendChild(row);
            });
        }
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        if (elements.todaysWeatherContainer) {
            elements.todaysWeatherContainer.textContent = 'Error loading weather data';
        }
    }
};
// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    if (!elements.searchForm) {
        console.error('Search form not found');
        return;
    }
    elements.searchForm.addEventListener('submit', handleSearch);
    // Trigger initial search for default city
    handleSearch(new Event('submit'));
});
// **ADDED MISSING FUNCTION CALL FOR INITIAL WEATHER DISPLAY** // ADDED
// createCardWeather(new Date(), { weather: { cityName: DEFAULT_CITY, temperature: 0, weatherDescription: '', weatherId: 0, sunrise: '', sunset: '' }, forecast: [] }, {}, DEFAULT_CITY);
/*
// Function to update the weather display
const updateWeatherDisplay = async (city: string): Promise<void> => {
  try {
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(city),
      fetchForecastData(city)
    ])

    if (elements.weatherContainer) {
      elements.weatherContainer.innerHTML = createWeatherCard({
        weather: weatherData,
        forecast: forecastData
      })
    }
  } catch (error) {
    console.error("Error updating weather display:", error)
    //handleErrorMessages(error)
    if (elements.weatherContainer) {
      elements.weatherContainer.innerHTML =
        "<p>Error loading weather data. Please try again.</p>"
    }
  }
};

// Initialize weather display for a default city
document.addEventListener('DOMContentLoaded', () => {
  updateWeatherDisplay('London');
})
;*/ 
