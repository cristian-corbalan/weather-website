"use strict"

const search = (e) => {
    e.preventDefault()

    let value = document.getElementById('searchInput').value;

    console.info('The value to search is:', value);

    // console.info('Searching...');
}

// Add event to the form:
const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', search);