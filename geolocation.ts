//DOM
// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null =>
  document.getElementById(id)

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container")
}

let currentCity = ""

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error)
  } else {
    elements.weatherContainer.innerHTML =
      "Geolocation is not supported by this browser."
  }
}

const success = (city: string) => {
  currentCity = "" // Add API answer
  return currentCity
}

const error = () => {
  alert("Sorry, no position available.")
}
