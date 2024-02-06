document.addEventListener('DOMContentLoaded', function () {
    // Event listener for form submission (city search)
    document.getElementById('city-search-form').addEventListener('submit', 
    function (event) {
        event.preventDefault();

        var cityInput = document.getElementById('city-input').value;
        getWeather(cityInput);
    });

});