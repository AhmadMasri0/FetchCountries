const params = new URLSearchParams(window.location.search);

let name = params.get("name");

let darkMode = localStorage.getItem('mode') || false;

async function fetchCountryDetails() {

    const res = await fetch("https://restcountries.com/v3.1/name/" + name);
    const details = (await res.json())[0];
    const img = details.flags.svg;
    const native = Object.values(details.name.nativeName)[0].common;
    const population = details.population;
    const region = details.continents[0];
    const subRegion = details.subregion;
    const capital = details.capital[0];
    const tld = details.tld[0];
    const curr = Object.values(details.currencies)[0].name;
    const lang = Object.values(details.languages)[0];
    document.getElementById('img').src = img;
    document.getElementById('name').innerText = name;
    document.getElementById('native-name').innerText = native;
    document.getElementById('population').innerText = population.toLocaleString('en-US');
    document.getElementById('region').innerText = region;
    document.getElementById('subregion').innerText = subRegion;
    document.getElementById('capital').innerText = capital;
    document.getElementById('domain').innerText = tld;
    document.getElementById('currency').innerText = curr;
    document.getElementById('lang').innerText = lang;

    const countries = details.borders;

    for (let country of countries) {
        const r = await fetch('https://restcountries.com/v3.1/alpha/' + country);
        const temp = (await r.json())[0];
        const countryName = temp.name.official;
        const div = document.createElement('div');
        div.className = "back-shadow border-0 mb-3 rounded fw-light fs-6 text-center " +
            "align-center ps-1 pe-1 me-3 btn1 " + (darkMode == 'true' && 'shadow-dark-mode');
        const a = document.createElement('a');
        a.innerText = countryName
        a.className = 'toggle align-middle align-middle1 ' + (darkMode == 'true' && 'dark-mode');
        a.href = "./details.html?name=" + countryName;
        div.appendChild(a);
        document.getElementById('countries').appendChild(div);
    }

}

fetchCountryDetails();

if (darkMode == 'true') {
    activateMode();
}

function activateMode() {

    if (darkMode === true || darkMode === 'true')
        document.getElementById('mode').innerHTML = '<i class="bi bi-moon"></i> Light Mode';
    else
        document.getElementById('mode').innerHTML = '<i class="bi bi-moon "></i> Dark Mode';

    let elements = document.getElementsByClassName('toggle');
    for (let element of elements) {
        element.classList.toggle('dark-mode');
    }

    elements = document.getElementsByClassName('shadow-sm');
    for (let element of elements) {
        element.classList.toggle('shadow-dark-mode');
    }

    elements = document.getElementsByClassName('back-shadow');
    for (let element of elements) {
        element.classList.toggle('shadow-dark-mode');
    }
    document.getElementById('mode').classList.toggle('dark');
}

function toggleMode() {

    darkMode = !(darkMode === 'true' || darkMode === true);
    localStorage.setItem('mode', darkMode);

    activateMode();
}
