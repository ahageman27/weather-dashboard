var searchInputEl = $("#search-input");
var searchBtnEl = $("#search-btn")
var currentWeatherEl = $("#current-weather");
var uviEl = $("#uvi");
var fiveDayEl = $("#five-day");
var fiveDayCardsEl = $("#five-day-cards");
var datesEl = $(".date");

var apiKey = "004649559d0d6a8c8744d45cc6ad0de1";
var query;
var lat;
var lon;

function timeConverter(timestamp) {
    var now = new Date(timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = now.getFullYear();
    var month = months[now.getMonth()];
    var date = now.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

function updateSearch() {
    query = searchInputEl.val();
    localStorage.setItem("current-city", query);
    return localStorage.getItem("current-city");
}

function getWeather(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: requestUrl,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        currentWeatherEl.children().eq(1).text(timeConverter(response.current.dt));
        currentWeatherEl.children().eq(2).children().text(response.current.temp);
        currentWeatherEl.children().eq(3).children().text(response.current.wind_speed);
        currentWeatherEl.children().eq(4).children().text(response.current.humidity);
        uviEl.text(response.current.uvi);
        setUVIColor(response.current.uvi);
        
    });
}

function getCoord(city) {
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

    $.ajax({
        url: requestUrl,
        method: "GET",
    }).then(function (response) {
        currentWeatherEl.children().eq(0).text(city).addClass("is-capitalized");
        lon = response[0].lon;
        lat = response[0].lat;
        getWeather(lat, lon);
    })
}

function setUVIColor(uvi) {
    if (uvi < 2) {
        uviEl.addClass("has-background-success");
        uviEl.removeClass("has-background-warning", "has-background-danger");
    }
    else if (uvi < 5) {
        uviEl.addClass("has-background-warning");
        uviEl.removeClass("has-background-success", "has-background-danger");
    }
    else if (uvi < 7) {
        uvi.addClass("has-background-danger");
        uviEl.removeClass("has-background-success", "has-background-warning");
    }
}

searchBtnEl.on("click", function (event) {
    event.preventDefault();
    getCoord(updateSearch())
})


