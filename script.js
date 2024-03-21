//Const
const apiKey = '5ef3d4e93e69486ce865cc761ce0605a';
const forma = document.forms.forma;
const inputName = document.querySelector('.search');

//при загрузке узнаем координаты и выводим данные
const loadWeatherCoordinates = () => {
    navigator.geolocation.getCurrentPosition(async (e) => {
        const {latitude, longitude} = e.coords;

        let responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ru`);
        let weatherNow = await responce.json();
        if(weatherNow){
            showCurrentWeather(weatherNow)
        }
        else{
            document.querySelector('.container-block').innerHTML = `
            <div class="data">Не удается загрузить координаты, введите данные в поиск</div>
            `
       }


        let responce2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ru`);
        let weatherDays = await responce2.json();
        if(weatherDays){
            showWeatherDays(weatherDays)
        }
        else{
            document.querySelector('.days-title').innerHTML = `
        <div class="data">Введены некорректные данные, повторите ввод</div>
        `;
        document.querySelector('.block-days').innerHTML = '';
        }
        
    })
}
document.addEventListener('DOMContentLoaded', loadWeatherCoordinates);

//при поиске выводим данные
const searchWeather = async(e) => {
    e.preventDefault();
    let citySearch = inputName.value;
    let responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apiKey}&units=metric&lang=ru`);
    let weatherNow = await responce.json();
    if(weatherNow.base == "stations"){
        showCurrentWeather(weatherNow)
    }
    else{
        document.querySelector('.container-block').innerHTML = `
        <div class="data">Введены некорректные данные, повторите ввод</div>
        `
    }


    let responce2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&appid=${apiKey}&units=metric&lang=ru`);
    let weatherDays = await responce2.json();
    if(weatherDays.message == "city not found"){
        document.querySelector('.days-title').innerHTML = `
        <div class="data">Введены некорректные данные, повторите ввод</div>
        `;
        document.querySelector('.block-days').innerHTML = '';
    }
    else{
        showWeatherDays(weatherDays)
    }
}
forma.addEventListener('submit', searchWeather);


//выводим погоду в первое окно
const showCurrentWeather = (dataWeather) => {

    let dateOll = new Date();
    let month = dateOll.getMonth()+1 < 10 ? `0${dateOll.getMonth()+1}` : dateOll.getMonth()+1;

    let timeSunrise = new Date(dataWeather.sys.sunrise*1000);
    let timeSunset = new Date(dataWeather.sys.sunset*1000);
    let timeDuration = dataWeather.sys.sunset - dataWeather.sys.sunrise;
    let timeDurationHour = parseInt(timeDuration/3600);
    let timeDurationMinute = Math.round((timeDuration - timeDurationHour*3600)/60);
    inputName.value = `${dataWeather.name}, ${dataWeather.sys.country}`;

    document.querySelector('.container-block').innerHTML = `
            <div class="data">
                <h2>${dataWeather.name}, ${dataWeather.sys.country}</h2>
                <h4>ТЕКУЩАЯ ПОГОДА</h4>
                <h4 class="date">${dateOll.getDate()}.${month}.${dateOll.getFullYear()}</h4>
            </div>
            <div class="data-now">
                <div class="data-content1">
                    <img src="https://openweathermap.org/img/w/${dataWeather.weather[0].icon}.png" alt="" class="icon-data-now">
                    <span id="durations">${(dataWeather.weather[0].description)[0].toUpperCase() + (dataWeather.weather[0].description).slice(1)}</span>
                </div>
                <div class="data-content2">
                    <span id="temp">${Math.round(dataWeather.main.temp)}°С</span>
                    <span id="temp-feel">Ощущается как ${Math.round(dataWeather.main.feels_like)}°С</span>
                </div>
                <div class="data-content3">
                    <div>Восход солнца: <span class="sunrise">${timeSunrise.getHours()}:${timeSunrise.getMinutes()}</span></div>
                    <div>Заход солнца: <span class="sunset">${timeSunset.getHours()}:${timeSunset.getMinutes()}</span></div>
                    <div>Длительность дня: <span class="durations">${timeDurationHour}:${timeDurationMinute}</span></div>
                </div>
            </div>
    `
}

//выводим погоду на 5 дней
const showWeatherDays = (weather) => {
    document.querySelector('.block-days').innerHTML = '';
    document.querySelector('.days-title').innerHTML = `
        <h2 class="title">${weather.city.name}, ${weather.city.country}</h2>
        <h4>ПОГОДА В БЛИЖАЙШИЕ ДНИ</h4>
        ` 
    weather.list.map((data) => {
        if(data.dt_txt.includes("12:00:00")){
            let dateOll = new Date(data.dt*1000);
            let dayNumber = dateOll.getDay();
            let day = dayNumber == 0?'ВС':dayNumber == 1?'ПН':dayNumber == 2?'ВТ':dayNumber == 3?'СР':dayNumber == 4?'ЧТ':dayNumber == 5?'ПТ':'СБ';
            let date = dateOll.getDate();
            let month = dateOll.getMonth()+1 < 10 ? `0${dateOll.getMonth()+1}` : dateOll.getMonth()+1;
            let urlIcon = data.weather[0].icon;
            let temp = Math.round(data.main.temp);
            let description = data.weather[0].description;

            document.querySelector('.block-days').innerHTML += `
            <div class="one-day-container">
                <div class="daysWeek">${day}</div>
                <div class="daysMonth">${date}.${month}</div>
                <div><img src="https://openweathermap.org/img/w/${urlIcon}.png" alt=""></div>
                <div>${temp}°С</div>
                <div>${description}</div>
            </div>
        `
        }
    })
} 


//чистим инпут
const cleanInput = () => {
    inputName.value = '';
}
inputName.addEventListener('click', cleanInput);






