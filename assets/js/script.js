let currentTempEl = document.querySelector(".current-temp");
let currentWindEl = document.querySelector(".current-wind");
let currentHumidityEl = document.querySelector(".current-humidity");
let currentUviEl = document.querySelector(".current-uvi");

const myKey = "dd013adc3cf1902b3d464ff37618387b";

let getCoordinates = function(inputCity) {
    let lat = "";
    let lon = "";
    let coordinates = [lat, lon];
    // find a way to get coordinates from city input
    return coordinates;
}

let getWeather = function(coordinates) {
    let lat = "33.44";
    let lon = "-94.04";

    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&units=imperial&appid=" + myKey;
    
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
    let temp = weatherData.current.temp;
    let wind = weatherData.current.wind_speed;
    let humidity = weatherData.current.humidity;
    let uv = weatherData.current.uvi;
    currentTempEl.textContent = "Temp: " + temp;
    currentWindEl.textContent = "Wind: " + wind; 
    currentHumidityEl.textContent = "Humidity: " + humidity;
    currentUviEl.textContent = "UV Index: " + uv;
}   

getWeather();
