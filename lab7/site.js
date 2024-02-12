const weathersDiv = document.querySelector('.weathers');
const searchResults = document.querySelector('#search-results');
const searchInput = document.querySelector('#search-input');
const KEY = 'weathers';
const API_KEY = '8eddf6c2338aba7fe4e913545e639a97';
const URL_BASE = 'https://api.openweathermap.org/';
const FIVE_MINUTES = 5 * 60 * 1000;
let weathers = [];

class Weather {
    constructor(name, temp, humidity, icon) {
        this.id = parseInt(Math.random() * 100000);
        this.lastUpdate = Date.now();
        this.name = name;
        this.tempC = tempToC(temp);
        this.humidity = humidity;
        this.icon = icon;
    }
}

(async function init() {
    await reload();

    searchInput.addEventListener('keyup', search);
})();

async function reload() {
    await load();
    display();
}

setInterval(reload, FIVE_MINUTES / 5);

function tempToC(temp) {
    return Math.round(parseFloat(temp) - 273.15);
}

function saveWeathers() {
    localStorage.setItem(KEY, JSON.stringify(weathers));
}

async function add() {
    let value = searchInput.value;
    if (!value || weathers.length >= 10)
        return;


    let data = await getFromWeatherApi(value);
    if (data) {
        weathers.push(new Weather(data.name, data.main.temp, data.main.humidity, data.weather[0].icon));
        saveWeathers();
        display();

        searchInput.value = '';
        searchResults.replaceChildren();
    }
}

async function load() {
    weathers = JSON.parse(localStorage.getItem(KEY));
    if (!weathers) {
        weathers = [];
        return;
    }

    const fiveMinutesAgo = new Date(Date.now() - FIVE_MINUTES);

    for (const weather of weathers) {
        if (weather.lastUpdate < fiveMinutesAgo) {
            let data = await getFromWeatherApi(weather.name);
            if (data) {
                weather.lastUpdate = Date.now();
                weather.tempC = tempToC(data.main.temp);
                weather.humidity = data.main.humidity;
                weather.icon = data.weather[0].icon;
            }
        }
    }

    saveWeathers();
}

function display() {
    weathersDiv.replaceChildren();

    for (const weather of weathers) {
        let mainDiv = document.createElement('div');
        mainDiv.classList.add('weather');

        let nameSpan = document.createElement('span');
        nameSpan.innerText = weather.name;

        let infoDiv = document.createElement('div');
        infoDiv.classList.add('weather-info');

        let icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

        let textsDiv = document.createElement('div');
        textsDiv.classList.add('texts');

        let tempSpan = document.createElement('span');
        tempSpan.innerText = weather.tempC + ' °C';
        tempSpan.classList.add('temp');

        let humSpan = document.createElement('span');
        humSpan.innerText = weather.humidity + '% wilgotności';
        humSpan.classList.add('hum');

        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'USUŃ';
        deleteBtn.addEventListener('click', e => {
            let entity = weathers.find(x => x.id == weather.id);
            if (entity) {
                const index = weathers.indexOf(entity);
                if (index > -1) {
                    weathers.splice(index, 1);
                    saveWeathers();
                    display();
                }
            }
        });

        textsDiv.appendChild(tempSpan);
        textsDiv.appendChild(humSpan);

        infoDiv.appendChild(icon);
        infoDiv.appendChild(textsDiv);

        mainDiv.appendChild(nameSpan);
        mainDiv.appendChild(infoDiv);
        mainDiv.appendChild(deleteBtn);

        weathersDiv.appendChild(mainDiv);
    }
}

function weatherUrl(cityQuery) {
    return `${URL_BASE}data/2.5/weather?q=${cityQuery}&appid=${API_KEY}`;
}

function cityUrl(cityQuery) {
    return `${URL_BASE}geo/1.0/direct?q=${cityQuery}&limit=5&appid=${API_KEY}`;
}

async function getFromWeatherApi(cityQuery) {
    const apiUrl = weatherUrl(cityQuery);
    console.info('Making an weather API call to ' + apiUrl);

    return await getFromApi(apiUrl);
}

async function getFromCityApi(cityQuery) {
    const apiUrl = cityUrl(cityQuery);
    console.info('Making an city API call to ' + apiUrl);

    return await getFromApi(apiUrl);
}

async function getFromApi(apiUrl) {
    const response = await fetch(apiUrl);
    const json = await response.json();
    return json;
}

let searchNonce;
function search(e) {
    console.log(e);
    if (e.key == 'Enter') {
        add();
    }
    else if (e.key == 'ArrowDown') {
        const results = searchResults.childNodes[0].childNodes;
        let index = getIndex(results, e.target.value);

        if (index != -1 && index + 1 < results.length) {
            results[index + 1].classList.add('current');
            searchInput.value = results[index + 1].innerText;
        }
        else if (results.length > 0) {
            results[0].classList.add('current');
            searchInput.value = results[0].innerText;
        }
    }
    else if (e.key == 'ArrowUp') {
        const results = searchResults.childNodes[0].childNodes;
        let index = getIndex(results, e.target.value);

        if (index > 0) {
            results[index - 1].classList.add('current');
            searchInput.value = results[index - 1].innerText;
        }
        else if (results.length > 0) {
            results[results.length - 1].classList.add('current');
            searchInput.value = results[results.length - 1].innerText;
        }
    }
    else
    {
        // debounced for 300ms
        let thisNonce = Math.random();
        searchNonce = thisNonce;
    
        setTimeout(() => {
            if (thisNonce == searchNonce){
                doSearch(e.target.value);
            }
        }, 300);
    }
}

function getIndex(results, value){
    let index = -1;

    for (let i = 0; i < results.length; i++) {
        results[i].classList.remove('current');

        if (results[i].innerText == value) {
            index = i;
            break;
        }
    }

    return index;
}

async function doSearch(value) {
    searchResults.replaceChildren();

    if (value == '') {
        return;
    }

    let list = '';
    const data = await getFromCityApi(value);

    for (i = 0; i < data.length; i++) {
        let val = `${data[i].name},${data[i].country}`;
        if(!list.includes(val)) {
            list += `<li>${val}</li>`;
        }
    }
    searchResults.innerHTML = `<ul>${list}</ul>`;
}