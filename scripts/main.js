"use strict"

// -------------------- Event functions:

const search = async (e) => {
    e.preventDefault()

    let value = document.getElementById('searchInput').value;

    // console.info('The value to search is:', value);

    let coordinates = await getCoordinates(value);

    if (coordinates.cod === '400') {
        console.warn(coordinates.message);
    } else if (!coordinates.length) {
        console.warn('Location not found');
    } else {
        // console.info('The location is', coordinates[0]);

        let url = getWeatherURL(coordinates[0]);

        let info = await getWeather(url);
        // console.info('Weather:', info);

        let location = {
            name: coordinates[0].name,
            state: coordinates[0].state,
        }

        showWeather(location, info);
    }
}

// ---------- Functions:

/**
 * Use the API geocoder to convert city names or zip-codes to geo coordinates.
 * @param {string} location The city name or a zip-code.
 * @return {Promise}
 */
const getCoordinates = (location) => {
    const COORDINATES_API = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY}`;

    return fetch(COORDINATES_API)
        .then(res => res.json());
}


/**
 * Create the URL of the weather API using the latitude and longitude.
 *
 * @param {Object} coordinates
 * @param {Number} coordinates.lat
 * @param {Number} coordinates.lon
 * @return {string} Weather API URL.
 */
const getWeatherURL = function (coordinates) {
    let lat = coordinates.lat;
    let lon = coordinates.lon;
    // console.info(lat, lon);

    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
}

/**
 * Get the weather information of a location.
 *
 * @param {string} url API URL with the coordinates.
 * @return {Promise}
 */
const getWeather = (url) => {
    return fetch(url)
        .then(response => response.json());
}

/**
 *
 * @param {Object} location
 * @param {Object} info
 * @return {{success: boolean, message: string}|void}
 */
const showWeather = (location = null, info = null) => {
    if (!location || !info) {
        return {
            success: false,
            message: 'The city name, state name and the weather info are required',
        }
    }

    // Name:
    let name = document.getElementById('locationName');
    name.innerText = `${location.state}, ${location.name}`;

    // Icon:
    let img = document.getElementById('weatherIcon');
    img.setAttribute('src', `https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`)
    img.setAttribute('alt', info.weather[0].description)

    // Temperature
    let temperature = document.querySelector('#mainTemperature .temperature__item:first-child .temperature__degrees');
    let realFeel = document.querySelector('#mainTemperature .temperature__item:last-child .temperature__degrees');
    temperature.innerText = `${info.main.temp}ºc`;
    realFeel.innerText = `${info.main.feels_like}ºc`;

    // Other info:
    let list = document.getElementById('weatherInfoList');
    list.innerText = '';

    list.append(createWeatherInfoItem());
}


/**
 * Create a list item with two spans, one span for name and the other the value.
 *
 *
 * @param {string} name Data name
 * @param {string} value Data value
 * @return {string|HTMLElement} The list item
 */
const createWeatherInfoItem = (name = null, value = '') => {
    if (!name) {
        return 'Error: The data name is required';
    }

    let li = createTag('li', {class: 'weatherInfo__item'});

    let spanName = createTag('span', {class: 'weatherInfo__name'}, name);
    li.appendChild(spanName);

    if(value){
        let spanValue = createTag('span', {class: 'weatherInfo__value'}, value);
        li.appendChild(spanValue);
    }

    return li;
}


/**
 * Create a HTMLElement
 *
 * @param {string} name Tag's name.
 * @param {object | null} attributes The object's properties are the attribute name.
 * @param {string | null} content Tag's innerText.
 */
const createTag = function (name = '', attributes = null, content = null) {
    if (!name) {
        console.error('The name is obligatory');
    }

    let tag = document.createElement(name);

    if (attributes) {
        for (const i in attributes) {
            tag.setAttribute(i, attributes[i]);
        }
    }

    if (content) {
        tag.innerText = content;
    }

    return tag;
}

// ---------- API variables:

const API_KEY = `1bff7579067727b7399aa930fbeb7b4c`;

// ---------- Add event to the form:

const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', search);