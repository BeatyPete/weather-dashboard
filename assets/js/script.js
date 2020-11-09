var citySelectorEl = document.querySelector("#city-submit");
var currWeatherEl = document.querySelector(".main-display")

var citySubmit = function(event) {
    event.preventDefault();
    var cityInput = document.querySelector("input").value;
    getWeather(cityInput);
};

var getWeather = function(cityName) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=221a2ad7e76ce710f1907c1731e24ff2`;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
              getUV(data);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      });
};

var getUV = function(cityWeather) {
    var lat = cityWeather.coord.lat;
    var lon = cityWeather.coord.lon;
    var apiUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=221a2ad7e76ce710f1907c1731e24ff2`;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
              displayCurrent(cityWeather, data);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      });
};

var displayCurrent = function(cityWeather, uv) {
    currWeatherEl.innerHTML = "";
    console.log(uv);
    //get date for city and turn into moment
    var date = moment.unix(cityWeather.dt).format("(M/DD/YYYY)");
    //display city name and current date
    var cityNameEl = document.createElement("h2");
    cityNameEl.classList = "card-title";
    cityNameEl.innerHTML = `${cityWeather.name} ${date}`;
    currWeatherEl.appendChild(cityNameEl);
    //display temp
    var tempEl = document.createElement("p");
    tempEl.innerHTML = `Temperature: ${cityWeather.main.temp} &deg;F`;
    currWeatherEl.appendChild(tempEl);
    //display humidity
    var humidEl = document.createElement("p");
    humidEl.innerHTML = `Humidity: ${cityWeather.main.humidity}%`;
    currWeatherEl.appendChild(humidEl);
    //display wind
    var windEl = document.createElement("p");
    windEl.innerHTML = `Wind Speed: ${cityWeather.wind.speed} MPH`;
    currWeatherEl.appendChild(windEl);
    //display uv
    var uvEl = document.createElement("p");
    uvEl.innerHTML = "UV Index: ";
    var uvBadge = document.createElement("span");
    uvBadge.innerHTML = uv.value;
    uvEl.appendChild(uvBadge);
    if (uv.value < 3) {
        uvBadge.classList = "badge bg-success";
    }
    else if (uv.value >= 3 && uv.value < 7) {
        uvBadge.classList = "badge bg-warning";
    }
    else if (uv.value >= 7) {
        uvBadge.classList = "badge bg-danger";
    };
    currWeatherEl.appendChild(uvEl);
};



citySelectorEl.addEventListener("submit", citySubmit);
