const inputPlace = document.querySelector('#input-place');
const weathersDiv = document.querySelector('.weathers');
const KEY = 'weathers';
const API_KEY = '8eddf6c2338aba7fe4e913545e639a97';
const URL_BASE = 'https://api.openweathermap.org/data/2.5/weather';
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

(async function init(){
    await reload();
})();

async function reload() {
    await load();
    display();
}

setInterval(reload, FIVE_MINUTES / 5);

function tempToC(temp) {
    return Math.round(parseFloat(temp)-273.15);
}

function saveWeathers() {
    localStorage.setItem(KEY, JSON.stringify(weathers));
}

async function add() {
    let value = inputPlace.value;
    if (!value || weathers.length >= 10)
        return;
    

    let data = await getFromApi(value);
    if (data) {
        weathers.push(new Weather(data.name, data.main.temp, data.main.humidity, data.weather[0].icon));
        saveWeathers();
        display();

        inputPlace.value = '';
    }
}

async function load() {
    weathers = JSON.parse(localStorage.getItem(KEY));
    if (!weathers)
    {
        weathers = [];
        return;
    }

    const fiveMinutesAgo = new Date(Date.now() - FIVE_MINUTES);

    for(const weather of weathers) {
        if (weather.lastUpdate < fiveMinutesAgo) {
            let data = await getFromApi(weather.name);
            if (data) {
                weather.lastUpdate = Date.now();
                weather.tempC = tempToC(data.main.temp);
                weather.humidity = data.main.humidity;
                weather.icon = data.weather[0].icon;
            }
        }
    }
}

function display() {
    weathersDiv.replaceChildren();

    for (const weather of weathers){
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
            if(entity) {
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

function url(cityQuery) {
    return `${URL_BASE}?q=${cityQuery}&appid=${API_KEY}`;
}

async function getFromApi(cityQuery) {
    const apiUrl = url(cityQuery);
    console.info('Making an API call to ' + apiUrl);

    const response = await fetch(apiUrl);
    const json = await response.json();
    return json;
}