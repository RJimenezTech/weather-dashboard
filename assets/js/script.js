let today = moment().format("MM/DD/YYYY");
const myKey = "dd013adc3cf1902b3d464ff37618387b";

let currentTempEl = document.querySelector(".current-temp");
let currentWindEl = document.querySelector(".current-wind");
let currentHumidityEl = document.querySelector(".current-humidity");
let currentUviEl = document.querySelector(".current-uvi");
let weatherCardDateEl = document.querySelector(".todays-info");
let cityInput = document.querySelector(".search-text");
let citySearchBtn = document.querySelector(".search-button");
let searchHistoryEl = document.querySelector(".search-history");

let addHistory = function(event) {
  let city = cityInput.value;
  let historyBtn = document.createElement("button");
  historyBtn.className = "btn btn-secondary btn-long";
  historyBtn.textContent = city;
  searchHistoryEl.appendChild(historyBtn);
}

let getWeather = function() {
    // capture city input information for api call
    let city = cityInput.value;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + myKey;
    console.log(apiUrl)
    // request api information
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          console.log(data);
          displayWeather(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
};

let displayWeather = function(weatherData) {
    // take weather data as input
    // use weatherData to find the lat and lon of the input city
    let lon = weatherData.coord.lon;
    let lat = weatherData.coord.lat;
    // use lat and lon in api call
    let uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myKey;
    // retrieve info from this new api url
    fetch(uvUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        // console.log(response);
        response.json().then(function(data) {
          console.log(data);
          // display UVI information that wasn't previously retrieved
          displayUvi(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
    // update current weather info
    weatherCardDateEl.textContent = "Current weather in: " + weatherData.name + " (" + today + ")";
    // clear input info
    cityInput.value = "";// using weatherData display the information
    let temp = weatherData.main.temp;
    let wind = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;
    currentTempEl.textContent = "Temp: " + temp;
    currentWindEl.textContent = "Wind: " + wind; 
    currentHumidityEl.textContent = "Humidity: " + humidity;
};   
// function for displaying uv data from the api response with uv data
let displayUvi = function(uvData) {
  let uv = uvData.current.uvi;
  currentUviEl.textContent = "UV Index: " + uv;
};
// wait for click on search button
citySearchBtn.addEventListener("click", getWeather);
citySearchBtn.addEventListener("click", addHistory)
// wait for city input 
cityInput.addEventListener("submit", getWeather);
cityInput.addEventListener("submit", addHistory);

// update uv color function