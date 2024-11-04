// keep track of what page the user is on
var page = 1;

// show a specific page.
function show(num) {

    // start by hiding all divs
    $("body div").each((i, ele) => {
        $(ele).hide()
    })

    // show the last div so the button logic can show the needed button
    $("body :nth-child(5)").show();


    // if we are on the last page, show everything
    // otherwise, show only the required page
    if (num === 5) {
        $("body div").each((i, ele) => {
            $(ele).show()
        })
    } else {
        $(`body :nth-child(${num})`).show()
    }

    // handle showing the needed button
    if (num === 1) {
        $("#prev").hide();
    } else {
        $("#prev").show();
    }

    if (num === 5) {
        $("#next").hide();
    } else {
        $("#next").show();
    }

    validateInput();

}

// handle validating the regex for each input
function validateInput(num) {
    switch (num) {
        case 1:
            var pass = !($("#numberInput").val().match("^[0-9]+$") == null)
            inputCSS("#numberInput", pass)
            return pass;
        case 2:
            var pass = !($("#letterInput").val().match("^[a-zA-Z]+$") == null)
            inputCSS("#letterInput", pass)
            return pass;
        case 3:
            var pass = !($("#specCharInput").val().match("^[^A-Za-z0-9]$") == null)
            inputCSS("#specCharInput", pass)
            return pass;
        case 4:
            var pass = !($("#numAndSpecCharInput").val().match("^[^a-zA-Z]+$") == null)
            inputCSS("#numAndSpecCharInput", pass)
            return pass
        case 5:
            return true;
    }

}

// handle adding and removing the css classes for an element
function inputCSS(elementName, valid){
    if (valid){
        $(elementName).removeClass("invalid")
        $(elementName).addClass("valid")
    } else {
        $(elementName).removeClass("valid")
        $(elementName).addClass("invalid")
    }
}

// button handlers for incrementing and decrementing the page
$("#prev").on("click", () => {
    page--
    show(page)
})

$("#next").on("click", () => {
    if (!validateInput(page)){
        return;
    }
    page++
    show(page)
})

// start by showing the first page
show(page)