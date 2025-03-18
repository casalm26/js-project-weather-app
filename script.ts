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

const displayTodaysWeather = (currentWeatherState: string) => {
  // Print current weather in the weatherCard
  // WeatherState | WeatherState.State(temp)
  // Sunrise today.sunrise(time)
  // Sunset today.sunrise(time)
}
