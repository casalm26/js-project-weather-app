//import "./forecast";  // Importera utan att exportera något
//import { ProcessedWeatherData, ProcessedForecastData, fetchWeatherData, fetchForecastData } from './fetchWeather.js';

// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null =>
  document.getElementById(id)


// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container"),
  weatherContainerChild: getElement("weather-container-child"),
  todaysWeatherContainer: getElement("todays-weather-container") as HTMLElement,
  iconTextContainer: getElement("iconText-container"),
  searchForm: document.getElementById('search-form') as HTMLFormElement,
  searchInput: document.getElementById('search-input') as HTMLInputElement,
  lastSearched: document.getElementById('last-searched') as HTMLSpanElement,
  searchStatus: document.getElementById('search-status') as HTMLSpanElement,
}

interface WeatherCardData {
  weather: ProcessedWeatherData
  forecast: ProcessedForecastData[]
}

// ENUMS
enum WeatherState {
  Clear = "Clear",
  Clouds = "Clouds",
  Rain = "Rain",
  Snow = "Snow"
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
};

interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
};

interface SysData {
  country: string;
  sunrise: number;
  sunset: number;
};

interface WeatherResponse {
  name: string;
  main: MainWeatherData;
  weather: WeatherCondition[];
  sys: SysData;
};

interface ProcessedWeatherData {
  cityName: string;
  temperature: number;
  weatherDescription: string;
  weatherId: number;
  sunrise: string;
  sunset: string;
};

interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
};

interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
  };
};

interface ProcessedForecastData {
  date: string;
  temperature: number;
  weatherDescription: string;
  weatherId: number;
};

// Use a hardcoded API key for now (you should move this to a secure configuration later)
const API_KEY = '081d5769835e0277d80d7efa7aca13c6'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function fetchWeatherData(city: string): Promise<ProcessedWeatherData> {
  return fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      return response.json() as Promise<WeatherResponse>;
    })
    .then((data: WeatherResponse) => {
      const formatTime = (timestamp: number): string => {
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
};

export function fetchForecastData(city: string): Promise<ProcessedForecastData[]> {
  return fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast data fetch failed');
      }
      return response.json() as Promise<ForecastResponse>;
    })
    .then((data: ForecastResponse) => {
      // Get one forecast per day for the next 4 days
      const processedForecasts = new Map<string, ProcessedForecastData>();
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        // Only store the first forecast we see for each day
        if (!processedForecasts.has(date)) {
          processedForecasts.set(date, {
            date,
            temperature: Math.round(item.main.temp),
            weatherDescription: item.weather[0].description,
            weatherId: item.weather[0].id,
          });
        }
      });

      // Convert Map to Array and take first 4 days
      return Array.from(processedForecasts.values()).slice(0, 4);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
      throw error;
    });
}; 
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
  return weatherDescription
};

// handleErrorMessages

const displayTodaysWeather = (today: Date, data: WeatherCardData) => {
  // Mapping to today is missing
  const { weather } = data
  if(elements.todaysWeatherContainer == null) {
    //handleErrorMessages(error)
    return
  } else {
  elements.todaysWeatherContainer.innerHTML = `<p>${weatherDescription} | ${weather.temperature}</p>
  <p>Sunrise: ${weather.sunrise}</p>
  <p>Sunset: ${weather.sunset}</p>`
  }
};

//Bild och rolig text-funktion


// Define catchyTextTemplate using city from API as a placeholder
const catchyTextTemplate: Record<WeatherState, string> = {
  [WeatherState.Clear]:
    'Get your sunnies on. {city} is looking rather great today.',
  [WeatherState.Rain]: 'Don’t forget your umbrella. It’s wet in {city} today.',
  [WeatherState.Clouds]:
    'Light a fire and get cosy. {city} is looking grey today.',
  [WeatherState.Snow]: 'Time for a snowball fight! {city} is covered in snow.',
/*   [WeatherState.Drizzle]:
    "It's a bit drizzly in {city}. Maybe grab a light raincoat?",
  [WeatherState.Thunderstorm]:
    'Stay indoors! A thunderstorm is raging over {city}.',
  [WeatherState.Mist]: 'A misty day in {city}. Drive carefully!',
  [WeatherState.Smoke]: 'Smoky skies over {city}. Stay indoors if possible.',
  [WeatherState.Haze]:
    '{city} is looking hazy today. Avoid outdoor activities.',
  [WeatherState.Dust]: 'Dust storms in {city}. Keep your windows closed!',
  [WeatherState.Fog]: 'Thick fog in {city}. Visibility is low!',
  [WeatherState.Sand]: 'A sandy breeze is blowing through {city}.',
  [WeatherState.Ash]: 'Volcanic ash detected near {city}. Take precautions!',
  [WeatherState.Squall]: 'Strong winds in {city}. Hold onto your hat!',
  [WeatherState.Tornado]: 'Tornado warning for {city}! Stay safe!', */
};

