document.addEventListener('DOMContentLoaded', function(){
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
    }

    function fetchCoordinates(cityName) {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    fetchCurrentWeather(lat, lon);
                    fetchForecast(lat, lon);
                    addToHistory(cityName); 
                } else {
                    console.error('City not found');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchCurrentWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => console.error('Error:', error));
    }    

    function fetchForecast(lat, lon){
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function displayCurrentWeather(data) {
        currentWeatherDiv.innerHTML = `
        <h3>Current Weather in ${data.name}</h3>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph/h</p>
        `;
    }

    function displayForecast(data) {
        let forecastHTML = '<h3>5-Day Forecast</h3>';
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) {
                forecastHTML += `
                <div>
                    <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
                    <p>Temp: ${forecast.main.temp} °F</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                </div>
                `;
            }
        });
        forecastDiv.innerHTML = forecastHTML;
    }

    function addToHistory(cityName) {
        const newCity = document.createEmelent('li');
        newCity.textContent = cityName;
        historyList.appendChild(newCity);
    }

})