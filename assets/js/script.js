// api key and date info is initiated
let today = moment().format("MM/DD/YYYY");
let todayPlusOne = moment(today).add(1,'day').format("MM/DD/YYYY");
let todayPlusTwo = moment(today).add(2,'day').format("MM/DD/YYYY");
let todayPlusThree = moment(today).add(3,'day').format("MM/DD/YYYY");
let todayPlusFour = moment(today).add(4,'day').format("MM/DD/YYYY");
let todayPlusFive = moment(today).add(5,'day').format("MM/DD/YYYY");
let forecastDateArray = [todayPlusOne,todayPlusTwo,todayPlusThree,todayPlusFour,todayPlusFive];
const myKey = "dd013adc3cf1902b3d464ff37618387b";
// create dom elements for various output sections on page
// let currentImageEl = document.querySelector(".current-image");
let weatherCardEl = document.querySelector(".current-weather");
let currentTempEl = document.querySelector(".current-temp");
let currentWindEl = document.querySelector(".current-wind");
let currentHumidityEl = document.querySelector(".current-humidity");
let currentTextEl = document.querySelector(".current-uvi");
let currentUvButtonEl = document.createElement("span");
let weatherCardDateEl = document.querySelector(".todays-info");
weatherCardDateEl.textContent = "Today is: " + today;
let cityInput = document.querySelector(".search-text");
let citySearchBtn = document.querySelector(".search-button");
let searchHistoryEl = document.querySelector(".search-history");
let forecastCardContainerEl = document.querySelector(".forecast-card-container");
// use thisHistory array, populate with local storage history if present
if (JSON.parse(localStorage.getItem("historyArray"))) {
  var thisHistory = JSON.parse(localStorage.getItem("historyArray"));
} else {
  var thisHistory = [];
}
// adds history button given an input city
var createHistoryButton = function(city) {
  let historySearchBtn = document.createElement("button");
  historySearchBtn.className = "btn btn-secondary btn-secondary history-button";
  historySearchBtn.setAttribute("style","overflow:hidden;resize:none");
  historySearchBtn.setAttribute("type","submit");
  historySearchBtn.textContent = city;
  searchHistoryEl.appendChild(historySearchBtn);
  historySearchBtn.addEventListener("click", getWeather);
}
// updates history in local storage
var addHistory = function(city) {
  createHistoryButton(city); 
  thisHistory.push(city);
  localStorage.setItem("historyArray",JSON.stringify(thisHistory));
};
// calls weather api
var getWeather = function(event) {
  event.preventDefault();
  // capture city input information for api call
  let city = "";
  if (cityInput.value) {
    city = cityInput.value;
    addHistory(city);
  } else {
    city = event.target.innerHTML;
  }
  
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + myKey;
  // request api information
  fetch(apiUrl).then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          // use this data to display current weather info
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
// calls weather api to find uvi info and to update weather info
var displayWeather = function(weatherData) {
    // clear info
    currentTempEl.innerHTML = "";
    currentWindEl.innerHTML = "";
    currentHumidityEl.innerHTML = "";
    currentTextEl.innerHTML = "";
    // take weather data as input
    // use weatherData to find the lat and lon of the input city
    let lon = weatherData.coord.lon;
    let lat = weatherData.coord.lat;
    // use lat and lon in api call
    let uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myKey;
    fetch(uvUrl)
    .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        // use this data to get/display uvi info
        displayUvi(data);
        // use this data to get/display forecast
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
  cityInput.value = "";
  // using weatherData display the information
  let temp = weatherData.main.temp;
  let wind = weatherData.wind.speed;
  let humidity = weatherData.main.humidity;
  let currentImageEl = document.createElement("img");
  let source = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + ".png";
  currentImageEl.setAttribute("src",source);
  weatherCardDateEl.appendChild(currentImageEl)
  currentTempEl.innerHTML = "Temp: " + temp + " &#186;F";
  currentWindEl.innerHTML = "Wind: " + wind + " MPH"; 
  currentHumidityEl.innerHTML = "Humidity: " + humidity + "%";
};   
// function for displaying uv data from the api response with uv data
var displayUvi = function(uvData) {
  currentTextEl.innerHTML = "UV Index: ";
  currentUvButtonEl.innerHTML = uvData.current.uvi;
  updateUvColor(uvData.current.uvi)
  currentTextEl.appendChild(currentUvButtonEl);
};
// function that adds a color class to uv index
var updateUvColor = function (uvIndex) {
  if (uvIndex >= 0 && uvIndex <= 2.99) {
    currentUvButtonEl.className = "uvi-class green";
  } 
  if (uvIndex >= 3 && uvIndex <= 4.99) {
    currentUvButtonEl.className = "uvi-class yellow";
  }
  if (uvIndex >= 5 && uvIndex <= 6.99) {
    currentUvButtonEl.className = "uvi-class orange";
  }
  if (uvIndex >= 7 && uvIndex <= 9.99) {
    currentUvButtonEl.className = "uvi-class red";
  }
  if (uvIndex >= 10) {
    currentUvButtonEl.className = "uvi-class purple";
  }
}
// calls weather api and displays relevant info on forecast cards
var displayForecast = function(data) {
        // clear old card info
    forecastCardContainerEl.innerHTML = "";
    console.log(data);
    for (let i =0; i < 5; i++) {
    let forecastCardEl = document.createElement("div");
    forecastCardEl.className = "forecast-card col-xs-5 col-md-4 col-lg bg-info";
    let forecastDateEl = document.createElement("p");
    let forecastImageEl = document.createElement("img");
    let source = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
    forecastImageEl.setAttribute("src",source);
    let forecastTempEl = document.createElement("p");
    let forecastWindEl = document.createElement("p");
    let forecastHumidEl = document.createElement("p");
    forecastDateEl.className = "forecast-date bold"
    forecastDateEl.innerHTML = forecastDateArray[i];
    forecastImageEl.innerHTML = "Image: ";
    forecastTempEl.innerHTML = 
    "Temp: " + data.daily[i].temp.day + "&#186;F";
    forecastWindEl.innerHTML = "Wind: " + data.daily[i].wind_speed + " MPH";
    forecastHumidEl.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
    forecastCardEl.appendChild(forecastDateEl);
    forecastCardEl.appendChild(forecastImageEl);
    forecastCardEl.appendChild(forecastTempEl)
    forecastCardEl.appendChild(forecastWindEl)
    forecastCardEl.appendChild(forecastHumidEl);
    forecastCardContainerEl.appendChild(forecastCardEl);
  }
}
// populate the search history with contents of local storage
for (let i = 0; i < thisHistory.length; i++) {
  createHistoryButton(thisHistory[i]);
}
// wait for click on search button
citySearchBtn.addEventListener("click", getWeather);
// wait for city input 
cityInput.addEventListener("submit", getWeather);
