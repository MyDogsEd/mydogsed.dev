async function loadWeather() {
    // Get latitude and longitude from query string
    const urlParams = new URLSearchParams(window.location.search);
    const latitude = urlParams.get('lat');
    const longitude = urlParams.get("long");
    const timezone = urlParams.get("timezone")

    // make request to weather API
    const openmeteroLink = 
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=${timezone}`

    fetch(openmeteroLink)
        .then((response) => response.json())
        .then(async (json) => {
            console.log(json)
            var image = await weathercodeImage(json.current.weather_code)
            var imageEle = $(`<img src="${image}">`)
            $("#temperatureContainer").append(imageEle)
        })
}

async function weathercodeImage(code){ 
    return fetch("./images.json")
        .then((result) => result.json())
        .then(json => {
            return json[code];
        })
}

loadWeather()