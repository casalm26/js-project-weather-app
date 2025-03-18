// Define WeatherState as an Enum
enum WeatherState {
  Clear = 'Clear',
  Rain = 'Rain',
  Clouds = 'Clouds',
}

// Define catchyTextTemplate using Record
const catchyTextTemplate: Record<WeatherState, string> = {
  [WeatherState.Clear]:
    'Get your sunnies on. {city} is looking rather great today.',
  [WeatherState.Rain]: 'Don’t forget your umbrella. It’s wet in {city} today.',
  [WeatherState.Clouds]:
    'Light a fire and get cosy. {city} is looking grey today.',
};

// Function to get weather info and render the icon & text!
const renderWeatherInfo = (apiResponse: any): void => {
  // get the weather state from API response
  const weatherStateString: string = apiResponse.weather[0].main;

  // Ensure the condition is a valid WeatherState or default to "Clear"
  let validWeatherState: WeatherState;
  if (
    Object.values(WeatherState).includes(weatherStateString as WeatherState)
  ) {
    validWeatherState = weatherStateString as WeatherState;
  } else {
    validWeatherState = WeatherState.Clear;
  }

  // Get the city name from API response (default to "your location" if missing)
  const cityName: string = apiResponse.name || 'your location';

  // Replace {city} with the actual city name in catchy text
  const message = catchyTextTemplate[validWeatherState].replace(
    '{city}',
    cityName
  );

  // Get the weather icon URL from OpenWeatherMap
  const iconCode = apiResponse.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Take out the dom elements
  const weatherIconElement = document.getElementById(
    'weather-icon'
  ) as HTMLImageElement | null;
  const weatherTextElement = document.getElementById(
    'weather-text'
  ) as HTMLElement | null;

  // Update DOM if elements exist with data from api
  if (weatherIconElement) {
    weatherIconElement.src = iconUrl;
    weatherIconElement.alt = validWeatherState;
  }

  if (weatherTextElement) {
    weatherTextElement.textContent = message;
  }
};

// Function to load dummy API response from text file (ALL CHATGPT)
const loadDummyData = async (): Promise<void> => {
  try {
    const response = await fetch('dummy_API_response.text'); // Load file
    const text = await response.text(); // Convert to text

    // Parse the text as JSON (handling multiple JSON objects)
    const jsonObjects = text
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    // Render weather info for the first object in the file
    renderWeatherInfo(jsonObjects[0]);
  } catch (error) {
    console.error('Error loading dummy data:', error);
  }
};

// Run function on page load
loadDummyData();
