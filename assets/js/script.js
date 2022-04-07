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

console.log(JSON.parse(localStorage.getItem("historyArray")))

if (JSON.parse(localStorage.getItem("historyArray"))) {
  var thisHistory = JSON.parse(localStorage.getItem("historyArray"));
} else {
  var thisHistory = [];
}

var addHistory = function(city) {
  let historySearchBtn = document.createElement("button");
  historySearchBtn.className = "btn btn-secondary btn-long";
  historySearchBtn.textContent = city;
  thisHistory.push(city);
  localStorage.setItem("historyArray",JSON.stringify(thisHistory));
  searchHistoryEl.appendChild(historySearchBtn);
  historySearchBtn.addEventListener("click", getWeather);
  // needs to persist in local storage
};

// if (thisHistory.length > 0) {
//   for (let i = 0; i < thisHistory.length; i++) {
//     addHistory(thisHistory[i]);
//   }
// }

var getWeather = function(event) {
    event.preventDefault();
    console.log(event.target.innerHTML);
    // capture city input information for api call
    let city = "";
    if (cityInput.value) {
      city = cityInput.value;
      addHistory(city);

    } else {
      city = event.target.innerHTML;
    }
    
    // let city = cityInput.value;
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
    
};

var displayWeather = function(weatherData) {
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
var displayUvi = function(uvData) {
  let uv = uvData.current.uvi;
  currentUviEl.innerHTML = "UV Index: " + uv;
};

var displayForecast = function(data) {
        // clear old card info
    forecastCardContainerEl.innerHTML = "";



    for (let i =0; i < 5; i++) {
    let forecastCardEl = document.createElement("div");
    forecastCardEl.className = "forecast-card col";
    let forecastDateEl = document.createElement("p");
    let forecastImageEl = document.createElement("p");
    let forecastTempEl = document.createElement("p");
    let forecastWindEl = document.createElement("p");
    let forecastHumidEl = document.createElement("p");
    forecastDateEl.innerHTML = forecastDateArray[i];
    forecastImageEl.innerHTML = "Image: ";
    forecastTempEl.innerHTML = 
    "Temp: " + Math.round(((data.daily[i].temp.max - data.daily[i].temp.min)/2)*100)/100 + "&#186;F";
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


// wait for click on search button
citySearchBtn.addEventListener("click", getWeather);

// wait for city input 
cityInput.addEventListener("submit", getWeather);



// update uv color function