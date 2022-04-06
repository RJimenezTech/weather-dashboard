let today = moment().format("MM/DD/YYYY");
const myKey = "dd013adc3cf1902b3d464ff37618387b";

let currentTempEl = document.querySelector(".current-temp");
let currentWindEl = document.querySelector(".current-wind");
let currentHumidityEl = document.querySelector(".current-humidity");
let currentUviEl = document.querySelector(".current-uvi");
let weatherCardDateEl = document.querySelector(".todays-info");
weatherCardDateEl.textContent = "Today is: " + today;
let cityInput = document.querySelector(".search-text");
let citySearchBtn = document.querySelector(".search-button");
let searchHistoryEl = document.querySelector(".search-history");
let forecastCardContainerEl = document.querySelector(".forecast-card-container");

let addHistory = function(event) {
  let city = cityInput.value;
  let historyBtn = document.createElement("button");
  historyBtn.className = "btn btn-secondary btn-long";
  historyBtn.textContent = city;
  searchHistoryEl.appendChild(historyBtn);
  // needs to persist in local storage
};

let getWeather = function(event) {
    event.preventDefault();
    // capture city input information for api call
    let city = cityInput.value;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + myKey;
    // request api information
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          // console.log(response);
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
    addHistory();
};

let displayWeather = function(weatherData) {
    // clear info
    currentTempEl.innerHTML = "";
    currentWindEl.innerHTML = "";
    currentHumidityEl.innerHTML = "";
    currentUviEl.innerHTML = "";
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
        displayUvi(data);
        displayForecast(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    alert("Unable to connect to Open Weather");
  });
    // update current weather info
    weatherCardDateEl.textContent = weatherData.name + " (" + today + ")";
    // clear input info
    cityInput.value = "";// using weatherData display the information
    let temp = weatherData.main.temp;
    let wind = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;
    currentTempEl.innerHTML = "Temp: " + temp + " &#186;F";
    currentWindEl.innerHTML = "Wind: " + wind + " MPH"; 
    currentHumidityEl.innerHTML = "Humidity: " + humidity + "%";
};   
// function for displaying uv data from the api response with uv data
let displayUvi = function(uvData) {
  let uv = uvData.current.uvi;
  currentUviEl.innerHTML = "UV Index: " + uv;
};

let displayForecast = function(data) {
    // clear old card info
    forecastCardContainerEl.innerHTML = "";
     
    for (let i =0; i < 5; i++) {
    let forecastCardEl = document.createElement("div");
    forecastCardEl.className = "forecast-card col";
    let forecastDateEl = document.createElement("p");
    let forecastTempEl = document.createElement("p");
    let forecastWindEl = document.createElement("p");
    let forecastHumidEl = document.createElement("p");
    forecastDateEl.innerHTML = data.daily[i].dt;
    forecastTempEl.innerHTML = 
    Math.round(((data.daily[i].temp.max - data.daily[i].temp.min)/2)*100)/100 + "&#186;F";
    forecastWindEl.innerHTML = data.daily[i].wind_speed + " MPH";
    forecastHumidEl.innerHTML = data.daily[i].humidity + "%";
    forecastCardEl
      .appendChild(forecastDateEl)
      .appendChild(forecastTempEl)
      .appendChild(forecastWindEl)
      .appendChild(forecastHumidEl);
    forecastCardContainerEl.appendChild(forecastCardEl);
  }
}
// wait for click on search button
citySearchBtn.addEventListener("click", getWeather);

// wait for city input 
cityInput.addEventListener("submit", getWeather);


// update uv color function