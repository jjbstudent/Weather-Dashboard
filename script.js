var APIkey = "792ac91d77f6fa7880c9efaf72a400ed";

// Select the textarea and other HTML elements
var textarea = document.querySelector('.form-control');

// Function to fetch weather details using OpenWeatherMap API
function getWeatherDetailsByCity(city) {
  // Use OpenWeatherMap's Geocoding API to get latitude and longitude
  var geocodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`;

  return fetch(geocodingURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(geocodingData => {
      if (geocodingData.length === 0) {
        throw new Error('City not found');
      }

      // Extract latitude and longitude from geocoding data
      const { lat, lon } = geocodingData[0];

      // Call getWeatherDetails with the obtained coordinates
      return getWeatherDetails(lat, lon);
    });
}

// Function to fetch weather details using OpenWeatherMap API
function getWeatherDetails(latitude, longitude) {
  var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`;

  return fetch(weatherURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
}

// Function to update textarea with weather details
function updateWeatherDetails(weatherData) {
  textarea.value = `City: ${weatherData.name}\n` +
                   `Date: ${new Date().toLocaleDateString()}\n` +
                   `Temperature: ${weatherData.main.temp}°C\n` +
                   `Wind: ${weatherData.wind.speed} m/s\n` +
                   `Humidity: ${weatherData.main.humidity}%`;
}

// Function to get my current location coordinates using Geolocation API
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        reject(error);
      }
    );
  });
}
// Fetch weather details for the current location on page load
getCurrentLocation()
  .then(coords => getWeatherDetails(coords.latitude, coords.longitude))
  .then(weatherData => {
    // Update textarea with weather details for the current location
    updateWeatherDetails(weatherData);
  })
  .catch(error => {
    console.error('Error:', error);
    // Console any error in relation to location access or API errors
  });
