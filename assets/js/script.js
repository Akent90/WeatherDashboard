document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const currentWeatherDiv = document.getElementById('currentWeather');
    const forecastDiv = document.getElementById('forecast');
    const historyList = document.getElementById('historyList');
    const apiKey = 'e5d02244f2fdf8cc53a789407a0475c6';

    searchForm.addEventListener('submit', handleSearch);

    function handleSearch(event) {
        event.preventDefault();
        const cityName = searchInput.value;
        fetchCoordinates(cityName);
        searchInput.value = '';
    }

    function fetchCoordinates(cityName) {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    fetchWeather(lat, lon, cityName);
                } else {
                    console.error('City not found');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchWeather(lat, lon, cityName) {
        fetchCurrentWeather(lat, lon, cityName);
        fetchForecast(lat, lon);
    }

    function fetchCurrentWeather(lat, lon, cityName) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                if (!cityAlreadyInHistory(cityName)) {
                    addToHistory(cityName);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchForecast(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function displayCurrentWeather(data) {
        const date = new Date().toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        currentWeatherDiv.innerHTML = `
            <h3>Current Weather in ${data.name} (${date})</h3>
            <img src="${iconUrl}" alt="Weather Icon"
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
        `;
    }

    function displayForecast(data) {
        let forecastHTML = '<h3>5-Day Forecast</h3>';
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) {
                const date = new Date(forecast.dt_txt).toLocaleDateString();
                const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

                forecastHTML += `
                    <div>
                        <h4>${date}</h4>
                        <img src="${iconUrl}" alt="Weather Icon">
                        <p>Temp: ${forecast.main.temp} °F</p>
                        <p>Humidity: ${forecast.main.humidity}%</p>
                        <p>Wind Speed: ${forecast.wind.speed} mph</p>
                    </div>
                `;
            }
        });
        forecastDiv.innerHTML = forecastHTML;
    }

    function addToHistory(cityName) {
        const newCity = document.createElement('li');
        newCity.textContent = cityName;
        newCity.addEventListener('click', function() {
            fetchCoordinates(cityName);
        });
        historyList.appendChild(newCity);
    }

    function cityAlreadyInHistory(cityName) {
        return Array.from(historyList.children).some(cityLi => cityLi.textContent === cityName);
    }
});