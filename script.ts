//import "./forecast";  // Importera utan att exportera något
//import { ProcessedWeatherData, ProcessedForecastData, fetchWeatherData, fetchForecastData } from './fetchWeather.js';

// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null =>
  document.getElementById(id)

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container") as HTMLElement,
  weatherContainerChild: getElement("weather-container-child") as HTMLElement,
  todaysWeatherContainer: getElement("todays-weather-container") as HTMLElement,
  iconTextContainer: getElement("iconText-container") as HTMLElement,
  searchForm: document.getElementById("search-form") as HTMLFormElement,
  searchInput: document.getElementById("search-input") as HTMLInputElement,
  lastSearched: document.getElementById("last-searched") as HTMLSpanElement,
  searchStatus: document.getElementById("search-status") as HTMLSpanElement
}

// ENUMS
enum WeatherState {
  Clear = "Clear",
  Clouds = "Clouds",
  Rain = "Rain",
  Snow = "Snow"
}

interface WeatherCardData {
  weather: ProcessedWeatherData
  forecast: ProcessedForecastData[]
}

interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

interface SysData {
  country: string
  sunrise: number
  sunset: number
}

interface WeatherResponse {
  name: string
  main: MainWeatherData
  weather: WeatherCondition[]
  sys: SysData
}

interface ProcessedWeatherData {
  cityName: string
  temperature: number
  weatherDescription: string
  weatherId: number
  sunrise: string
  sunset: string
}

interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: WeatherCondition[]
}

interface ForecastResponse {
  list: ForecastItem[]
  city: {
    name: string
  }
}

interface ProcessedForecastData {
  date: string
  temperature: number
  weatherDescription: string
  weatherId: number
}

// GLOBAL VARIABLES

// Get the city name from API response (if no name = "your location")
const cityName: string = fetchWeatherData.name || "your location"

// Use a hardcoded API key for now (you should move this to a secure configuration later)
const API_KEY = "081d5769835e0277d80d7efa7aca13c6" // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5"

function fetchWeatherData(city: string): Promise<ProcessedWeatherData> {

  return fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather data fetch failed")
      }
      return response.json() as Promise<WeatherResponse>
    })
    .then((data: WeatherResponse) => {

      const formatTime = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit"
        })
      }

      return {
        cityName: data.name,
        temperature: Math.round(data.main.temp),
        weatherDescription: data.weather[0].main,
        weatherId: data.weather[0].id,
        sunrise: formatTime(data.sys.sunrise),
        sunset: formatTime(data.sys.sunset)        
      }

    })
    .catch((error) => {
      console.error("Error fetching weather data:", error)
      throw error
    })
}

function fetchForecastData(city: string): Promise<ProcessedForecastData[]> {
  return fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Forecast data fetch failed")
      }
      return response.json() as Promise<ForecastResponse>
    })
    .then((data: ForecastResponse) => {
      const processedForecasts = new Map<string, ProcessedForecastData>()

      // Get today's and tomorrow's dates for comparison
      const today = new Date()
      const todayString = today.toISOString().split("T")[0] // YYYY-MM-DD

      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0] // YYYY-MM-DD

        // Ignore today's forecasts, start from tomorrow
        if (date > todayString && !processedForecasts.has(date)) {
          processedForecasts.set(date, {
            date: date, // Store in ISO format (YYYY-MM-DD)
            temperature: Math.round(item.main.temp),
            weatherDescription: item.weather[0].description,
            weatherId: item.weather[0].id
          })
        }
      })

      return Array.from(processedForecasts.values()).slice(0, 4) // Ensure only 4 future days
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error)
      throw error
    })
}
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
let today: Date = new Date()
let weatherDescription: string = ""

// FUNCTIONS

const checkWeatherState = (filter: WeatherState): string => {
  if (filter === WeatherState.Clear) {
    weatherDescription = WeatherState.Clear
  } else if (filter === WeatherState.Clouds) {
    weatherDescription = WeatherState.Clouds
  } else if (filter === WeatherState.Rain) {
    weatherDescription = WeatherState.Rain
  } else if (filter === WeatherState.Snow) {
    weatherDescription = WeatherState.Snow
  }

  // Uppdatera body-klassen med rätt väderklass
  updateBodyClass(weatherDescription)

  return weatherDescription
}

function updateBodyClass(weatherState: string): void {
  const body = document.body
  const validClasses = ["clear", "rain", "clouds", "snow"]

  // Ta bort gamla väderklasser
  body.classList.remove(...validClasses)

  // Lägg till den nya klassen om den är giltig
  if (validClasses.includes(weatherState.toLowerCase())) {
    body.classList.add(weatherState.toLowerCase())
  }
}

// handleErrorMessages

const displayTodaysWeather = (today: Date, data: WeatherCardData) => {
  // Mapping to today is missing
  const { weather } = data
  if (elements.todaysWeatherContainer == null) {
    //handleErrorMessages(error)
    return
  } else {
    elements.todaysWeatherContainer.innerHTML = `<p>${weatherDescription} | ${weather.temperature}</p>
  <p>Sunrise: ${weather.sunrise}</p>
  <p>Sunset: ${weather.sunset}</p>`
  }
}

// Define catchyTextTemplate using city from API as a placeholder
const catchyTextTemplate: Record<WeatherState, string> = {
  [WeatherState.Clear]:
    "Get your sunnies on. {city} is looking rather great today.",
  [WeatherState.Rain]: "Don't forget your umbrella. It's wet in {city} today.",
  [WeatherState.Clouds]:
    "Light a fire and get cosy. {city} is looking grey today.",
  [WeatherState.Snow]: "Time for a snowball fight! {city} is covered in snow."
}

