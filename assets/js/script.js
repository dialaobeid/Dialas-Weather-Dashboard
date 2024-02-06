document.addEventListener('DOMContentLoaded', function () {
    // Event listener for form submission (city search)
    document.getElementById('city-search-form').addEventListener('submit',
        function (event) {
            event.preventDefault();

            var cityInput = document.getElementById('city-input').value;
            getWeather(cityInput);
        });


    // Function to get weather data from API
    function getWeather(city) {
        // created Openweather account to activate my own API key 
        var apiKey = "f4e7341f10db32cef5c9aa89dbcc4a4c";
        var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

        // API request using fetch 
        fetch(apiUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function (data) {
                // processes and displays current weather
                currentWeather(data);

                // processes and displays 5-day forecast
                cityForecast(data);

                // cities added to search hx
                addSearchHistory(city);
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    }

    // necessary conversion of temp and wind speed to proper units
        // Function to convert temp from K to F
        function kToF(kelvin) {
            return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
        }
        // Function to convert wind speed from m/s to mph
        function mPStoMPH(mps) {
            return (mps * 2.23694).toFixed(2);
        }

    // Function to display current city weather
    function currentWeather(data) {
        // variables to extract data from API
        var cityChoice = data.city.name;
        var date = new Date(data.list[0].dt * 1000);
        var icon = data.list[0].weather[0].icon;
        var temp = data.list[0].main.temp;
        var humidity = data.list[0].main.humidity;
        var wind = data.list[0].wind.speed;

        // Conversion variable for temp and wind
        var tempF = kToF(tempKelvin);
        var windMph = mPStoMPH(windMps);

        // Display current weather in the DOM
        document.getElementById('current-weather').innerHTML = `
        <h2>${cityChoice} - ${date.toDateString()}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temp} °F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity}%</p>
        `;
    }

});