"use strict"

// -------------------- Event functions:

const search = async (e) => {
    console.log("buscando...")
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

        saveOnHistory(coordinates[0]);
    }
}

const changeFormStatus = (e) => {
    let value = e.target.value;

    toggleFormButtonsStatus(value);
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

    if (!document.querySelector('.weather')) {
        return {
            success: false,
            message: 'In the HTML is necessary a tag with the class "weather" to add the content',
        }
    }

    let weatherContainer = document.querySelector('.weather');
    weatherContainer.innerText = '';

    let header = createWeatherHeader(
        location.state,
        location.name,
        info.weather[0].icon,
        info.weather[0].description
    );
    weatherContainer.appendChild(header);

    let temperature = createWeatherTemperature(info.main.temp, info.main.feels_like);
    temperature.setAttribute('id', 'mainTemperature');
    weatherContainer.appendChild(temperature);

    let moreInformation = {
        'Minimum temperature': `${Math.round(info.main.temp_min)} ºc`,
        'Maximum temperature': `${Math.round(info.main.temp_max)} ºc`,
        'Humidity': `${info.main.humidity} %`,
        'Visibility': `${info.visibility / 1000} Km`,
        'Wind speed': `${(info.wind.speed * 3.6).toFixed(1)} Km/h`,
        'Pressure': `${info.main.pressure} hPa`,
    }

    let list = createWeatherInfoList(moreInformation);
    weatherContainer.appendChild(list);

    changeWeatherBackground(info.weather[0].main)
}

/**
 * Create a weather header with the searched location name and the icon.
 * The structure is commented within the function.
 *
 * @param {string} state
 * @param {string} city
 * @param {string} icon Only the code
 * @param {string} description Weather description, for the img alt
 * @return {HTMLElement} The header with the class "weatherLocation"
 */
const createWeatherHeader = (state = '', city = '', icon = '', description = '', tagName = 'h2') => {
    /*
    Structure:
        <header class="weatherLocation">
            <h2 class="weatherLocation__name">STATE, CITY</h2>
            <div class="weatherLocation__iconContainer">
                <img class="weatherLocation__icon"
                     src="ICON_URL"
                     alt="DESCRIPTION">
            </div>
        </header>
     */

    let header = createTag('header', {class: 'weatherLocation'});

    let h2 = createTag(tagName, {class: 'weatherLocation__name'}, `${state ? state + ', ' : ''}${city}`);
    header.appendChild(h2);

    let div = createTag('div', {class: 'weatherLocation__iconContainer'});
    header.appendChild(div);

    let img = createTag(
        'img',
        {
            class: 'weatherLocation__icon',
            src: `https://openweathermap.org/img/wn/${icon}@2x.png`,
            alt: description
        }
    );
    div.appendChild(img);

    return header;
}

/**
 * Create a weather temperature.
 * The structure is commented within the function.
 *
 * @param {number | string} temperature
 * @param {number | string} realFeel
 * @return {HTMLElement} The div with the class "temperature".
 */
const createWeatherTemperature = (temperature = 0, realFeel = 0) => {

    /*
    Structure:

    <div class="temperature">
        <ul class="temperature__list">
            <li class="temperature__item">
                <span class="temperature__name">Temperature</span>
                <span class="temperature__degrees">00ºc</span>
            </li>
            <li class="temperature__item">
                <span class="temperature__name">Real feel</span>
                <span class="temperature__degrees">00ºc</span>
            </li>
        </ul>
    </div>
     */

    let div = createTag('div', {class: 'temperature'});

    let ul = createTag('ul', {class: 'temperature__list'});
    div.appendChild(ul);

    let li = createTag('li', {class: 'temperature__item'});
    ul.appendChild(li);

    let span = createTag('span', {class: 'temperature__name'}, 'Temperature');
    li.appendChild(span);

    span = createTag('span', {class: 'temperature__degrees'}, `${Math.round(temperature)}ºc`);
    li.appendChild(span);

    li = createTag('li', {class: 'temperature__item'});
    ul.appendChild(li);

    span = createTag('span', {class: 'temperature__name'}, 'Real feel');
    li.appendChild(span);

    span = createTag('span', {class: 'temperature__degrees'}, `${Math.round(realFeel)}ºc`);
    li.appendChild(span);

    return div;
}


