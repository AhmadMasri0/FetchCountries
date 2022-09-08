let darkMode = JSON.parse(localStorage.getItem('mode'));


let allCountries = [];
let currCountries = [];

function displayCountries(countries) {

    document.getElementById('container').innerText = '';
    for (let country of countries) {
        const capital = country.capital ? country.capital[0] : '-';
        const name = country.name.common;
        const flag = country.flags.svg;
        const population = country.population;
        const region = country.continents[0];

        const card = `
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 border-0"> 
            <div class="card shadow-sm border-0" id="card">
                <a href="./details.html?name=${name}">
                    <img src="${flag}" alt="${name}" class="card-img-top">
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
}



search();

function clearFilter() {
    document.getElementById('filter').innerText = 'Filter by Region';
    document.getElementById('clear').style.display = 'none';
    search();
}

function filterByRegion(region) {

    document.getElementById('clear').style.display = 'block';
    document.getElementById('filter').innerText = region;

    const c = allCountries.filter(country => {
        if (country.region.includes(region)) {
            return country;
        }
    });

    currCountries = c;

    displayCountries(c);
}


async function search() {
    const search = document.getElementById('search').value;
    const isFilterCleared = document.getElementById('filter').innerText === 'Filter by Region';

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
