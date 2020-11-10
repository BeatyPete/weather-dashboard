var histList = [];

var citySelectorEl = document.querySelector("#city-submit");
var currWeatherEl = document.querySelector(".main-display")
var listContainer = document.querySelector(".hist-list")
var dailyContainer = document.querySelector(".daily-display")

var citySubmitHandler = function(event) {
    event.preventDefault();
    var cityInput = document.querySelector("input").value;
    citySelectorEl.reset();
    getWeather(cityInput);
};

var histSubmit = function(event) {
    var targetEl = event.target;
    if (targetEl.matches(".list-group-item")) {
        var cityName = targetEl.textContent;
        getWeather(cityName);
    }
};

var getWeather = function(cityName) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=221a2ad7e76ce710f1907c1731e24ff2`;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
              getUV(data);
              getDailyWeather(data);
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

var getDailyWeather = function(cityWeather) {
    var lat = cityWeather.coord.lat;
    var lon = cityWeather.coord.lon;
    var apiUrl = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current&units=imperial&appid=221a2ad7e76ce710f1907c1731e24ff2`;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
              displayDaily(data);
          });
        } else {
          alert("Error: " + response.statusText);
        }
    });
};

var displayCurrent = function(cityWeather, uv) {
    currWeatherEl.innerHTML = "";
    //get date for city and turn into moment
    var date = moment.unix(cityWeather.dt).format("(M/DD/YYYY)");
    //display city name and current date
    var cityNameEl = document.createElement("h2");
    cityNameEl.classList = "card-title";
    cityNameEl.innerHTML = `${cityWeather.name} ${date} <img src="http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png">`;
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
    //add displayed city to history
    addHistory(cityWeather.name);
};

var displayDaily = function(dailyWeather) {
    dailyContainer.innerHTML = "";
    console.log(dailyWeather);
    for (i=0; i < 5; i++) {
        var date = moment.unix(dailyWeather.daily[i].dt).format("(M/DD/YYYY)");
        var icon = `http://openweathermap.org/img/wn/${dailyWeather.daily[i].weather[0].icon}@2x.png`
        var cardContainer = document.createElement("div");
        cardContainer.classList = "card col mx-3 bg-primary text-white";
        dailyContainer.appendChild(cardContainer);
        var cardBody = document.createElement("div");
        cardBody.classList = "card-body";
        cardBody.innerHTML = `<h4 class="card-title">${date}</h4><img src="${icon}"><p>Temp: ${dailyWeather.daily[i].temp.day} &deg;F</p><p>Humidity: ${dailyWeather.daily[i].humidity}%</p>`;
        cardContainer.appendChild(cardBody);
    };
}; 

var addHistory = function(cityName) {
    //check if inserted name is already in history
    if (histList.indexOf(cityName) !== -1) {
        return;
    }
    else {
        //create history list item
        var historyEl = document.createElement("li");
        historyEl.classList = "list-group-item";
        historyEl.innerHTML = cityName;
        listContainer.appendChild(historyEl);
        //add list item to history array
        histList.push(cityName);
        //save history
        localStorage.setItem("historyList", JSON.stringify(histList));
    }
};   

var loadHistory = function() {
    if (window.localStorage.length < 1) {
        return;
    }
    else {
        var hist = localStorage.getItem("historyList");
        hist = JSON.parse(hist);
        histList = hist;
        for (i = 0; i < histList.length; i++) {
            var historyEl = document.createElement("li");
            historyEl.classList = "list-group-item";
            historyEl.innerHTML = histList[i];
            listContainer.appendChild(historyEl);
        }
    }
};



citySelectorEl.addEventListener("submit", citySubmitHandler);
listContainer.addEventListener("click", histSubmit);

loadHistory();