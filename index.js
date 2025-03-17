// Function to get DOM elements by ID
const getElement = (id) => document.getElementById(id)

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container"),
};



createWeatherCard = (weather) => {
  const weatherCard = `
    <div class="weather-content">
      <div style="position: relative;">
                    {/* Shows temperature, sunrise and sunset and weather description,  */}
          <div class="today-info"> 
          <img id="weather-icon" src="" alt="">
          <div class="weather-description">
          <div class="weather-forecast">
              <h4>City</h4>
              <ul>
                Day 1 weather
                Day 2 weather
                Day 3 weather
                Day 4 weather
              </ul>
          </div>
      </div>
    </div>
    `;
};