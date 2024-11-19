function loadWeather() {
    // Get latitude and longitude from query string
    const urlParams = new URLSearchParams(window.location.search);
    const latitude = urlParams.get('lat');
    const longitude = urlParams.get("long");
    const timezone = urlParams.get("timezone")

    // make request to weather API
    const openmeteroLink = ""

}

loadWeather()