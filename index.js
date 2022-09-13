let darkMode = JSON.parse(localStorage.getItem('mode'));
let favourites = JSON.parse(localStorage.getItem('fav')) || [];

let favCountries = [];
let allCountries = [];
let currCountries = [];
let addedCountries = [];

let isFirstDisplay = true;

function displayCountries(countries) {

    document.getElementById('container').innerText = '';

    const classes = 'col-lg-4 col-md-4 col-sm-6';

    for (let country of countries) {
        const capital = country.capital ? country.capital[0] : '-';
        const name = country.name.common;
        const flag = country.flags.svg;
        const population = country.population;
        const region = country.continents[0];
        const id = country.cca2;

        let isFav = false;
        if (favourites.includes(id)) {
            if (isFirstDisplay) {
                favCountries.push(country);
            }
            if (!addedCountries.includes(id)) {
                addedCountries.push(id);
                addToList(flag, name, id);
            }
            isFav = true;
        }
        console.log(countries.length === 2)
        const card = `
        <div class="${countries.length === 2 ? 'col-md-6' : countries.length === 1 ? 'col-12' : classes}  border-0 mb-5"> 
            <div class="card shadow-sm border-0 toggle ${(darkMode) && "element-toggle"}" id="card">
                <a class=""
                 href="./details.html?name=${name}" draggable="true" id="${id}"
                 ondragstart={dragStart(event)} ondragend={dragEnd(event)}>
                    <img src="${flag}" alt="${name}" class="card-img-top" id="${id}">
                    <div class="card-body bg-white toggle ${(darkMode) && "element-toggle "}">
                        <h5 class="card-title mb-3 mt-2 fw-bold">
                            ${name}
                        </h5>
                        <p class="card-text mb-1 fs-6 fw-semibold"> 
                            Population: 
                            <span class="fw-light">
                                ${population.toLocaleString('en-US')}
                            </span>
                        </p>
                         <p class="card-text mb-1 fs-6 fw-semibold"> 
                            Region: 
                            <span class="fw-light">
                                ${region}
                            </span>
                        </p>
                         <p class="card-text mb-1 fs-6 fw-semibold"> 
                            Capital: 
                            <span class="fw-light">
                                ${capital}
                            </span>
                        </p>
                    </div> 
                </a>
                <i class="bi bi-star-fill align-self-end mb-2 me-2" style="color: ${isFav ? 'orange' : 'lightgray'}" onclick={toggleFavCountry(event)} id="${id}"></i>
            </div>
        </div>
        `;
        document.getElementById('container').insertAdjacentHTML('beforeend', card);
    }

    isFirstDisplay = false;
}

function clearFilter() {
    document.getElementById('filter').innerText = 'Filter by';
    document.getElementById('clear').style.display = 'none';
    search();
}

function filter(filter) {

    document.getElementById('clear').style.display = 'block';
    document.getElementById('filter').innerText = filter;

    let c;
    if (filter === 'Favourites') {
        c = favCountries;
    } else {
        c = allCountries.filter(country => country.region.includes(filter));
    }
    currCountries = c;
    displayCountries(c);
}

async function search() {
    const search = document.getElementById('search').value;
    const isFilterCleared = document.getElementById('filter').innerText === 'Filter by';

    let res;

    if (search === '' && isFilterCleared) {
        res = await fetch("https://restcountries.com/v3.1/all");
    } else if (search === '') {
        res = currCountries;
    } else {
        res = currCountries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
    }

    const updatedSearch = document.getElementById('search').value;

    if (updatedSearch === search) {
        if (search !== '' || (search === '' && !isFilterCleared)) {
            displayCountries(res);
        } else if (search === '') {
            allCountries = await res.json();
            currCountries = allCountries;
            displayCountries(allCountries);
        }
    }
}

function activateMode() {
    const mode = document.getElementById('mode');
    if (darkMode) {
        mode.innerHTML = '<i class="bi bi-moon-fill"></i> Light Mode';
        mode.classList.remove('fw-bold');
    } else {
        mode.innerHTML = '<i class="bi bi-moon "></i> Dark Mode';
        mode.classList.add('fw-bold');
    }
    document.body.classList.toggle('bg-toggle');
    let elements = document.getElementsByClassName('toggle');
    for (let element of elements) {
        element.classList.toggle('element-toggle');
    }
}

function toggleMode() {

    darkMode = !darkMode;
    localStorage.setItem('mode', darkMode);
    activateMode();
}

function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
    event.target.style.opacity = '0.5';
}

function dragEnd(event) {
    event.target.style.opacity = '1';
}

function dragEnter(event) {

    if (event.target.className.includes("favourites"))
        event.target.style.border = '1px solid #27ae60';
}

function dragLeave(event) {
    event.target.style.border = 'none';
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    const id = event.dataTransfer.getData("Text");
    const node = document.getElementById(id).cloneNode(true);
    node.style.opacity = '1';
    event.target.style.border = 'none';

    if (!favourites.includes(id)) {
        checkStar(id, 'orange');
        addCountry(id);
    }
}

function toggleFavCountry(event) {
    const id = event.target.id;
    const country = favourites.find(c => c === id);
    if (country) {
        removeCountry(id);
        event.target.style.color = 'lightgray';
        document.getElementById(id).remove();
    } else {
        addCountry(id);
        event.target.style.color = 'orange';
    }
}

function checkStar(id, color) {
    const starElements = document.getElementsByTagName('i');
    for (let s of starElements) {
        if (s.id === id) {
            s.style.color = color;
        }
    }
}

function addToList(src, name, id) {

    const appendedNode = formatFavourite(src, name, id);

    document.getElementById('favourites').insertAdjacentHTML('beforeend', appendedNode);
}

function formatFavourite(src, name, id) {
    return `<div class="d-flex align-items-center justify-content-between mb-2"  id="${id}">
                <div class="d-flex align-items-center">
                     <img class="w-25 rounded m-0" src="${src}">
                     <p class="m-0 ms-1 fw-bold" style="font-size: 0.6rem">
                        ${name}
                    </p>
                </div>
                <span class="rounded me-2 remove toggle ${(darkMode) && "element-toggle"}" onclick="removeCountryFromList(event)" id="${id}">X</span>
            </div>`;
}

function removeCountry(id) {
    favourites = favourites.filter(e => e !== id);
    addedCountries = addedCountries.filter(c => c !== id);
    localStorage.setItem('fav', JSON.stringify(favourites));
    favCountries = favCountries.filter(c => c.cca2 !== id);
}

function addCountry(id) {
    favourites = [...favourites, id];
    const country = currCountries.find(e => e.cca2 === id);
    addToList(country.flags.svg, country.name.common, country.cca2);
    favCountries = [...favCountries, country];
    localStorage.setItem('fav', JSON.stringify(favourites));
    addedCountries.push(id);
}

function removeCountryFromList(event) {

    const id = event.target.parentElement.id;
    removeCountry(id);
    checkStar(id, 'lightgray');
    document.getElementById(id).remove();
}

search();

if (darkMode) {
    activateMode();
}
