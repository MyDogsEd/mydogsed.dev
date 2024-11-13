$("#pButton").on("click", () => {
    $("#outputs").append("<p>Test</p>")
})

$("#dynamicButton").on("click", () => {
    var newButton = $("<button></button>").addClass("btn btn-primary").text('See Console').on("click", () => {
        console.log("Test")
    })
    $("#outputs").append(newButton)
})

$("#tableButton").on("click", () => {
    var rows = prompt("How many rows?")
    var cols = prompt("How many cols?")

    for(var i = 1; i <= rows; i++){
        var row = $("<tr></tr>")
        for(var j = 1; j <= cols; j++) {
            var col = $("<td></td>").text("Row " + i + " Column " + j)
            row.append(col)
        }
        $("#outputs").append(row)
    }
})