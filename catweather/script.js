async function loadWeather() {
    // Get latitude and longitude from query string
    const urlParams = new URLSearchParams(window.location.search);
    var loc_id = urlParams.get("loc_id")

    // If there is no latitude query string, do the default
    if (!loc_id){
        loc_id = "4990729" // location id for detroit
    }


    // make request to openmetero geo api to resolve location
    const geoAPI = `https://geocoding-api.open-meteo.com/v1/get?id=${loc_id}`

    var locationJSON = await (await fetch(geoAPI)).json()

    // do the location card
    $("#locationCardBody").append(getFlagElement(locationJSON.country_code.toLowerCase())).append(" " +locationJSON.name)
    $("#locationCardBody")

    console.log(locationJSON)

    // make request to weather API
    const openmeteroLink = 
        `https://api.open-meteo.com/v1/forecast?latitude=${locationJSON.latitude}&longitude=${locationJSON.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=${locationJSON.timezone}`

    var weatherJSON = await (await fetch(openmeteroLink)).json()

    console.log(weatherJSON)

    
    // do the cat image
    var image = await weathercodeImage(weatherJSON.current.weather_code)
    $("#catWeatherImage").attr("src", image)

    // update the cat pun
    var pun = await getPun(weatherJSON.current.weather_code)
    $("#catWeatherPun").text(pun)

    // update the non cat pun
    var nonPun = await getNonPun(weatherJSON.current.weather_code)
    $("#realWeatherCondition").text(`(${nonPun})`)

    // do the temperature descriptor
    var temperatureDescriptorString = `Current temperature is ${weatherJSON.current.temperature_2m}°F`
    $("#temperatureDescriptor").text(temperatureDescriptorString) 

}

async function weathercodeImage(code){ 
    return fetch("./images.json")
        .then((result) => result.json())
        .then(json => {
            return json[code];
        })
}

async function getPun(code){
    return fetch("./puns.json")
        .then((result) => result.json())
        .then(json => {
            return json[code];
        })
}

async function getNonPun(code){
    return fetch("./non-puns.json")
        .then((result) => result.json())
        .then(json => {
            return json[code];
        })
}


function getFlagElement(countryCode){
    return $("<img>").attr("src", `https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`).attr("width", "28")
}

loadWeather()