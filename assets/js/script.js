let today = moment().format("MM/DD/YYYY");
const myKey = "dd013adc3cf1902b3d464ff37618387b";

let currentTempEl = document.querySelector(".current-temp");
let currentWindEl = document.querySelector(".current-wind");
let currentHumidityEl = document.querySelector(".current-humidity");
let currentUviEl = document.querySelector(".current-uvi");
let weatherCardDateEl = document.querySelector(".todays-info");

let cityInput = document.querySelector(".search-text");
let citySearchBtn = document.querySelector(".search-button");

let getWeather = function() {
  
    let city = cityInput.value;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + myKey;

    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        // console.log(response);
        response.json().then(function(data) {
          console.log(data);
          displayWeather(data)
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
}

let displayWeather = function(weatherData) {
    let lon = weatherData.coord.lon;
    let lat = weatherData.coord.lat;
    console.log(lon);
    console.log(lat);
    
    let uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myKey;
    
    fetch(uvUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        // console.log(response);
        response.json().then(function(data) {
          console.log(data);
          displayUvi(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Open Weather");
    });
    
    weatherCardDateEl.textContent = "(" + today + ")";
    let temp = weatherData.main.temp;
    let wind = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;
    currentTempEl.textContent = "Temp: " + temp;
    currentWindEl.textContent = "Wind: " + wind; 
    currentHumidityEl.textContent = "Humidity: " + humidity;
}   

let displayUvi = function(uvData) {
  let uv = uvData.current.uvi;
  currentUviEl.textContent = "UV Index: " + uv;
};

citySearchBtn.addEventListener("click",getWeather);

// update uv color function