/**
 * Create weather info list.
 *
 * @param {{}} info Object with the information to list
 * @return {HTMLElement} The ul with the class "weatherInfo"
 */
const createWeatherInfoList = (info = {}) => {
    let ul = createTag('ul', {class: 'weatherInfo'})

    for (const name in info) {
        ul.appendChild(createWeatherInfoItem(name, info[name]));
    }

    return ul;
}

/**
 * Create a list item with two spans, one span for name and the other the value.
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

    if (value) {
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

/**
 * Change body background class
 *
 * @param {null | string} weather Description of the weather, it can be:
 *  clear sky | few clouds | scattered clouds | broken clouds | shower rain | rain | thunderstorm | snow | mist
 */
const changeWeatherBackground = (weather = null) => {
    if (!weather) {
        return "The weather description is required";
    }

    // Change weather type
    weather = String(weather);

    // Create class:
    let className = 'bg-';

    // Change blank spaces to -
    className += weather.replace(/ /g, '-').toLowerCase();

    document.body.className = className;
}

/**
 * Enable or disable the search form buttons
 * @param {string} value Input content
 */
const toggleFormButtonsStatus = (value = '') => {
    let buttonSearch = document.getElementById('buttonSearch');
    let buttonCurrentLocation = document.getElementById('buttonCurrentLocation');

    if (!value !== null && String(value).trim()) {
        buttonSearch.disabled = false;
        buttonCurrentLocation.disabled = false;
    } else {
        buttonSearch.disabled = true;
        buttonCurrentLocation.disabled = true;
    }
}

/**
 * Save on localStorage a searchedLocation
 * @param {{name, state, lat, lon}} searchedLocation Object with the location's data
 */
const saveOnHistory = (searchedLocation) => {
    console.log("searched location is:", searchedLocation);

    let history = localStorage.getItem('searchedHistory');

    if (history) {
        history = JSON.parse(history);

        let notExist = true;

        history.forEach((location, i) => {
            if(location.lat === searchedLocation.lat && location.lon === searchedLocation.lon){
                notExist = false;
                history.splice(i, 1);
                history.push(searchedLocation);
            }
        })

        if(notExist){
            history.push(searchedLocation);
        }
    }else {
        history = [searchedLocation];
    }

    localStorage.setItem('searchedHistory', JSON.stringify(history));
}

const showHistory = () => {
    let history = localStorage.getItem('searchedHistory');

    // If I don't have anything in the history, finish the function.
    if(!history){
        console.info('The history is empty');
        let li = createTag('li', {class: 'history__text'}, 'You haven\'t searched for anything yet. 🥲');
        document.querySelector('.historyList').appendChild(li);
        return;
    }

    history = JSON.parse(history);

    // Detect the history container tag and remove its content:
    let list = document.querySelector('.historyList');
    console.log("The history list tag", list)
    list.innerHTML = '';

    history.forEach(async (location) => {
        console.log("The location is:", location);

        let url = getWeatherURL(location);
        console.log("The API URL:", url);

        let info = await getWeather(url);
        console.log("The location weather:", info);

        let li = createHistoryItem(location, info);
        list.appendChild(li);
    })
}

const createHistoryItem = (location = null, info = null) => {

    // Validate the location and weather information:
    if(!location || !info){
        console.warn("The city name, state name and the weather info are required");
        return;
    }

    let li = createTag('li', {class: 'historyList__item'});

    let header = createWeatherHeader(
        location.state,
        location.name,
        info.weather[0].icon,
        info.weather[0].description,
        'h3'
    )
    li.appendChild(header);

    let temperature = createWeatherTemperature(info.main.temp, info.main.feels_like);
    li.appendChild(temperature);

    return li;
}


// ---------- API variables:

const API_KEY = `1bff7579067727b7399aa930fbeb7b4c`;

// ---------- Add event to the form:

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', search);
searchInput.addEventListener('input', changeFormStatus);


// ---------- History:

showHistory()