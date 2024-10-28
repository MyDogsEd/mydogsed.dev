// represents the possible moves for a player 
const MOVES = {
    ROCK: 0,
    PAPER: 1,
    SCISSORS: 2
}

// represents the results that are returned by eval_game
const GAMES = {
    COMPUTER_WIN: 0,
    COMPUTER_LOSE: 1,
    TIE: 2
}

// where the key is one of GAMES
const GAME_STRINGS = {
    0: "You lose!",
    1: "You win!",
    2: "It's a tie!"
}

// where the key is one of GAMES
var Scores = {
    0: 0,
    1: 0,
    2: 0
}

var PLAYER_MOVE;
var COMPUTER_MOVE;
// evaluates the game
// returns who won as a member of GAMES
function eval_game(player, computer){   
    switch (player){
        case MOVES.ROCK:
            // The player chose rock
            switch (computer){
                case MOVES.ROCK:
                    // tie
                    return GAMES.TIE;
                case MOVES.PAPER:
                    // computer wins
                    return GAMES.COMPUTER_WIN;
                case MOVES.SCISSORS:
                    // computer loses
                    return GAMES.COMPUTER_LOSE;
            }

        case MOVES.PAPER:
            // Player chose paper
            switch (computer){
                case MOVES.ROCK:
                    // computer loses
                    return GAMES.COMPUTER_LOSE;
                case MOVES.PAPER:
                    // tie
                    return GAMES.TIE;
                case MOVES.SCISSORS:
                    // computer wins
                    return GAMES.COMPUTER_WIN;
            }

        case MOVES.SCISSORS:
            // player chose scissors
            switch (computer){
                case MOVES.ROCK:
                    // computer wins
                    return GAMES.COMPUTER_WIN;
                case MOVES.PAPER:
                    // computer loses
                    return GAMES.COMPUTER_LOSE;
                case MOVES.SCISSORS:
                    // tie
                    return GAMES.TIE;
            }
        
    }
}

function main(){

    // register event listeners to the correct buttons
    document.getElementById("rockButton").addEventListener("click", button_listener);
    document.getElementById("paperButton").addEventListener("click", button_listener);
    document.getElementById("scissorsButton").addEventListener("click", button_listener);

}

function button_listener(event) {
    PLAYER_MOVE = parseInt(event.target.dataset.rpsMove);
    COMPUTER_MOVE = choose_computer_move();
    var gameResult = eval_game(PLAYER_MOVE, COMPUTER_MOVE);
    Scores[gameResult]++;
    document.getElementById("gameMessage").innerText = GAME_STRINGS[gameResult]
    updateScores();
}

// choose the move that the computer is going to make
function choose_computer_move(){
    var keys = Object.keys(MOVES)
    var random = Math.trunc(Math.random() * keys.length);
    return MOVES[keys[random]];
}

function tests() {
    // test the eval_game function
    console.log(eval_game(MOVES.ROCK, MOVES.PAPER) === GAMES.COMPUTER_WIN)
}

function updateScores(){
    document.getElementById("winsCount").innerText = Scores[GAMES.COMPUTER_LOSE]
    document.getElementById("lossesCount").innerText = Scores[GAMES.COMPUTER_WIN]
    document.getElementById("tiesCount").innerText = Scores[GAMES.TIE]
}

updateScores();
main();
//tests()