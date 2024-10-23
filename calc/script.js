var problem = ""

var history;
var historyIndex = 0;

Array.from(document.getElementsByTagName("button")).forEach((element) => {
    console.log("registering buttons")
    element.addEventListener("click", (event) => {
        // set the random color of the button
        var randColor = getRandomColor()
        event.target.style = "background-color: " + randColor;

        // add the keystroke to the history list
        if (event.target.id != "historyButton"){
            var ptag = document.createElement("p")
            ptag.textContent = event.target.id
            document.getElementById("offcanvasBody").appendChild(ptag)
        }
        
        // clear everything and return
        if (event.target.id === "ce" ){
            problem = "";
            document.getElementById("problem").innerText = "Problem: " + problem

            // reset the colors of all of the buttons
            for(var btn of document.getElementsByTagName("button")){
                console.log(btn)
                btn.style = "";
            }
            return;
        }
        // Calculate the problem
        else if (event.target.id === "="){
            var solution = calcProblem();
            var ptag = document.createElement("p")
            ptag.textContent = solution
            document.getElementById("offcanvasBody").appendChild(ptag)

            return;
        } 
        // Do the history button thing
        else if (event.target.id === "historyButton"){
            history
        }
        // Add the current number or modifier to the problem
        else {
            var modifier = event.target.id
            problem += modifier
            document.getElementById("problem").innerText = "Problem: " + problem
        }
    })
});

function getRandomColor(){
    return "rgb(" + Math.trunc(Math.random() * 255) + ", " + Math.trunc(Math.random() * 255) + ", " + Math.trunc(Math.random() * 255) + ");";
}

function calcProblem(){
    try {
        var solution = eval(problem)
        document.getElementById("answer").innerText = "Answer: " + solution
        history[historyIndex] = problem
        historyIndex++;
        return solution;
    } catch {
        document.getElementById("answer").innerText = "Answer: Error"
    }
}


function doHistory() {
    
}