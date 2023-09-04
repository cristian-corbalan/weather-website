"use strict"

// -------------------- Event functions:

const search = async (e) => {
    e.preventDefault()

    let value = document.getElementById('searchInput').value;

    console.info('The value to search is:', value);

    // console.info('Searching...');

    let coordinates = await getCoordinates(value);
    console.log(coordinates);
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

// ---------- API variables:

const API_KEY = `1bff7579067727b7399aa930fbeb7b4c`;

// ---------- Add event to the form:

const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', search);