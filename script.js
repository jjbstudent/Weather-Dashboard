var APIkey = "792ac91d77f6fa7880c9efaf72a400ed";

// Select the textarea element
var textarea = document.querySelector('.form-control');
var historyList = document.getElementById('history');

document.getElementById('search-button').addEventListener('click', function() {
   // Prevent the default form submission behavior
   event.preventDefault();
  // Get the city input by the user
  var city = document.getElementById('search-input').value;

  // Call a function to fetch weather data using an API (e.g., OpenWeatherMap)
  getWeatherData(city);

});

// Function to append a history button
function appendHistoryButton(city) {
  // Reference to the existing div with the ID 'history'
  var existingDiv = document.getElementById('history');

  // Create the button element
  var button = document.createElement('button');
  button.className = 'btn btn-secondary';
  button.type = 'button';
  button.innerText = city;
  button.addEventListener('click', function() {
    // Handle button click (e.g., fetch weather data for the selected city)
    getWeatherData(city);
  });

  // Append the button to the existing div with the class 'd-grid gap-2'
  existingDiv.appendChild(button);
}

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
  var weatherDataDiv = document.getElementById('weather-data');
  // Update the content of the div with the weather data
  weatherDataDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Temperature: ${data.main.temp} &deg;C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Wind: ${data.wind.speed} m/s</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
  // Append a button to the history list
  appendHistoryButton(data.name);
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentLocation()
    .then(coords => getWeatherDetails(coords.latitude, coords.longitude))
    .then(weatherData => {
      // Update the weather-data div with the current location weather data
      var weatherDataDiv = document.getElementById('weather-data');
      weatherDataDiv.innerHTML = `
        <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${weatherData.main.temp} &deg;C</p>
        <p>Weather: ${weatherData.weather[0].description}</p>
        <p>Wind: ${weatherData.wind.speed} m/s</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
      // Console any errors related to location access or API errors
    });
});


// Function to fetch weather details using OpenWeatherMap API
function getWeatherDetails(latitude, longitude) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`;

  return fetch(weatherURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
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
