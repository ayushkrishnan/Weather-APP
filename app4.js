document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.weather_search');
    const searchInput = document.querySelector('.weather__searchform');
    const cityElement = document.querySelector('.weather_city');
    const dateTimeElement = document.querySelector('.weather_datetime');
    const weatherForecastElement = document.querySelector('.weather_forecast');
    const weatherIconElement = document.querySelector('.weather_icon');
    let temperatureElement = document.querySelector('.weather_temperature');
    const minMaxElement = document.querySelector('.weather_minmax');
    const realFeelElement = document.querySelector('.weather_realfeel');
    const humidityElement = document.querySelector('.weather_humidity');
    const windElement = document.querySelector('.weather_wind');
    const pressureElement = document.querySelector('.weather_pressure');

    const apiKey = 'a70a0e8903aca87e080d4b02798d69c1'; 
    let isCelsius = true;

    async function fetchWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
            const data = await response.json();

            cityElement.textContent = `${data.name}, ${data.sys.country}`;
            const date = new Date(data.dt * 1000); // Convert UNIX timestamp to date
            dateTimeElement.textContent = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
            weatherForecastElement.textContent = data.weather[0].description;
            weatherIconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
            const tempCelsius = Math.round(data.main.temp);
            const tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);

            if (isCelsius) {
                temperatureElement.textContent = `${tempCelsius}°C`;
                minMaxElement.innerHTML = `<p>Min: ${Math.round(data.main.temp_min)}°</p><p>Max: ${Math.round(data.main.temp_max)}°</p>`;
                realFeelElement.textContent = `${Math.round(data.main.feels_like)}°`;
            } else {
                temperatureElement.textContent = `${tempFahrenheit}°F`;
                minMaxElement.innerHTML = `<p>Min: ${Math.round((data.main.temp_min * 9) / 5 + 32)}°</p><p>Max: ${Math.round((data.main.temp_max * 9) / 5 + 32)}°</p>`;
                realFeelElement.textContent = `${Math.round((data.main.feels_like * 9) / 5 + 32)}°`;
            }

            humidityElement.textContent = `${data.main.humidity}%`;
            windElement.textContent = `${data.wind.speed} m/s`;
            pressureElement.textContent = `${data.main.pressure} hPa`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    // Set default location as Delhi
    fetchWeatherData('Delhi');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTerm = searchInput.value;
        fetchWeatherData(searchTerm);
        searchInput.value = ''; // Clear input field
    });

    // Update temperature unit to Celsius
    document.querySelector('.weather_unit_celsius').addEventListener('click', function () {
        if (!isCelsius) {
            isCelsius = true;
            temperatureElement = document.querySelector('.weather_temperature');
            fetchWeatherData(cityElement.textContent.split(',')[0]);
        }
    });

    // Update temperature unit to Fahrenheit
    document.querySelector('.weather_unit_farenheit').addEventListener('click', function () {
        if (isCelsius) {
            isCelsius = false;
            temperatureElement = document.querySelector('.weather_temperature');
            fetchWeatherData(cityElement.textContent.split(',')[0]);
        }
    });

    // Update temperature every 5 minutes (300,000 milliseconds)
    setInterval(() => {
        fetchWeatherData(cityElement.textContent.split(',')[0]);
    }, 300000);
});
