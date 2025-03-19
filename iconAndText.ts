// OBS!! this are the weather icons we can get here  (https://openweathermap.org/weather-conditions#Icon-list)
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

// Function to render and Icoon and text `iconText-container`
export const renderWeatherIconAndText = (apiResponse: any): void => {
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
    validWeatherState = WeatherState.Clear;
  }

  // Get the city name from API response (if no name = "your location")
  const cityName: string = apiResponse.name || 'your location';

  // Replace {city} with the actual city name in catchy text
  const message = catchyTextTemplate[validWeatherState].replace(
    '{city}',
    cityName
  );

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
  iconTextContainer.appendChild(weatherCard);
};

//Tar in dummy_API_response. Vi låtsats att användaren väljer staden STHLM (Denna kan vi kopiera och använda för att i andra filer ----- import { renderWeatherInfo } from "./iconAndText";-----)

const selectedCity = 'Stockholm'; // Vi ersätter sen med vad vi får från APIet/userinput

const loadWeatherForCity = async (city: string): Promise<void> => {
  try {
    const response = await fetch('dummy_API_response.text'); // Load file
    const text = await response.text(); // Convert to text

    // 3️⃣ Parse the text as JSON (handling multiple JSON objects)
    const jsonObjects = text
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    // 4️⃣ Find the weather data for the selected city
    const cityWeatherData = jsonObjects.find(
      (entry) => entry.name.toLowerCase() === city.toLowerCase()
    );

    if (!cityWeatherData) {
      console.warn(`No weather data found for ${city}`);
      return;
    }

    // 5️⃣ Render weather info for the selected city
    renderWeatherIconAndText(cityWeatherData);
  } catch (error) {
    console.error('Error loading dummy data:', error);
  }
};

// Runingn function when load the page
loadWeatherForCity(selectedCity);
