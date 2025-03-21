"use strict";
// Function to get DOM elements by ID
const getElement = (id) => document.getElementById(id);
// DOM ELEMENTS
const elements = {
    weatherContainer: getElement("weather-container"),
    weatherContainerChild: getElement("weather-container-child"),
    todaysWeatherContainer: getElement("todays-weather-container"),
    iconTextContainer: getElement("iconText-container"),
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    lastSearched: document.getElementById("last-searched"),
    searchStatus: document.getElementById("search-status")
};
// ENUMS
var WeatherState;
(function (WeatherState) {
    WeatherState["Clear"] = "Clear";
    WeatherState["Clouds"] = "Clouds";
    WeatherState["Rain"] = "Rain";
    WeatherState["Snow"] = "Snow";
})(WeatherState || (WeatherState = {}));
// GLOBAL VARIABLES
let weatherDescription = "";
// Use a hardcoded API key for now (you should move this to a secure configuration later)
const API_KEY = "081d5769835e0277d80d7efa7aca13c6"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";
// Default city if no search is performed
const DEFAULT_CITY = "Stockholm";
// FUNCTIONS
const fetchWeatherData = (city) => {
    return fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Weather data fetch failed");
        }
        return response.json();
    })
        .then((data) => {
        const formatTime = (timestamp) => {
            return new Date(timestamp * 1000).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit"
            });
        };
        return {
            cityName: data.name,
            temperature: Math.round(data.main.temp),
            weatherDescription: data.weather[0].main,
            weatherId: data.weather[0].id,
            sunrise: formatTime(data.sys.sunrise),
            sunset: formatTime(data.sys.sunset)
        };
    })
        .catch((error) => {
        console.error("Error fetching weather data:", error);
        throw error;
    });
};
const fetchForecastData = (city) => {
    return fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Forecast data fetch failed");
        }
        return response.json();
    })
        .then((data) => {
        const processedForecasts = new Map();
        // Get today's and tomorrow's dates for comparison
        const today = new Date();
        const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD
        data.list.forEach((item) => {
            const date = new Date(item.dt * 1000).toISOString().split("T")[0]; // YYYY-MM-DD
            // Ignore today's forecasts, start from tomorrow
            if (date > todayString && !processedForecasts.has(date)) {
                processedForecasts.set(date, {
                    date: date, // Store in ISO format (YYYY-MM-DD)
                    temperature: Math.round(item.main.temp),
                    weatherDescription: item.weather[0].description,
                    weatherId: item.weather[0].id
                });
            }
        });
        return Array.from(processedForecasts.values()).slice(0, 4); // Ensure only 4 future days
    })
        .catch((error) => {
        console.error("Error fetching forecast data:", error);
        throw error;
    });
};
const updateBodyClass = (weatherState) => {
    const body = document.body;
    const validClasses = ["clear", "rain", "clouds", "snow"];
    // Ta bort gamla väderklasser
    body.classList.remove(...validClasses);
    // Lägg till den nya klassen om den är giltig
    if (validClasses.includes(weatherState.toLowerCase())) {
        body.classList.add(weatherState.toLowerCase());
    }
};
// Define catchyTextTemplate using city from API as a placeholder
const catchyTextTemplate = {
    [WeatherState.Clear]: "Get your sunnies on. {city} is looking rather great today.",
    [WeatherState.Rain]: "Don't forget your umbrella. It's wet in {city} today.",
    [WeatherState.Clouds]: "Light a fire and get cosy. {city} is looking grey today.",
    [WeatherState.Snow]: "Time for a snowball fight! {city} is covered in snow."
};
// Event handler for search that calls on every other function in the program
const runWeatherApp = async (event) => {
    event.preventDefault();
    const city = elements.searchInput?.value.trim() || DEFAULT_CITY;
    try {
        // Fetch both weather and forecast data
        const [weatherData, forecastData] = await Promise.all([
            fetchWeatherData(city),
            fetchForecastData(city),
        ]);
        // Get weather state from weather description
        const weatherMain = weatherData.weatherDescription.toLowerCase();
        const weatherState = weatherMain === "clear"
            ? WeatherState.Clear
            : weatherMain === "rain"
                ? WeatherState.Rain
                : weatherMain === "snow"
                    ? WeatherState.Snow
                    : WeatherState.Clouds;
        updateBodyClass(weatherState);
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
            elements.iconTextContainer.innerHTML = ""; // Clear previous content
            const message = catchyTextTemplate[weatherState].replace("{city}", weatherData.cityName);
            const iconUrl = `Assets/${weatherState}.png`;
            elements.iconTextContainer.innerHTML = `
                <img src="${iconUrl}" alt="${weatherState}" class="weather-icon">
                <h1>${message}</h1>
            `;
        }
        // Update forecast
        const forecastContainer = document.getElementById("forecast-container");
        if (forecastContainer) {
            forecastContainer.innerHTML = ""; // Clear previous content
            forecastData.forEach((day) => {
                const row = document.createElement("div");
                row.classList.add("forecast-row");
                const dayName = new Date(day.date).toLocaleDateString("en-GB", {
                    weekday: "short"
                });
                row.innerHTML = `
                    <span class="day">${dayName}</span>
                    <span class="temp">${day.temperature}°C</span>
                `;
                forecastContainer.appendChild(row);
            });
        }
    }
    catch (error) {
        console.error("Error fetching weather data:", error);
        if (elements.todaysWeatherContainer) {
            elements.todaysWeatherContainer.textContent = "Error loading weather data";
        }
    }
};
// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    if (!elements.searchForm) {
        console.error("Search form not found");
        return;
    }
    elements.searchForm.addEventListener("submit", runWeatherApp);
    // Trigger initial search for default city
    runWeatherApp(new Event("submit"));
});
