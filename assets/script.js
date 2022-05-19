//grabbing elements from html
var searchInputEl = $("#search-input");
var searchBtnEl = $("#search-btn")
var previousSearchesEl = $(".panel")
var currentWeatherEl = $("#current-weather");
var uviEl = $("#uvi");
var fiveDayEl = $("#five-day");
var fiveDayCardsEl = $(".five-day-cards");
var datesEl = $(".date");
var iconEl = $(".icon")
var tempEl = $(".temp")
var windEl = $(".wind")
var humidityEl = $(".humidity")

//variables that needed to be global
var query;
var lat;
var lon;

var previousSearches = [];
var numPreviousSearches = 8;

//converts unix timestamp to date
function timeConverter(timestamp) {
    var now = new Date(timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = now.getFullYear();
    var month = months[now.getMonth()];
    var date = now.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

//grabs user input, saves it, and updates previous searches
function updateSearch() {
    previousSearches = JSON.parse(localStorage.getItem("previous-city")) ?? [];
    if (searchInputEl.val()) {
        query = searchInputEl.val();
        previousSearches.unshift(query);
        if (previousSearches.length > numPreviousSearches) {
            previousSearches.pop()
        }
        localStorage.setItem("previous-city", JSON.stringify(previousSearches));
        $(".city").remove();
        for (var i = 0; i < previousSearches.length; i++) {
            previousSearchesEl.append("<a class='city panel-block is-focused'>" + previousSearches[i] + "</a>");
        }
    }
    if (previousSearches !== []) {
        $(".city").remove();
        for (var i = 0; i < previousSearches.length; i++) {
            previousSearchesEl.append("<a class='city panel-block is-focused'>" + previousSearches[i] + "</a>");
        }
        return previousSearches[0];
    }
}

//gets coordinates for input city and calls getWeather
function getCoord(city) {
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=004649559d0d6a8c8744d45cc6ad0de1";

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

//retreives weather from api based on coordinates and updates current and five day weather text
function getWeather(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&appid=004649559d0d6a8c8744d45cc6ad0de1&units=imperial";

    $.ajax({
        url: requestUrl,
        method: "GET",
    }).then(function (response) {
        $(".is-hidden").removeClass("is-hidden")
        currentWeatherEl.children().eq(1).text(timeConverter(response.current.sunrise));
        currentWeatherEl.children().eq(2).text(response.current.temp + " °F");
        currentWeatherEl.children().eq(3).text(response.current.wind_speed);
        currentWeatherEl.children().eq(4).text(response.current.humidity);
        uviEl.text(response.current.uvi);
        setUVIColor(response.current.uvi);
        for (var i = 0; i < fiveDayCardsEl.length; i++) {
            datesEl[i].textContent = timeConverter(response.daily[i + 1].dt)
            iconEl[i].setAttribute("src", "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png")
            tempEl[i].textContent = ("Temp: " + response.daily[i + 1].temp.day + " °F")
            windEl[i].textContent = ("Wind: " + response.daily[i + 1].wind_speed + " MPH")
            humidityEl[i].textContent = ("Humidity: " + response.daily[i + 1].humidity + "%")
        }
    });
}

//sets background color of uv index based on favorability
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

//event handlers
searchBtnEl.on("click", function (event) {
    event.preventDefault();
    getCoord(updateSearch())
})

$(document.body).on('click', '.city', function (event) {
    getCoord($(event.target).text())
})

//loads previous searches and weather of last search on page load
updateSearch()
getCoord(updateSearch())

