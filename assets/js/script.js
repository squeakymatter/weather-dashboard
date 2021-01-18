//user input
var inputEl = document.querySelector('#search');
//search history will be appended here
var searchHistoryEl = document.querySelector('#search-history-buttons');
var searchForm=document.querySelector('#city-search-form');
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];

// DOM elements for today's weather
var currentCityAndDateEl = document.querySelector('#current-city');
var currentDateEl = document.querySelector('#date-today');
var currentTempEl = document.querySelector('#temp-today');
var currentHumidityEl = document.querySelector('#humidity-today');
var currentWindSpeedEl = document.querySelector('#windspeed-today');
var currentWeatherIconEl = document.querySelector('#weather-icon-today');
var currentUVIndexEl = document.querySelector('#uv-today');
var currentWeatherSectionEl = document.querySelector('#current-weather');
var searchField = document.querySelector('#search');
//DOM Elements for forecast
var forecastEl = document.querySelector('#forecast-cards');

//URL for current weather
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
//URL for 5 day forecast
var apiForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
//API query parameters
var apiUvUrl = 'https://api.openweathermap.org/data/2.5/uvi';
var units = '&units=imperial';
var apiKey = '&appid=dfd70fe025fe63321e2acd91e52a5ebf';

//variable to store searched city
var cityHistory = [];

var formSubmitHandler = function (event) {
  event.preventDefault();
  var city = inputEl.value;
	console.log(city);
  getCurrentWeather(city);
  getForecast(city);
  cityHistory.unshift({ city });
  city.value = '';

  saveSearchToLocalStorage();
	(city);
	searchHistory(city);
};

var saveSearchToLocalStorage = function () {
  localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
};

//fetch the current weather from API

var getCurrentWeather = function (city) {
	apiUrl = apiUrl + city + units + apiKey;
	console.log(apiUrl);
  // get today's forecast
	fetch(apiUrl)
	.then(function(response) {
    response.json()
      .then(function(data) {
				console.log(data);
        displayCurrentWeather(data, city);
      })
      .catch(function (error) {
        alert('Not found. Please try again.', error);
      });
  });
};

var displayCurrentWeather = function (response, searchCity) {
  //clear existing content
  currentWeatherSectionEl.textContent = '';

  //add city to searchField
  searchField.textContent = searchCity;
  console.log(response);

  //create the h3 to hold the city name

  var currentCityName = document.createElement('h3');
  currentCityName.textContent = searchCity;
  currentWeatherSectionEl.appendChild(currentCityName);

  //date to human readable format
  var dateTodayEl = document.createElement('span');
  var dateFormat = new Date(data.dt * 1000).toLocaleDateString();
  dateTodayEl.textContent = '(' + dateFormat + ')';
  currentCityName.appendChild(dateTodayEl);

  //create current weather icon
  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  var icon = data.weather[0].icon;
  var imgEl = document.createElement('img');
  imgEl.setAttribute('src', iconUrl);
  imgEl.setAttribute('width', '50');
  imgEl.setAttribute('height', '50');
  dateTodayEl.appendChild(imgEl);

  //get temp, humidity, windspeed
  var { temp, humidity } = data.main;
  var { temp, humidity } = data.main;
  var windSpeed = data.wind.speed;

  //create a temp element
  var currentTempEl = document.createElement('p');
  currentTempEl.textContent = 'Temperature: ' + temp + ' °F';
  currentWeatherSectionEl.appendChild(currentTempEl);

  //create a humidity Element

  var currentHumidityEl = document.createElement('p');
  currentHumidityEl.textContent = 'Humidity: ' + humidity + '%';
  currentWeatherSectionEl.appendChild(currentHumidityEl);

  //create a windspeed Element
  var currentHumidity = document.createElement('p');
  currentWindSpeedEl.textContent = 'Windspeed: ' + windSpeed + ' MPH';
  currentWeatherSectionEl.appendChild(currentWindSpeedEl);

  var lat = data.coord.lat;
  var lon = data.coord.long;
  fetchUvInfo(lat, lon);
};

