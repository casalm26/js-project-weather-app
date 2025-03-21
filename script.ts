
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
  searchStatus: document.getElementById("search-status") as HTMLSpanElement,
  githubIcon: document.getElementById("github-icon") as HTMLElement
}

// ENUMS
enum WeatherState {
  Clear = "Clear",
  Clouds = "Clouds",
  Rain = "Rain",
  Snow = "Snow"
}

// INTERFACES
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
let weatherDescription: string = ""

// Use a hardcoded API key for now (you should move this to a secure configuration later)
const API_KEY = "081d5769835e0277d80d7efa7aca13c6" // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5"

// Default city if no search is performed
const DEFAULT_CITY = "Stockholm"

// FUNCTIONS
const fetchWeatherData = (city: string): Promise<ProcessedWeatherData> => {
  return fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather data fetch failed")
      }
      return response.json() as Promise<WeatherResponse>
    })
    .then((data: WeatherResponse) => {

      // Formats the time from Unix to local Swedish settings
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

const fetchForecastData = (city: string): Promise<ProcessedForecastData[]> => {
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

const updateBodyClass = (weatherState: string): void => {
  const body = document.body
  const validClasses = ["clear", "rain", "clouds", "snow"]

  // Remove old weather classes
  body.classList.remove(...validClasses)
  elements.githubIcon.classList.remove(...validClasses)

  // Add the new class if it's valid
  if (validClasses.includes(weatherState.toLowerCase())) {
    body.classList.add(weatherState.toLowerCase())
    elements.githubIcon.classList.add(weatherState.toLowerCase())
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

// Event handler for search that calls on every other function in the program
const runWeatherApp = async (event: Event): Promise<void> => {
  event.preventDefault()

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
      const iconUrl = `Assets/${weatherState}.png`

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

  elements.searchForm.addEventListener("submit", runWeatherApp)

  // Trigger initial search for default city
  runWeatherApp(new Event("submit"))
})

