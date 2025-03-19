// OBS!! this are the weather icons we have to get (https://openweathermap.org/weather-conditions#Icon-list)
// Define WeatherState as an Enum
enum WeatherState {
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
}

// Define catchyTextTemplate using city from API as a placeholder
const catchyTextTemplate: Record<WeatherState, string> = {
  [WeatherState.Clear]:
    'Get your sunnies on. {city} is looking rather great today.',
  [WeatherState.Rain]: 'Don’t forget your umbrella. It’s wet in {city} today.',
  [WeatherState.Clouds]:
    'Light a fire and get cosy. {city} is looking grey today.',
  [WeatherState.Drizzle]:
    "It's a bit drizzly in {city}. Maybe grab a light raincoat?",
  [WeatherState.Thunderstorm]:
    'Stay indoors! A thunderstorm is raging over {city}.',
  [WeatherState.Snow]: 'Time for a snowball fight! {city} is covered in snow.',
  [WeatherState.Mist]: 'A misty day in {city}. Drive carefully!',
  [WeatherState.Smoke]: 'Smoky skies over {city}. Stay indoors if possible.',
  [WeatherState.Haze]:
    '{city} is looking hazy today. Avoid outdoor activities.',
  [WeatherState.Dust]: 'Dust storms in {city}. Keep your windows closed!',
  [WeatherState.Fog]: 'Thick fog in {city}. Visibility is low!',
  [WeatherState.Sand]: 'A sandy breeze is blowing through {city}.',
  [WeatherState.Ash]: 'Volcanic ash detected near {city}. Take precautions!',
  [WeatherState.Squall]: 'Strong winds in {city}. Hold onto your hat!',
  [WeatherState.Tornado]: 'Tornado warning for {city}! Stay safe!',
};

// Function to get weatherinfo fron API respons and append it to `iconText-container`
const renderWeatherInfo = (apiResponse: any): void => {
  // Get the container where we will append the new weather card
  const iconTextContainer = document.getElementById('iconText-container');

  // Debugging
  if (!iconTextContainer) {
    console.error('iconText-container not found in the DOM!');
    return;
  }

  // Extract the weather state from API response
  const weatherStateString: string = apiResponse.weather[0].main;

  // Ensure the condition is a valid WeatherState or default to "Clear"
  let validWeatherState: WeatherState;
  if (
    Object.values(WeatherState).includes(weatherStateString as WeatherState)
  ) {
    validWeatherState = weatherStateString as WeatherState;
  } else {
    validWeatherState = WeatherState.Clear; //Om det inte finns något väder eller om det inte passar någon av vår enums värde blir det Clear.
  }

  // Get the city name from API response (if no name = "your location")
  const cityName: string = apiResponse.name || 'your location';

  // Replace {city} with the actual city name in catchy text
  const message = catchyTextTemplate[validWeatherState].replace(
    '{city}',
    cityName
  );

  // Get the weather icon URL from OpenWeatherMap
  const iconCode = apiResponse.weather[0].icon;
  const iconUrl = `Assets/weather_icons/${validWeatherState}.svg`;

  // Create a new div for the weather card
  const weatherCard = document.createElement('div');
  weatherCard.classList.add('weather-card'); // Optional class for styling
  weatherCard.innerHTML = `
        <img src="${iconUrl}" alt="${validWeatherState}">
        <p>${message}</p>
    `;

  // Append the new weather card inside the `iconText-container`
  iconTextContainer.appendChild(weatherCard);
};

// Function to load dummy API response from text from dummy_API_response.txt (all made by CHAT GPT)
const loadDummyData = async (): Promise<void> => {
  try {
    const response = await fetch('dummy_API_response.text'); // Load file
    const text = await response.text(); // Convert to text

    // Parse the text as JSON (handling multiple JSON objects)
    const jsonObjects = text
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    // Render weather info for **each** object in the file
    jsonObjects.forEach(renderWeatherInfo);
  } catch (error) {
    console.error('Error loading dummy data:', error);
  }
};

// Runingn function when load the page
loadDummyData();
