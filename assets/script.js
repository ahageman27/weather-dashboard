var searchInputEl = $("#search-input");
var searchBtnEl = $("#search-btn")
var currentWeatherEl = $("#current-weather");
var fiveDayEl = $("#five-day");
var fiveDayCardsEl = $("#five-day-cards");
var datesEl = $(".date");

var query;
var apiKey = "004649559d0d6a8c8744d45cc6ad0de1";
var lat;
var lon;

function updateSearch() {
    query = searchInputEl.val();
    localStorage.setItem("current-city", query);
    return localStorage.getItem("current-city");
}

function getCurrentWeather(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    $.ajax({
        url: requestUrl,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        console.log(response.wind.direction)
        currentWeatherEl.children().eq(1).children().text(response.main.temp);
        currentWeatherEl.children().eq(2).children().text(response.wind.speed + " " + response.wind.degree);
        currentWeatherEl.children().eq(3).children().text(response.humidity.value);
        currentWeatherEl.children().eq(4).children().text(response.uvi);
    });
}

function getCoord(city) {
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

    $.ajax({
        url: requestUrl,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        lon = response[0].lon;
        lat = response[0].lat;
    })
}

searchBtnEl.on("click", function (event) {
    event.preventDefault();

    getCoord(updateSearch())
    console.log(lat)
    getCurrentWeather(lat, lon)
})


