"use strict"

const search = (e) => {
    e.preventDefault()

    let value = document.getElementById('searchInput').value;

    console.info('The value to search is:', value);

    // console.info('Searching...');
}

// ---------- API variables:

const API_KEY = `1bff7579067727b7399aa930fbeb7b4c`;

// ---------- Add event to the form:
const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', search);