var fetchUvInfo = function (lat, lon) {
  fetch(apiUvUrl + apiKey + lat + lon).then(function (response) {
    response.json().then(function (data) {
      displayUVIndex(data);
      console.log(data);
    });
  });
};

var displayUVInfo = function (index) {
  var uvIndexEl = document.createElement('p');
  uvVal.textContent = 'UV Index: ';

  uvVal = document.createElement('span');
  uvVal.textContent = index.value;

  if (index.value <= 2) {
    uvVal.classList = 'favorable';
  } else if (index.value > 2 && index.value <= 8) {
    uvVal.classList = 'moderate ';
  } else if (index.value > 8) {
    uvVal.classList = 'severe';
  }
};

var getForecast = function (city) {
	apiForecastUrl = apiForecastUrl + city + units + apiKey
	console.log(apiForecastUrl);
  fetch(apiForecastUrl).then(function (response) {
    response.json().then(function (data) {
      displayForecast(data);
      console.log(data);
    });
  });
};

var displayForecast = function (data) {
  forecastEl.textContent = '';
  var forecast = data.list;
  for (var i = 5; i < forecast.length; i = i++) {
    var dailyForecast = forecast[i];
    var forecastEl = document.createElement('div');
    forecastEl.classList = 'card-body bg-primary text-light text-center';
    forecastEl.appendChild(forecastDate);

    //create date element
    var forecastCardDate = document.createElement('h5');
    forecastCardDate.classList = 'card-title';

    //create an icon element

    var forecastIcon = document.createElement('img');
    forecastIcon.classList = 'text-center';
    forecastIcon.setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );
    img.setAttribute('width', '50');
    img.setAttribute('height', '50');

    //append forecastIcon to card
    forecastEl.appendChild(forecastIcon);

    //create temperature

    var forecastTemp = document.createElement('p');
    forecast.classList - 'text-center';
    forecastTemp.textContent = dailyForecast.main.temp + '° F';
    //append to forecast card
    forecastEl.appendChild(forecastTemp);

    var forecastDate = document.createElement('h5');
    forecastDate.textContent = new Date(dailyForecast.dt).toLocaleDateString();
    forecastDate.classList = 'card-header text-center';
    forecastEl.appendChild(forecastDate);

    //create an image element
    var weatherIcon = document.createElement('img');
    weatherIcon.classList = 'card-body text-center';
    weatherIcon.setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    //append to forecast card
    forecastEl.appendChild(weatherIcon);

    //create temperature span
    var forecastTempEl = document.createElement('span');
    forecastTempEl.classList = 'card-body text-center';
    forecastTempEl.textContent = dailyForecast.main.temp + ' °F';

    //append to forecast card
    forecastEl.appendChild(forecastTempEl);

    var forecastHumEl = document.createElement('span');
    forecastHumEl.classList = 'card-body text-center';
    forecastHumEl.textContent = dailyForecast.main.humidity + '  %';

    //append to forecast card
    forecastEl.appendChild(forecastHumEl);

    // console.log(forecastEl);
    //append to five day container
    forecastContainerEl.appendChild(forecastEl);
  }
};

var searchHistory = function(searchHistory) {
	searchHistoryBtn = document.createElement('button');
  searchHistoryBtn.textContent = searchHistory;
  searchHistoryBtn.classList = 'list-group-item';
  searchHistoryBtn.setAttribute('data-city', searchHistory);
  searchHistoryBtn.setAttribute('type', 'submit');
	searchHistoryBtn.prepend(searchHistoryEl)


}

var searchHistoryHandler = function (event) {
  
};

searchForm.addEventListener('submit', formSubmitHandler);
searchHistoryEl.addEventListener("click", searchHistoryHandler);












