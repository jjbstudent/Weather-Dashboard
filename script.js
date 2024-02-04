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
// Function to fetch and display 5-day forecast for the user input city
async function fetchAndDisplayForecast(city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric`;

  try {
    // Fetch data from the OpenWeatherMap API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Reference to the forecast cards container
    var forecastCardsContainer = document.getElementById('forecastCards');

    // Clear existing content in the container
    forecastCardsContainer.innerHTML = '';

    // Group the forecast data by date
    const groupedData = groupBy(data.list, item => item.dt_txt.split(' ')[0]);

    // Loop through the grouped data groupedData is an object with date keys
    Object.keys(groupedData).slice(0, 5).forEach(date => {
      // Take the first item of each day for simplicity
      const dayData = groupedData[date][0];

      // Extract relevant data for each day from apiURL
      const temp = dayData.main.temp;
      const windSpeed = dayData.wind.speed;
      const humidity = dayData.main.humidity;

      // Create a card element
      var card = document.createElement('div');
      card.className = 'card m-2';
      card.style = 'width: 18rem;';

      // Set the card content
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Date: ${date}</h5>
          <p>Temperature: ${temp} &deg;C</p>
          <p>Wind: ${windSpeed} m/s</p>
          <p>Humidity: ${humidity}%</p>
        </div>
      `;

      // Append the card to the forecast container
      forecastCardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Helper function to group an array by a key function
function groupBy(array, keyFn) {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    result[key] = result[key] || [];
    result[key].push(item);
    return result;
  }, {});
}


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

document.addEventListener('DOMContentLoaded', function () {
  getCurrentLocation()
    .then(coords => {
      // Fetch and display current weather data
      getWeatherDetails(coords.latitude, coords.longitude)
        .then(weatherData => {
          var weatherDataDiv = document.getElementById('weather-data');
          weatherDataDiv.innerHTML = `
            <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Temperature: ${weatherData.main.temp} &deg;C</p>
            <p>Weather: ${weatherData.weather[0].description}</p>
            <p>Wind: ${weatherData.wind.speed} m/s</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
          `;

          // Append a history button for the current location
          appendHistoryButton(weatherData.name);

          // Fetch and display 5-day forecast for the current location
          fetchAndDisplayForecast(weatherData.name);
        })
        .catch(error => {
          console.error('Error fetching current weather data:', error);
        });
    })
    .catch(error => {
      console.error('Error getting current location:', error);
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
