let darkMode = localStorage.getItem('mode') || false;

console.log(darkMode)

function displayCountries(countries) {

    document.getElementById('container').innerText = '';
    for (let country of countries) {
        const capital = country.capital[0];
        const name = country.name.official;
        const flag = country.flags.svg;
        const population = country.population;
        const region = country.continents[0];

        const card = document.createElement('div');
        card.className = "card col-lg-3 col-md-4 col-sm-6 col-xs-12 border-0 toggle " +
            ((darkMode === 'true' || darkMode === true) && "dark-mode");

        const a = document.createElement('a');
        a.href = "./details.html?name=" + name;

        const img = document.createElement('img');
        img.className = "card-img-top shadow-sm";
        img.src = flag;

        const innerDiv = document.createElement('div');
        innerDiv.className = `card-body shadow-sm bg-white toggle 
        ${(darkMode === 'true' || darkMode === true) && "dark-mode shadow-dark-mode"}`;

        const h5 = document.createElement('h5');
        h5.className = "card-title mb-3 mt-2 fw-bold";
        h5.innerText = name;

        const p1 = document.createElement('p');
        p1.innerText = "Population: ";
        p1.className = "card-text mb-1 fs-6";
        const span1 = document.createElement('span');
        span1.className = "fw-light";
        span1.innerText = population.toLocaleString('en-US');
        p1.appendChild(span1);

        const p2 = document.createElement('p');
        p2.innerText = "Region: ";
        p2.className = "card-text mb-1 fs-6";
        const span2 = document.createElement('span');
        span2.className = "fw-light";
        span2.innerText = region;
        p2.appendChild(span2);

        const p3 = document.createElement('p');
        p3.innerText = "Capital: ";
        p3.className = "card-text mb-1 fs-6";
        const span3 = document.createElement('span');
        span3.className = "fw-light";
        span3.innerText = capital;
        p3.appendChild(span3);

        innerDiv.appendChild(h5);
        innerDiv.appendChild(p1);
        innerDiv.appendChild(p2);
        innerDiv.appendChild(p3);

        a.appendChild(img);
        a.appendChild(innerDiv);

        card.appendChild(a);
        document.getElementById('container').appendChild(card);
    }
}

async function fetchAllCountries() {

    const res = await fetch("https://restcountries.com/v3.1/all");
    const countries = await res.json();

    displayCountries(countries);

}

fetchAllCountries();

function clearFilter() {
    document.getElementById('filter').innerText = 'Filter by a Region';
    document.getElementById('clear').style.display = 'none';
    fetchAllCountries();
}

async function filterByRegion(region) {
    document.getElementById('clear').style.display = 'block';
    document.getElementById('filter').innerText = region;
    const res = await fetch("https://restcountries.com/v3.1/region/" + region);
    const countries = await res.json();
    displayCountries(countries);
}


async function search() {
    const search = document.getElementById('search').value;
    console.log(search)
    let res;
    if (search === '')
        res = await fetch("https://restcountries.com/v3.1/all");
    else
        res = await fetch("https://restcountries.com/v3.1/name/" + search);

    const countries = await res.json();
    displayCountries(countries);
}


function activateMode() {
    if (darkMode === true || darkMode === 'true') {
        document.getElementById('mode').innerHTML = '<i class="bi bi-moon"></i> Light Mode';
    } else
        document.getElementById('mode').innerHTML = '<i class="bi bi-moon "></i> Dark Mode';

    let elements = document.getElementsByClassName('toggle');
    for (let element of elements) {
        element.classList.toggle('dark-mode');
    }
    elements = document.getElementsByClassName('shadow-sm');
    for (let element of elements) {
        element.classList.toggle('shadow-dark-mode');
    }
    elements = document.getElementsByClassName('dropdown-item');
    for (let element of elements) {
        element.classList.toggle('dropdown-item-shadow');
    }
    document.getElementById('mode').classList.toggle('dark');
}

function toggleMode() {

    darkMode = !(darkMode === true || darkMode === 'true');
    localStorage.setItem('mode', darkMode);
    activateMode();
}

if (darkMode == 'true') {
    activateMode();
    console.log('ggggg')
}
