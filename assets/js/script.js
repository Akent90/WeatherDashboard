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

    
})