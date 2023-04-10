// import weather from "../data/current-weather.js";
import { formatDate, formatTemp } from "./utils/format-data.js";
import { weatherConditionsCodes } from "./constants.js";
import { getLatLong } from "./geolocation.js";
import { getCurrentWeather } from "./services/weather.js";

function setCurrentWeather($el, city) {
  $el.textContent = city;
}

function setCurrentDate($el) {
  const date = new Date();
  const formattedDate = formatDate(date);
  $el.textContent = formattedDate;
}

function setCurrentTemp($el, temp) {
  $el.textContent = formatTemp(temp);
}

function solarStatus(sunsetTime, sunriseTime) {
  const currentHours = new Date().getHours();
  const sunsetHours = sunsetTime.getHours();
  const sunriseHours = sunriseTime.getHours();

  if (currentHours > sunsetHours || currentHours < sunriseHours) {
    return "night";
  }
  return "morning";
}

function setBackground($el, conditionCode, solarStatus) {
  const weatherType = weatherConditionsCodes[conditionCode];

  const size = window.matchMedia("(-webkit-min-device-pixel-ratio:2)").matches
    ? "@2x"
    : "";

  $el.style.backgroundImage = `url(./images/${solarStatus}-${weatherType}${size}.jpg)`;
}

function showCurrentWeather($app, $loading) {
  $app.hidden = false;
  $loading.hidden = true;
}

function configCurrentWeather(weather) {
  const $app = document.querySelector("#app");
  const $loading = document.querySelector("#loading");

  //loader
  showCurrentWeather($app, $loading);
  //date
  const $currentWeatherDate = document.querySelector("#current-weather-date");
  setCurrentDate($currentWeatherDate);

  //city
  const $currentWeatherCity = document.querySelector("#current-weather-city");
  const city = weather.name;
  setCurrentWeather($currentWeatherCity, city);

  //temp
  const $currentWeatherTemp = document.querySelector("#current-weather-temp");
  const temp = weather.main.temp;
  setCurrentTemp($currentWeatherTemp, temp);

  //background
  const sunriseTime = new Date(weather.sys.sunrise * 1000);
  const sunsetTime = new Date(weather.sys.sunset * 1000);
  const conditionCode = String(weather.weather[0].id).charAt(0);

  setBackground($app, conditionCode, solarStatus(sunsetTime, sunriseTime));
}

export default async function currentWeather() {
  //GEO //API -weather //config

  const { lat, long, isError } = await getLatLong();
  if (isError) return console.log("Ah ocurrido un error ");
  // console.log(lat, long);

  // getCurrentPosition()
  //   .then((data) => {
  //     console.log("hemos triunfado", data);
  //   })
  //   .catch((message) => {
  //     console.log("hemos fallado", message);
  //   });

  const { isError: currentWeatherError, data: weather } =
    await getCurrentWeather(lat, long);

  if (currentWeatherError) return console.log(" ha ocurrido  un error");

  configCurrentWeather(weather);
  // console.log(weather);
}
