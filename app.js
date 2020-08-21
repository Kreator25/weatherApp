//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
require('dotenv').config();
let temp;
let description;
let imageID;
let imageURL;
let humidity;
let pressure;
let windSpeed;
let q;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set('view engine', 'ejs');

// Set a static folder
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/weatherReport", function(req, res) {
  res.render("weather", {
    cityName: q.toUpperCase(),
    temp: temp,
    humidity: humidity,
    pressure: pressure,
    windSpeed: windSpeed,
    description: description,
    imageURL: imageURL
  });
});
app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
  https.get(url, function(response) {
    if(response.statusCode===200)
    {
    response.on("data", function(data) {
      const weather = JSON.parse(data);
      q=query;
      temp = weather.main.temp;
      description = weather.weather[0].description;
      imageID = weather.weather[0].icon;
      imageURL ="http://openweathermap.org/img/wn/" + imageID + "@2x.png";
      humidity = weather.main.humidity;
      pressure = weather.main.pressure;
      windSpeed = weather.wind.speed;
      res.redirect("/weatherReport");
    });
  }
  else{
    res.send("<h1>Sorry!!! Page Not found</h1>");
  }
  });
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
