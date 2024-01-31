var APIkey = "792ac91d77f6fa7880c9efaf72a400ed";

// Select the textarea element
var textarea = document.querySelector('.form-control');

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

// Function to fetch weather details using OpenWeatherMap API
function getWeatherDetails(latitude, longitude) {
  const weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`;

  return fetch(weatherURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
}

// Fetch current location coordinates and then fetch weather details
getCurrentLocation()
  .then(coords => getWeatherDetails(coords.latitude, coords.longitude))
  .then(weatherData => {
    // Update my text area 
    textarea.value = `City: ${weatherData.name}\n` +
                     `Date: ${new Date().toLocaleDateString()}\n` +
                     `Temperature: ${weatherData.main.temp}°C\n` +
                     `Wind: ${weatherData.wind.speed} m/s\n` +
                     `Humidity: ${weatherData.main.humidity}%`;
  })
  .catch(error => {
    console.error('Error:', error);
    // console any error is relationto location access or API errors
  });