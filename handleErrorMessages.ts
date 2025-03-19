import {checkGeolocationSupport} from "./geolocation.ts";
let supportsGeolocation: boolean = false // should there be a default?

// Function to handle error messages
const handleErrorMessages = (error: string) => {
  console.error("Error detected:", error)

  let message = "An unexpected error occurred. Please try again."
  let messageType = "warning"
  if (!supportsGeolocation) {
    message = "Geolocation is not supported by your browser."
    messageType = "error"
  } else {
    console.error("Error fetching data:", error)
    message = "Failed to load recipes. Please try again later."
  }

  // Update the message in the HTML
  const errorContainer = document.getElementById("error-container")
  if (errorContainer) {
    errorContainer.innerHTML = `<h3>${message}</h3>`
    errorContainer.className = messageType
    errorContainer.style.display = "block"
  }
}
