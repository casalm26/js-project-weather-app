import { fetchWeatherData } from './fetchWeather';

// DOM Elements
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const lastSearched = document.getElementById('last-searched') as HTMLSpanElement;
const searchStatus = document.getElementById('search-status') as HTMLSpanElement;
const todaysWeatherContainer = document.getElementById('todays-weather-container') as HTMLElement;

// Default city if no search is performed
const DEFAULT_CITY = 'Stockholm';

// Event handler for search form submission
const handleSearch = async (event: Event): Promise<void> => {
    event.preventDefault();
    
    const city = searchInput.value.trim();
    const searchCity = city || DEFAULT_CITY;
    
    // Update debug info
    if (lastSearched) lastSearched.textContent = searchCity;
    if (searchStatus) searchStatus.textContent = 'Searching...';
    
    try {
        // Fetch weather data
        const weatherData = await fetchWeatherData(searchCity);

        // Update debug info
        if (searchStatus) searchStatus.textContent = 'Success!';

        // Display basic weather info
        if (todaysWeatherContainer) {
            todaysWeatherContainer.textContent = `${weatherData.cityName}, ${weatherData.temperature}°C, ${weatherData.weatherDescription}`;
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Update debug info
        if (searchStatus) searchStatus.textContent = 'Error!';
        if (todaysWeatherContainer) {
            todaysWeatherContainer.textContent = 'Error loading weather data';
        }
    }
};

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!searchForm || !searchInput) {
        console.error('Search form elements not found');
        return;
    }

    // Add event listener for form submission
    searchForm.addEventListener('submit', handleSearch);

    // Trigger initial search for default city
    handleSearch(new Event('submit'));
});
