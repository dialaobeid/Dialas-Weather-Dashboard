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
                    throw new Error('Network response issue');
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
        return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
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

        // Conversion variables for temp and wind
        var tempF = kToF(temp);
        var windMph = mPStoMPH(wind);

        // Display current weather in the DOM
        document.getElementById('current-weather').innerHTML = `
            <h2>${cityChoice} - ${date.toDateString()}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${tempF} °F</p>
            <p>Wind: ${windMph} MPH</p>
            <p>Humidity: ${humidity}%</p>
        `;
    }

    // Function to display 5-day forecast
    function cityForecast(data) {
        // Get necessary data for the 5-day forecast
        var forecastData = data.list.filter(function (day) {
            // Slice will get the next 5 days / Data shown for each day ~ noon time 
            return new Date(day.dt * 1000).getUTCHours() === 12;
        }).slice(0, 5);

        // Display forecast in the DOM
        document.getElementById('forecast').innerHTML = `
            <h2>5-Day Forecast:</h2>
            <div class="forecast-container">
                ${forecastData.map(function (day) {

            // Conversion variables for temp and wind
            var tempF = ((day.main.temp - 273.15) * 9 / 5 + 32).toFixed(2);
            var windMPH = (day.wind.speed * 2.237).toFixed(2);

            return `
                    <div class="forecast-card">
                    <p>${new Date(day.dt * 1000).toDateString()}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
                    <p>Temperature: ${tempF} °F</p>
                    <p>Wind: ${windMPH} MPH</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                    </div>
                    `;
        }).join('')}
            </div>
        `;
    }


    // Function to add city to search hx
    function addSearchHistory(city) {
        // Get search hx from localStorage
        var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Add new city to the search hx
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);

            // updated search hx in localStorage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            // search hx in the DOM displayed
            document.getElementById('search-history').innerHTML = `
                <ul class="search-history-list">
                    ${searchHistory.map(function (item) {
                return `<li>${item}</li>`;
            }).join('')}
                </ul>
            `;
        }
    }

});