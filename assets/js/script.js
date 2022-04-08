let today = moment().format("MM/DD/YYYY");
let todayPlusOne = moment(today).add(1,'day').format("MM/DD/YYYY");
let todayPlusTwo = moment(today).add(2,'day').format("MM/DD/YYYY");
let todayPlusThree = moment(today).add(3,'day').format("MM/DD/YYYY");
let todayPlusFour = moment(today).add(4,'day').format("MM/DD/YYYY");
let todayPlusFive = moment(today).add(5,'day').format("MM/DD/YYYY");
let forecastDateArray = [todayPlusOne,todayPlusTwo,todayPlusThree,todayPlusFour,todayPlusFive];
const myKey = "dd013adc3cf1902b3d464ff37618387b";

let currentImageEl = document.querySelector(".current-image");
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

if (JSON.parse(localStorage.getItem("historyArray"))) {
  var thisHistory = JSON.parse(localStorage.getItem("historyArray"));
} else {
  var thisHistory = [];
}

var createHistoryButton = function(city) {
  let historySearchBtn = document.createElement("button");
  historySearchBtn.className = "btn btn-secondary btn-secondary history-button";
  historySearchBtn.setAttribute("style","overflow:hidden;resize:none");
  historySearchBtn.setAttribute("type","submit");
  historySearchBtn.textContent = city;
  searchHistoryEl.appendChild(historySearchBtn);
  historySearchBtn.addEventListener("click", getWeather);
}

var addHistory = function(city) {
  createHistoryButton(city); 
  thisHistory.push(city);
  localStorage.setItem("historyArray",JSON.stringify(thisHistory));
};

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
// update uv color function
var displayWeather = function(weatherData) {
    // clear info
    currentImageEl.innterHTML = "";
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
    fetch(uvUrl)
    .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
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
  let source = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
  currentImageEl.setAttribute("src",source);
  currentTempEl.innerHTML = "Temp: " + temp + " &#186;F";
  currentWindEl.innerHTML = "Wind: " + wind + " MPH"; 
  currentHumidityEl.innerHTML = "Humidity: " + humidity + "%";
};   
// function for displaying uv data from the api response with uv data
var displayUvi = function(uvData) {
  let uv = uvData.current.uvi;
  currentUviEl.innerHTML = "UV Index: " + uv;
};

var displayForecast = function(data) {
        // clear old card info
    forecastCardContainerEl.innerHTML = "";
    console.log(data);
    for (let i =0; i < 5; i++) {
    let forecastCardEl = document.createElement("div");
    forecastCardEl.className = "forecast-card col-3 col-md-4 col-lg bg-info";
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

for (let i = 0; i < thisHistory.length; i++) {
  createHistoryButton(thisHistory[i]);
}
// wait for click on search button
citySearchBtn.addEventListener("click", getWeather);

// wait for city input 
cityInput.addEventListener("submit", getWeather);