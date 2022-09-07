
const APP_ID = 'cf26e7b2c25b5acd18ed5c3e836fb235';

var body = document.querySelector('body');
var weatherApp = document.querySelector('.weather-app');

var searchInput = document.querySelector('.search-input');
var containerBody = document.querySelector('.container-body');

var cityElement = document.querySelector('.city');
var countryElement = document.querySelector('.country');
var hoursElement = document.querySelector('.hours');
var dayElement = document.querySelector('.day');

var temperatureElement = document.querySelector('.temperature h3');
var weatherElement = document.querySelector('.weather');

var visionElement = document.querySelector('.vision p');
var windspeedElement = document.querySelector('.windspeed p');
var cloudElement = document.querySelector('.cloud p');


function Weather(handleGetData){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            if(data.cod === '404' || searchInput.value.trim() === ''){
                searchInput.value = "";
                containerBody.innerHTML = "";
                body.style.background = `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(./assets/img/welcomeWeather.jpg) center top / cover no-repeat`;
                weatherApp.style.background = `url(./assets/img/welcomeWeather.jpg) center top / cover no-repeat`;
            }
            else{
                var html = handleGetData(data);
                containerBody.innerHTML = html;
            }
        })
}

function handleGetData(data){
    var time = new Date(Date.now() + 1000 * data.timezone).toISOString().split('T');

    var city = data.name;
    var country = data.sys.country;
    var hours = time[1].split('.')[0];
    var day = time[0].split('-').reverse().join('-');
    var temperature = data.main.temp;
    var weather = data.weather[0].main;
    var vision = data.visibility;
    var windspeed = data.wind.speed;
    var cloud = data.clouds.all;

    var background;
    if((weather === 'Clouds' || weather === 'Clear') && temperature >= 15){
        background = './assets/img/sunny.gif';
    }
    else if(weather === 'Rain' && data.rain['1h'] < 3){
        background = './assets/img/rain.gif';
    }
    else if(weather === 'Rain' && data.rain['1h'] >= 3){
        background = './assets/img/storm.gif';
    }
    else{
        background = './assets/img/snow.gif';
    }

    body.style.background = `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${background}) center top / cover no-repeat`;
    weatherApp.style.background = `url(${background}) center top / cover no-repeat`;


    return `
        <div class="head-weather">
            <div class="location">
                <h3 class="city">${city}</h3>
                ,
                <h3 class="country">${country}</h3>
            </div>
            <div class="time">
                <p class="hours">${hours}</p>
                ,
                <p class="day">${day}</p>
            </div>
        </div>

        <div class="body-weather">
            <div class="temperature">
                <h3>${temperature}°C</h3>
            </div>
            <div class="weather">${weather}</div>
        </div>

        <div class="footer-weather">
            <div class="vision">
                <i class="fas fa-eye"></i>
                <p>${vision}(m)</p>
            </div>
            <div class="windspeed">
                <i class="fas fa-wind"></i>
                <p>${windspeed}(m/s)</p>
            </div>
            <div class="cloud">
                <i class="fas fa-cloud"></i>
                <p>${cloud}%</p>
            </div>
        </div>
    `
}

searchInput.onchange = function() {
    Weather(handleGetData);
}

