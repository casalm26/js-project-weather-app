// Function to get DOM elements by ID
const getElement = (id: string): HTMLElement | null =>
  document.getElementById(id)

// DOM ELEMENTS
const elements = {
  weatherContainer: getElement("weather-container")
}

// GLOBAL VARIABLES
let currentCity: string = ""

// Function to check geolocation support
const checkGeolocationSupport = () => {
  console.log("Checking geolocation support...")
  let supportsGeolocation: boolean
  if (navigator.geolocation) {
    return (supportsGeolocation = true)
  } else {
    return (supportsGeolocation = false)
  }
}

// Function to get the position from the geolocation API
const getPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

// Function to get city name via the method reverse geocode
const getCityName = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch city name")
    }

    const data = await response.json()
    console.log("Fetched city data:", data)

    return data.city || "Unknown City"
  } catch (error) {
    console.error("Error getting city name:", error)
    return "Unknown City" // Return a standard value if something goes wrong
  }
}