// Function to render and Icon and text `iconText-container`
const renderWeatherIconAndText = (weatherData: any): void => {
  if (!elements.iconTextContainer) {
    console.error("iconText-container not found in the DOM!")
    throw new Error("iconText-container not found in the DOM!")
  }

  // Extract weather state from API response
  const weatherStateString: string = weatherData.weather[0].main

  // Ensure the condition is a valid WeatherState or default to "Clear"
  const validWeatherState: WeatherState = Object.values(WeatherState).includes(
    weatherStateString as WeatherState
  )
    ? (weatherStateString as WeatherState)
    : WeatherState.Clear

  // Correct city name replacement
  const cityName = weatherData.name || "your location"
  const messageTemplate =
    catchyTextTemplate[validWeatherState] || "Weather looks good in {city}!"
  const message = messageTemplate.replace("{city}", cityName)

  // Get the weather icon URL
  const iconUrl = `Assests/${validWeatherState}.png`

  // Create a div for the weather icon and text
  const iconTextDiv = document.createElement("div")
  iconTextDiv.classList.add("icon-text")

  iconTextDiv.innerHTML = `
      <img src="${iconUrl}" alt="${validWeatherState}" class="weather-icon">
      <h1>${message}</h1>
  `

  // Append the new weather card inside the `iconText-container`
  elements.iconTextContainer.innerHTML = "" // Clear previous content
  elements.iconTextContainer.appendChild(iconTextDiv)
}

// FORECAST

const renderForecast = (city: string): void => {
  const forecastContainer = document.getElementById(
    "forecast-container"
  ) as HTMLElement

  if (!forecastContainer) {
    console.warn("forecastContainer not found in the DOM!")
    return
  }

  forecastContainer.innerHTML = ""

  fetchForecastData(city)
    .then((forecastData: ProcessedForecastData[]) => {

      if (!forecastData.length) {
        console.warn(`No forecast data available for ${city}`)
        forecastContainer.innerHTML = `<p>No forecast available for ${city}.</p>`
        return
      }

      // Get tomorrow's date for comparison
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowString = tomorrow.toISOString().split("T")[0] // Format: YYYY-MM-DD

      forecastData.forEach((day, index) => {
        let displayDate
        if (index === 0) {
          displayDate = "Tomorrow" // CHANGED: First day is "Tomorrow"
        } else {
          const dateObj = new Date(day.date + "T00:00:00Z")
          displayDate = dateObj.toLocaleDateString("en-GB") // CHANGED: DD/MM format
        }

        const row = document.createElement("div")
        row.classList.add("forecast-row")
        row.innerHTML = `
          <span class="day">${displayDate}</span>
          <span class="temp">${day.temperature}°</span>
        `

        forecastContainer.appendChild(row)
      })
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error)
    })
}

// SEARCH
// Default city if no search is performed
const DEFAULT_CITY = "Stockholm"

// Event handler for search form submission
const handleSearch = async (event: Event): Promise<void> => {
  event.preventDefault()

  /*const city = elements.searchInput.value.trim();
    const searchCity = city || DEFAULT_CITY;
    
    // Update debug info
    if (elements.lastSearched) elements.lastSearched.textContent = searchCity;
    if (elements.lastSearched) elements.searchStatus.textContent = 'Searching...';*/
  const city = elements.searchInput?.value.trim() || DEFAULT_CITY

  try {
    // Fetch both weather and forecast data
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(city),
      fetchForecastData(city),
    ]);


    // Get weather state from weather description
    const weatherMain = weatherData.weatherDescription.toLowerCase() 
    const weatherState =
      weatherMain === "clear"
        ? WeatherState.Clear
        : weatherMain === "rain"
        ? WeatherState.Rain
        : weatherMain === "snow"
        ? WeatherState.Snow
        : WeatherState.Clouds

      updateBodyClass(weatherState);

    // Update today's weather
    if (elements.todaysWeatherContainer) {
      elements.todaysWeatherContainer.innerHTML = `
                <p>${weatherState} | ${weatherData.temperature}°C</p>
                <p>sunrise ${weatherData.sunrise}</p>
                <p>sunset ${weatherData.sunset}</p>
            `
    }

    // Update icon and text
    if (elements.iconTextContainer) {
      elements.iconTextContainer.innerHTML = "" // Clear previous content
      const message = catchyTextTemplate[weatherState].replace(
        "{city}",
        weatherData.cityName
      )
      const iconUrl = `Assests/${weatherState}.png`

      elements.iconTextContainer.innerHTML = `
                <img src="${iconUrl}" alt="${weatherState}" class="weather-icon">
                <h1>${message}</h1>
            `
    }

    // Update forecast
    const forecastContainer = document.getElementById("forecast-container")
    if (forecastContainer) {
      forecastContainer.innerHTML = "" // Clear previous content
      forecastData.forEach((day) => {
        const row = document.createElement("div")
        row.classList.add("forecast-row")
        const dayName = new Date(day.date).toLocaleDateString("en-GB", {
          weekday: "short"
        })
        row.innerHTML = `
                    <span class="day">${dayName}</span>
                    <span class="temp">${day.temperature}°C</span>
                `
        forecastContainer.appendChild(row)
      })
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    if (elements.todaysWeatherContainer) {
      elements.todaysWeatherContainer.textContent = "Error loading weather data"
    }
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  if (!elements.searchForm) {
    console.error("Search form not found")
    return
  }

  elements.searchForm.addEventListener("submit", handleSearch)

  // Trigger initial search for default city
  handleSearch(new Event("submit"))
})

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
