// Script file for the /search directory

// URL for open-metero's geocoding API
const CITIES_URL = "https://geocoding-api.open-meteo.com/v1/search?count=10&language=en&format=json&name="

// Get the query parameter
var query = new URLSearchParams(window.location.search).get("q");

// If there is no query, set the query value to "Detroit" as an example
if (!query){
    query = "Detroit"
}

// Set the query string value to the search box
$("#searchInput").val(query)


// For the query, get the first 10 cities
fetch(CITIES_URL + query)
    .then(response => response.json())
    .then(json => {

        if (!json.results){ // no results found
            console.log("no results found")
            $("#resultsContainer").append(cityCard("No results found :( Try another search term!"))
            return;
        }
        json.results.forEach(element => {
            console.log(element)
            $("#resultsContainer").append(
                cityCard(
                    `${element.name}, ${element.admin1}`, 
                    weatherLink(element.latitude, element.longitude), 
                    element.country_code.toLowerCase()
                )
            )
        });
            
    })

function weatherLink(lat, long){
    return `../?lat=${lat}&long=${long}`
}

function cityCard(text, link = "", ccode) {
    return $(`
        <div class="card mb-2">
            <a class="card-body text-decoration-none" href="${link}">
                <img src="https://hatscripts.github.io/circle-flags/flags/${ccode}.svg" width="32">
                ${text}
            </a>
            
        </div>
    `)
}