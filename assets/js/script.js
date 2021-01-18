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
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
//URL for 5 day forecast
var apiForecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=';
//API query parameters
var apiUvUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat=';
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
      // .catch(function (error) {
      //   alert('Not found. Please try again.', error);
      // });
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
	var dateFormat = new Date(response.dt * 1000).toLocaleDateString();
	console.log(dateFormat);
  dateTodayEl.textContent = '(' + dateFormat + ')';
  currentCityName.appendChild(dateTodayEl);
	
	//create current weather icon
	var icon = response.weather[0].icon;
  var iconUrlCurrent = 'http://openweathermap.org/img/wn/' + icon + '.png';
  var imgEl = document.createElement('img');
  imgEl.setAttribute('src', iconUrlCurrent);
  imgEl.setAttribute('width', '50');
  imgEl.setAttribute('height', '50');
  dateTodayEl.appendChild(imgEl);

  //get temp, humidity, windspeed
  var { temp, humidity } = response.main;
  var { temp, humidity } = response.main;
  var windSpeed = response.wind.speed;

  //create a temp element
  var currentTempEl = document.createElement('p');
  currentTempEl.textContent = 'Temperature: ' + temp + ' °F';
  currentWeatherSectionEl.appendChild(currentTempEl);

  //create a humidity Element

  var currentHumidityEl = document.createElement('p');
  currentHumidityEl.textContent = 'Humidity: ' + humidity + '%';
  currentWeatherSectionEl.appendChild(currentHumidityEl);

  //create a windspeed Element
  var currentWindSpeedEl = document.createElement('p');
  currentWindSpeedEl.textContent = 'Windspeed: ' + windSpeed + ' MPH';
  currentWeatherSectionEl.appendChild(currentWindSpeedEl);

  var lat = response.coord.lat;
	var lon = response.coord.lon;

  fetchUvInfo(lat, lon);
};

var fetchUvInfo = function (lat, lon) {
	console.log(lat);
	apiUvUrl = apiUvUrl + lat + "&lon="+ lon + apiKey;
	console.log(apiUvUrl);
	fetch(apiUvUrl)
		.then(function (response) {
		response.json()
		.then(function (uv) {
      displayUvInfo(uv);
      console.log(uv.value);
    });
  });
};

var displayUvInfo = function (uv) {
  var uvVal = document.createElement('p');
  uvVal.textContent = 'UV Index: ';
	var uvSpan = document.createElement('span');
	uvSpan.textContent = uv.value;
//add UV class to uvSpan, depending on conditions
  if (uv.value <= 2) {
    uvSpan.classList = 'favorable bg-success p-1';
  } else if (uv.value > 2 && uv.value <= 7) {
    uvSpan.classList = 'moderate bg-warning p-1 ';
  } else if (uv.value >= 8) {
    uvSpan.classList = 'severe bg-danger p-1';
	}
	
	uvVal.appendChild(uvSpan)
	currentWeatherSectionEl.appendChild(uvVal);

};

var getForecast = function (city) {
	apiForecastUrl = apiForecastUrl + city + units + apiKey
	console.log(apiForecastUrl);
	fetch(apiForecastUrl)
	.then(function (response) {
		response.json()
	.then(function (forecast) {
			//display forecast
			
			//openweather is returning data for every 3 hours, but we only need one per day...
			for (var i=5; i > forecast.length; i+=8) {


				console.log(forecast);
			
				console.log(day.weather[0].icon);
				var iconCode = day.weather[0].icon;
				var temp = day.main.temp;
		
			//create a div to hold the card
			var forecastCard = document.createElement('div');
			forecastCard.classList = 'card-body bg-primary text-light text-center';
			forecastEl.appendChild(forecastCard);
			//create and add date element to card
			var forecastDate = document.createElement('h5');
			forecastDate.classList = 'card-title text-center';
			forecastDate.textContent = new Date(day.dt).toLocaleDateString();
			forecastEl.appendChild(forecastDate);
		
				//create an icon element
				
				var iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
		
				var forecastIcon = document.createElement('img');
				forecastIcon.classList = 'text-center';
				forecastIcon.setAttribute(
					'src',
					iconUrl
				);
				forecastIcon.setAttribute('width', '50');
				forecastIcon.setAttribute('height', '50');
				forecastEl.appendChild(forecastIcon);
			
				//create temperature
		
				var forecastTemp = document.createElement('p');
				forecastTemp.classList = 'text-center';
				forecastTemp.textContent = temp + ' °F';
				//append to forecast card
				forecastEl.appendChild(forecastTemp);
		
				//append to five day container
				// forecastContainerEl.appendChild(forecastEl);
			console.log(forecast);
			
			
			}

				
				
	});
});
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
	var city = event.target.getATtribute("data-city")
		if(city) {
			getCurrentWeather(city);
			getForecast(city);
		}
  
};

searchHistory();


searchForm.addEventListener('submit', formSubmitHandler);
searchHistoryEl.addEventListener("click", searchHistoryHandler);

