import { fetchWeatherData, fetchForecastData } from "./fetchWeather.js"

// Function to fetch weather data based on coordinates
const fetchWeather = async (latitude: number, longitude: number) => {
  try {
    const cityName = await getCityName(latitude, longitude)
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(cityName),
      fetchForecastData(cityName)
    ])

    if (elements.weatherContainer) {
      elements.weatherContainer.innerHTML = createWeatherCard({
        weather: weatherData,
        forecast: forecastData
      })
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    if (elements.weatherContainer) {
      elements.weatherContainer.innerHTML =
        "<p>Error loading weather data. Please try again.</p>"
    }
  }
}

import { ProcessedWeatherData, ProcessedForecastData } from "./fetchWeather.js"

interface WeatherCardData {
  weather: ProcessedWeatherData
  forecast: ProcessedForecastData[]
}

const createWeatherCard = (data: WeatherCardData): string => {
  const { weather, forecast } = data

  // Return displayTodaysWeather, search function, displayIcon, displayWeatherDescription and displayForecast
  return `<div id="weather-content" class="weather-card">
      <div id="today-info">
        <h2>${weather.cityName}</h2>
        <div class="current-weather">
          <img id="weather-icon" src="https://openweathermap.org/img/wn/${
            weather.weatherId
          }@2x.png" alt="${weather.weatherDescription}">
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
          ${forecast
            .map(
              (day) => `
            <li>
              <p>${day.date}</p>
              `
            )
            .join("")}
        </ul>
      </div>
    </div>
  `
}

// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null =>
  document.getElementById(id)

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container")
}

// GLOBAL VARIABLES
let currentCity: string = ""
let supportsGeolocation: boolean = false // should there be a default?

// Function to handle error messages
const handleErrorMessages = (error: string) => {
  console.error("Error detected:", error)

  let message = "An unexpected error occurred. Please try again."
  let messageType = "warning"
  if (!supportsGeolocation) {
    message = "Geolocation is not supported by your browser."
    messageType = "error"
  } else {
    console.error("Error fetching data:", error)
    message = "Failed to load recipes. Please try again later."
  }

  // Update the message in the HTML
  const errorContainer = document.getElementById("error-container")
  if (errorContainer) {
    errorContainer.innerHTML = `<h3>${message}</h3>`
    errorContainer.className = messageType
    errorContainer.style.display = "block"
  }
}

/////////////////////////////////////////// STARTS HERE

// Function to check for geolocation support
const checkGeolocationSupport = () => {
  console.log("Checking geolocation support...")
  if (navigator.geolocation) {
    return (supportsGeolocation = true)
  } else {
    return (supportsGeolocation = false)
  }
}

// Function to get city name via the method reverse geocode
const getCityName = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch city name")
    }

    const data = await response.json()
    console.log("Fetched city data:", data)

    return (currentCity = data.city || "Unknown City")
  } catch (error) {
    handleErrorMessages(error)
    console.error("Error getting city name:", error)
    return "Unknown City" // Return a standard value if something goes wrong
  }
}

navigator.geolocation.getCurrentPosition(
  async (position) => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    console.log("Latitude:", latitude)
    console.log("Longitude:", longitude)

    const cityName = await getCityName(latitude, longitude)
    console.log("User's city:", cityName)

    fetchWeather(latitude, longitude)
  },
  (error) => {
    console.error("Error getting location:", error.message)
  }
)
