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

    
})