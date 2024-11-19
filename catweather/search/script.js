// Script file for the /search directory

// Get the query parameter
var query = new URLSearchParams(window.location.search).get("q");

// If there is no query, set the query value to "Detroit" as an example
if (!query){
    query = "Detroit"
}

// Set the query string value to the search box
$("#searchInput").val(query)


// For the query, get the first 10 cities