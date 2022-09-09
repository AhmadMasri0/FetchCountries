let darkMode = JSON.parse(localStorage.getItem('mode'));
let favourites = JSON.parse(localStorage.getItem('fav')) || [];

let favCountries = [];
let allCountries = [];
let currCountries = [];
let isFirstDisplay = true;

function displayCountries(countries) {

    document.getElementById('container').innerText = '';

    for (let country of countries) {
        const capital = country.capital ? country.capital[0] : '-';
        const name = country.name.common;
        const flag = country.flags.svg;
        const population = country.population;
        const region = country.continents[0];
        const id = country.cca2;

        if (favourites.includes(id) && isFirstDisplay) {
            addToList(flag, name, id);
            favCountries.push(country);
        }
        const card = `
        <div class="col ${countries.length === 2 && 'col-md-6'} ${countries.length !== 1 && 'col-md-4'} border-0 mb-5"> 
            <div class="card shadow-sm border-0" id="card">
                <a href="./details.html?name=${name}" draggable="true" id="${id}"
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
            </div>
        </div>
        `;

        document.getElementById('container').insertAdjacentHTML('beforeend', card);
    }

    isFirstDisplay = false;
}


search();

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
        c = allCountries.filter(country => {
            if (country.region.includes(filter)) {
                return country;
            }
        });
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
        res = currCountries.filter(country => {
            if (country.name.official.toLowerCase().includes(search.toLowerCase())) {
                return country;
            }
        });
    }

    const updatedSearch = document.getElementById('search').value;

    if ((updatedSearch === search) &&
        (search !== '' || (search === '' && !isFilterCleared))) {
        displayCountries(res);
    } else if (updatedSearch === search && search === '') {
        const countries = await res.json();
        allCountries = countries;
        currCountries = allCountries;
        displayCountries(allCountries);
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

if (darkMode) {
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

function drop(event) {
    event.preventDefault();
    if (event.target.className.includes("favourites")) {

        const data = event.dataTransfer.getData("Text");
        const node = document.getElementById(data).cloneNode(true);
        node.style.opacity = '1';
        event.target.style.border = 'none';

        if (!favourites.includes(data)) {
            const appendedNode = formatFavourite(node.childNodes[1].currentSrc, node.childNodes[3].childNodes[1].innerText, data);
            favourites = [...favourites, data];
            favCountries = [...favCountries, currCountries.find(e => e.cca2 === data)];
            localStorage.setItem('fav', JSON.stringify(favourites));
            event.target.insertAdjacentHTML('beforeend', appendedNode);
        }
    }
}

function formatFavourite(src, name, id) {
    return `<div class="d-flex align-items-center justify-content-between mb-2"  id="${id}">
                <div class="d-flex align-items-center">
                     <img class="w-25 rounded m-0" src="${src}">
                     <p class="m-0 ms-1 fw-bold" style="font-size: 0.6rem">
                        ${name}
                    </p>
                </div>
                <span class="rounded me-2 remove toggle ${(darkMode) && "element-toggle"}" onclick="removeCountry(event)" id="${id}">X</span>
            </div>`;
}

function addToList(src, name, id) {

    const appendedNode = formatFavourite(src, name, id);

    document.getElementById('favourites').insertAdjacentHTML('beforeend', appendedNode);
}

function allowDrop(event) {
    event.preventDefault();
}

function removeCountry(event) {

    const id = event.target.parentElement.id;
    favourites = favourites.filter(e => e !== id);
    localStorage.setItem('fav', JSON.stringify(favourites));
    favCountries = favCountries.filter(c => c.cca2 !== id);
    document.getElementById(id).remove();
}
