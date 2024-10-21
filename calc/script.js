var problem = ""

var history;
var historyIndex = 0;

Array.from(document.getElementsByTagName("button")).forEach((element) => {
    console.log("registering buttons")
    element.addEventListener("click", (event) => {

        // clear everything and return
        if (event.target.id === "ce" ){
            problem = "";
            document.getElementById("problem").innerText = "Problem: " + problem
            return;
        }
        // Calculate the problem
        else if (event.target.id === "="){
            calcProblem();
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

function calcProblem(){
    try {
        var solution = eval(problem)
        document.getElementById("answer").innerText = "Answer: " + solution
        history[historyIndex] = problem
        historyIndex++;
    } catch {
        document.getElementById("answer").innerText = "Answer: Error"
    }
}


function doHistory() {
    
}