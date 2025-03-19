import { fetchForecastData } from "./fetchWeather.js";
const renderForecast = (city) => {
    const forecastContainer = document.getElementById("forecast-container");
    if (!forecastContainer) {
        console.warn("⚠️ forecastContainer not found in the DOM!");
        return;
    }
    forecastContainer.innerHTML = "";
    console.log(`🔍 Fetching forecast data for: ${city}`);
    // Hämta prognosdata
    fetchForecastData(city)
        .then((forecastData) => {
        console.log("✅ API Response:", forecastData);
        // Om datan är tom, logga en varning
        if (!forecastData.length) {
            console.warn(`⚠️ No forecast data available for ${city}`);
            forecastContainer.innerHTML = `<p>No forecast available for ${city}.</p>`;
            return;
        }
        forecastData.forEach((day) => {
            console.log(`📅 Forecast for ${day.date}: ${day.temperature}°C`);
            const row = document.createElement("div");
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
