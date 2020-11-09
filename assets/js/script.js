var citySelectorEl = document.querySelector("#city-submit");
var currWeatherEl = document.querySelector(".main-display")

var citySubmit = function(event) {
    event.preventDefault();
    var cityInput = document.querySelector("input").value;
    getWeather(cityInput);
};

var getWeather = function(cityName) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=221a2ad7e76ce710f1907c1731e24ff2`;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
              displayCurrent(data);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      });
};

var displayCurrent = function(cityWeather) {
    console.log(cityWeather);
    //display cities name
    
};



citySelectorEl.addEventListener("submit", citySubmit);
