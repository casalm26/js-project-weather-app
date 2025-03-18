// DOM ELEMENTS
// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null =>
  document.getElementById(id)

const elements = {
  weatherContainer: getElement("weather-container"),
  todaysWeatherContainer: getElement("todays-weather-container")
}

// Enums
enum WeatherState {
  Clear = "clear",
  Sun = "sun", // What do we call this?
  Clouds = "clouds",
  Rain = "rain",
  Snow = "snow"
}

// Global variables
let today: Date = new Date()
let currentWeatherState: string = ""

const checkWeatherState = (filter: WeatherState): string => {
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

const displayTodaysWeather = (today: Date, data: WeatherCardData) => {
  // Mapping to today is missing
  const { weather } = data
  elements.todaysWeatherContainer.innerHTML = `<p>${currentWeatherState} | ${weather.temperature}</p>
  <p>Sunrise: ${weather.sunrise}</p>
  <p>Sunset: ${weather.sunset}</p>`
}
