const params = new URLSearchParams(window.location.search);

let name = params.get("name");

let darkMode = JSON.parse(localStorage.getItem('mode'));

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
        div.className = "toggle back-shadow border-0 mb-3 rounded fw-light fs-6 text-center " +
            "align-center ps-1 pe-1 me-3 btn1 " + (darkMode && 'element-toggle');
        const a = document.createElement('a');
        a.innerText = countryName
        a.className = 'country align-middle align-middle1 ' + (darkMode && 'text-toggle');
        a.href = "./details.html?name=" + countryName;
        div.appendChild(a);
        document.getElementById('countries').appendChild(div);
    }

}

fetchCountryDetails();

if (darkMode) {
    activateMode();
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
    elements = document.getElementsByClassName('country');
    for (let element of elements) {
        element.classList.toggle('text-toggle');
    }
}

function toggleMode() {

    darkMode = !darkMode;
    localStorage.setItem('mode', darkMode);

    activateMode();
}
