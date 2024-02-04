var APIkey = "792ac91d77f6fa7880c9efaf72a400ed";

// Select the textarea element
var textarea = document.querySelector('.form-control');

document.getElementById('search-button').addEventListener('click', function() {
  // Get the city input by the user
  var city = document.getElementById('search-input').value;

  // Call a function to fetch weather data using an API (e.g., OpenWeatherMap)git 
  getWeatherData(city);
});

function getWeatherData(city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIkey;

  // Make a fetch request to the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Handle the retrieved weather data
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function displayWeatherData(data) {
  var weatherDataTextarea = document.getElementById('weather-data');

  // Update the content of the textarea with the weather data
  weatherDataTextarea.value = `
    City: ${data.name}
    Date: ${new Date().toLocaleDateString()}
    Temperature: ${data.main.temp} °C
    Wind: ${data.wind.speed} m/s
    Humidity: ${data.main.humidity}%
  `;
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
    // console any error is relation to location access or API errors
  });