// Function to render and Icoon and text `iconText-container`
export const renderWeatherIconAndText = (fetchWeatherData: any): void => {
  // Get the container where we will append the new weather card

  // Debugging
  if (elements.iconTextContainer = null) {
    //handleErrorMessage
    console.error('iconText-container not found in the DOM!');
    throw Error;
  }

  // Extract the weather state from API response
  const weatherStateString: string = fetchWeatherData.weather[0].main;

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
  const cityName: string = fetchWeatherData.name || 'your location';

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

  if (elements.iconTextContainer === null) {
    //handleErrorMessage()
    console.error('iconText-container not found in the DOM!');
    throw new Error('iconText-container not found in the DOM!');
  } else {
    (elements.iconTextContainer as HTMLElement).appendChild(weatherCard);
  }
};

// FORECAST

const renderForecast = (city: string): void => {
  const forecastContainer: HTMLElement | null = document.getElementById("forecast-container");

  if (!forecastContainer) {
    console.warn("⚠️ forecastContainer not found in the DOM!");
    return;
  }

  forecastContainer.innerHTML = "";

  console.log(`🔍 Fetching forecast data for: ${city}`);

  // Hämta prognosdata
  fetchForecastData(city)
    .then((forecastData: { date: string; temperature: number }[]) => {
      console.log("✅ API Response:", forecastData);

      // Om datan är tom, logga en varning
      if (!forecastData.length) {
        console.warn(`⚠️ No forecast data available for ${city}`);
        forecastContainer.innerHTML = `<p>No forecast available for ${city}.</p>`;
        return;
      }

      forecastData.forEach((day) => {
        console.log(`📅 Forecast for ${day.date}: ${day.temperature}°C`);

        const row: HTMLDivElement = document.createElement("div");
        row.classList.add("forecast-row");
        row.innerHTML = `
          <span class="day">${new Date(day.date).toLocaleDateString('sv-SE', { weekday: 'short' }).toLowerCase()}</span>
          <span class="temp">${day.temperature}°</span>
        `;

        forecastContainer?.appendChild(row);
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
const handleSearch = async (event: Event): Promise<void> => {
    event.preventDefault();
    
    const city = elements.searchInput.value.trim();
    const searchCity = city || DEFAULT_CITY;
    
    // Update debug info
    if (elements.lastSearched) elements.lastSearched.textContent = searchCity;
    if (elements.lastSearched) elements.searchStatus.textContent = 'Searching...';
    
    try {
        // Fetch weather data
        const weatherData = await fetchWeatherData(searchCity);

        // Update debug info
        if (elements.searchStatus) elements.searchStatus.textContent = 'Success!';

        // Display basic weather info
        if (elements.todaysWeatherContainer) {
            elements.todaysWeatherContainer.textContent = `${weatherData.cityName}, ${weatherData.temperature}°C, ${weatherData.weatherDescription}`;
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Update debug info
        if (elements.searchStatus) elements.searchStatus.textContent = 'Error!';
        if (elements.todaysWeatherContainer) {
            elements.todaysWeatherContainer.textContent = 'Error loading weather data';
        }
    }
};

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!elements.searchForm || !elements.searchInput) {
        console.error('Search form elements not found');
        return;
    }

    // Add event listener for form submission
    elements.searchForm.addEventListener('submit', handleSearch);

    // Trigger initial search for default city
    handleSearch(new Event('submit'));
});

const createCardWeather = (today: Date, data: WeatherCardData, apiResponse: any, city: string) => {
  // Hämta HTML-innehållet från funktionerna
  const todaysWeatherHTML = displayTodaysWeather(today, data);
  const iconAndTextHTML = renderWeatherIconAndText(apiResponse);
  const forecastHTML = renderForecast(city);

  // Sätt samman innehållet
  const cardContent: string = `
    <div class="todays-weather">${todaysWeatherHTML}</div>
    <div class="icon-and-text">${iconAndTextHTML}</div>
    <div class="forecast">${forecastHTML}</div>
  `;

  // Kontrollera att containern existerar
  if (elements.weatherContainerChild === null) {
    console.error('Cannot create new weather card!');
    throw new Error('Cannot create new weather card!');
  } else {
    // Skapa ett nytt div-element och lägg till HTML
    const cardElement = document.createElement("div");
    cardElement.innerHTML = cardContent;

    // Lägg in kortet i container
    elements.weatherContainerChild.appendChild(cardElement);
  }
};

// **ADDED MISSING FUNCTION CALL FOR INITIAL WEATHER DISPLAY** // ADDED
createCardWeather(new Date(), { weather: { cityName: DEFAULT_CITY, temperature: 0, weatherDescription: '', weatherId: 0, sunrise: '', sunset: '' }, forecast: [] }, {}, DEFAULT_CITY);


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