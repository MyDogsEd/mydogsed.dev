const url = "https://api.giphy.com/v1/gifs/random?api_key=DZpSsuQeQDKPXdKNVaO365lUM3hQcMYE&rating=g&tag=kitty"

$("#getGif").on("click", () => {
    fetch(url).then((data) => data.json().then((jsonData) => {
        $("#catTitle").text(jsonData.data.title)
        $("#catGif").attr("src", jsonData["data"]["images"]["original"]["url"])
    }))
    $("#catGif")
})

$(document).ready(() => {
    fetch(url).then((data) => data.json().then((jsonData) => {
        $("#catTitle").text(jsonData.data.title)
        $("#catGif").attr("src", jsonData["data"]["images"]["original"]["url"])
    }))
})
