import { fetchForecastData } from "./fetchWeather";

const renderForecast = (city: string): void => {
  const forecastContainer: HTMLElement | null = document.getElementById("forecast-container");

  if (!forecastContainer) return;
  forecastContainer.innerHTML = "";

  // GETTING FORECAST DATA from fetchWeather.ts
  fetchForecastData(city)
    .then((forecastData: { date: string; temperature: number }[]) => {
      forecastData.forEach((day) => {
        const row: HTMLDivElement = document.createElement("div");
        row.classList.add("forecast-row");
        row.innerHTML = `
          <span class="day">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()}</span>
          <span class="temp">${day.temperature}°</span>
        `;
        forecastContainer?.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
};
