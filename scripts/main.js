"use strict"

// -------------------- Event functions:

const search = async (e) => {
    e.preventDefault()

    let value = document.getElementById('searchInput').value;

    console.info('The value to search is:', value);

    let coordinates = await getCoordinates(value);

    if (coordinates.cod === '400') {
        console.warn( coordinates.message);
    } else if (!coordinates.length) {
        console.warn('Location not found');
    } else {
        console.info('The location is', coordinates[0]);

        let url = getWeatherURL(coordinates[0]);
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