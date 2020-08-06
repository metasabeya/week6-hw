var cityName = $(".cityName");
var cityTemp = $(".temp");
var cityHumidity = $(".humidity");
var cityWindSpeed = $(".windSpeed");
var cityUvIndex = $(".uvIndex");
var cityLat = "";
var cityLon = "";
var cityFromLocalStorage = JSON.parse(localStorage.getItem("cityName"));
weatherApp(cityFromLocalStorage);

$("#find-city").on("click", function (event) {
  event.preventDefault();
  //console.log("me clicked");

  var city = $("#city-input").val();
  var searchedBtn = $("<button>");
  searchedBtn.text(city);
  $(".searched").append(searchedBtn);

  localStorage.setItem("cityName", JSON.stringify(city));
  weatherApp(city);
});

function weatherApp(city) {
  var apiKey = "bbe5da90d55bd39816823c09143d06b8";
  var queryurl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  $.ajax({
    url: queryurl,
    method: "GET",
  }).then(function (response) {
    console.log(response.weather[0].icon);

    var currentImg = $("<img>");
    currentImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    );

    var actualTemp = Math.floor((response.main.temp - 273.15) * 1.8 + 32);

    cityName.html(response.name);
    cityName.append(currentImg);
    cityTemp.html("Temp : " + actualTemp);
    cityHumidity.html("humidity : " + response.main.humidity);
    cityWindSpeed.html("Windspeed : " + response.wind.speed);
    cityLat = response.coord.lat;
    cityLon = response.coord.lon;

    var uvQueryUrl =
      "http://api.openweathermap.org/data/2.5/uvi?appid=" +
      apiKey +
      "&lat=" +
      cityLat +
      "&lon=" +
      cityLon;
    $.ajax({
      url: uvQueryUrl,
      method: "GET",
    }).then(function (uvRes) {
     

      cityUvIndex.html("UV Index : " + uvRes.value);

      var fiveDayQueryUrl =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=" +
        apiKey;
      $.ajax({
        url: fiveDayQueryUrl,
        method: "GET",
      }).then(function (fivedayRes) {
        $(".fiveDayRow").empty();
        // for the five day forcast
        for (var i = 0; i < fivedayRes.list.length; i++) {
          if (fivedayRes.list[i].dt_txt.indexOf("12:00:00") !== -1) {
            var date = fivedayRes.list[i].dt_txt;
            date = moment.parseZone(date).format("MMM Do");
            var tempF = Math.floor(
              (fivedayRes.list[i].main.temp - 273.15) * 1.8 + 32
            );
            var humidityFive = fivedayRes.list[i].main.humidity;
            var wrapper = $("<div>");
            wrapper.attr("class", "col-md-2");
            var fiveDate = $("<p>");
            fiveDate.text(date);
            var fiveImage = $("<img>");
            fiveImage.attr(
              "src",
              "http://openweathermap.org/img/wn/" +
                fivedayRes.list[i].weather[0].icon +
                ".png"
            );
            var fiveTemp = $("<p>");
            fiveTemp.text("Temp: " + tempF);
            var fiveHumidity = $("<p>");
            fiveHumidity.text("Humidity: " + humidityFive);
            wrapper.append(fiveDate, fiveImage, fiveTemp, fiveHumidity);
            $(".fiveDayRow").append(wrapper);
          }
        }
      });
    });
  });
}
