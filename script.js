/*
Author: Christian Land 
Date: 07/24/2020
*/
//TODO complete refactor

const TIME_LIMIT = 20;
const FULL_DASH_ARRAY = 283;
const EXCEPTIONS = [122, 250, 439, 474, 772, 782, 783, 784, 785, 786, 787, 788];//pokemon that have punctuation in their names

//state variables
let gameStarted = false;
let gameOver = false;
let score = 0;
let attempts = 0;
let choice, poke;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval;

(() => {
    document.querySelector(".guess-btn").innerText = "Play!";
    document.querySelector('.score').innerHTML = "";
    document.querySelector('.guess-input').style.display = 'none';
    document.querySelector(".guess-btn").addEventListener('click', game);
    document.querySelector(".guess-wrapper").addEventListener('keydown', function(e) {
        if (e.keyCode === 13) game();
    })
})()

/**
* returns a random number between given values (inclusive)
*/
function pickRand(min=1, max=151){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * formats a given dex entry string to something more readable and returns it
 * @param {*} str a dex entry string to format
 */
function formatString(str){
    //gets rid of words that are all caps
    str = str.split(' ').map(cur => {
        if(cur.length > 1 && cur[1].toUpperCase() === cur[1]){
            cur = cur.toLowerCase();
            cur = cur[0].toUpperCase() + cur.slice(1);
        }
        return cur;
    }).join(" ");
    str = str.replace("POKéMON", "Pokémon");

    //removes return characters
    str = str.replace('\f',' ');
    str = str.replace('\n',' ');
    return str.replace('\r',' ');
}

/**
 * Filters out all the english dex entries and returns a random one
 */
function getEnglishEntry(){
    let cur = document.querySelector(".dex-entry").innerText;
    let entries = poke.flavor_text_entries;
    let english = [];
    let r;

    for (let i = 0; i < entries.length; i++) {
        if(entries[i].language.name === "en")
            english.push(formatString(entries[i].flavor_text));
    }

    do {
        r = pickRand(0, english.length-1);
    } while(cur == english[r]);
    
    return english[r];
}

/**
 * Takes a time and returns it formatted to have 2 minimum integers
 * @param {*} time time to be formatted
 */
function formatTime(time) {
    return time.toString().padStart(2, '0')
}

/**
 * draws the circle
 */
function setCircleDasharray() {
    const circleDasharray = `${(timeLeft/TIME_LIMIT * FULL_DASH_ARRAY).toFixed(0)} 283`;
    document.querySelector(".base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray)
}

//Draws the timer
function drawTimer() {
    document.getElementById("timer").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer-svg" viewBox="0 0 100 100" fill="none">
            <path
                stroke-dasharray="283"
                class="base-timer-path-remaining"
                d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                ">
            </path>
        </svg>
        <span class="base-timer-label">
            ${formatTime(timeLeft)}
        </span>
        </div>`;
}

function game(){
    if(!gameStarted || gameOver){
        document.querySelector(".range-wrapper").style.display = "none";
        newGame();
    } else {
        playGame(document.querySelector(".guess-input").value);
    }
}

/**
 * initializes a fresh game state (keeps score persistant)
 */
function newGame(){
    attempts = 0;
    gameOver = false;
    gameStarted = true;
    let min = parseInt(document.querySelector("#input-min").value) || 1;
    let max = parseInt(document.querySelector("#input-max").value) || 151;
    choice = pickRand(min, max);
    axios.get(`https://pokeapi.co/api/v2/pokemon-species/${choice}`, {
            headers: {'Access-Control-Allow-Origin': '*'}
    })
    .then(pokemon => {
        poke = pokemon.data;
        document.querySelector('.score').innerHTML = `${score} streak!`;
        document.querySelector('.guess-btn').innerText = "Guess!";
        document.querySelector('.guess-input').style.display = "inline-block";
        document.querySelector(".guess-input").value = "";
        document.querySelector(".poke-wrapper").innerHTML = "<div class='poke'/>";

        const pokepoke = document.querySelector(".poke");
        pokepoke.style["-webkit-mask-image"] = `url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${choice}.png")`;
        pokepoke.style["-webkit-mask-repeat"] = "no-repeat";
        pokepoke.style["-webkit-mask-size"] = "contain";
        pokepoke.style["-webkit-mask-position"] = "center";

        document.querySelector('.result').innerHTML = "<h1></h1>";
        document.querySelector('.dex-entry').innerHTML = "";
        document.querySelector(".title").innerHTML = "Who's that Pokemon?";

        if ($(".dex-wrapper").is(":visible")) {
            $(".dex-wrapper").toggle("slide");
        }
        startTimer();
    })
    .catch(err => console.log(err));
}

/**
 * initializes the timer
 */
function startTimer() {
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    drawTimer();
    setCircleDasharray();
    timerInterval = setInterval(() => {
        timePassed++;
        timeLeft = TIME_LIMIT - timePassed;
        document.querySelector(".base-timer-label").innerHTML = formatTime(timeLeft);
        setCircleDasharray();
        if(timeLeft === 0) setGameOverState(lost=true);
    }, 1000);
}



/**
 * does the game loop 
 * @param {*} guess players current guess
 */
function playGame(guess){
    let name = poke.name;
    if(!EXCEPTIONS.includes(choice)){
        name = poke.name.split("-")[0];
    }
    if(guess.toLowerCase() === name) {
        setGameOverState(lost=false)
    } else if (attempts === 2) {
        setGameOverState(lost=true);
    } else {
        attempts++;
        handleMistake();
    }
}

/**
 * Handles the mistake shake animation when a user types an incorrect answer or the timer runs out
 */
function handleMistake() {
    const scoreBox = document.querySelector('.score');
    const guessBtn = document.querySelector('.guess-btn');

    scoreBox.classList.add("shake");
    guessBtn.setAttribute('disabled', true)//TODO pull this code out and the code in playgame into its own function
    setTimeout(() => {
        guessBtn.removeAttribute('disabled');
        scoreBox.classList.remove("shake")
    }, 800);
}


/**
 * Fills the dex entry container with a new english entry
 */
function fillDexEntry() {
    const dexEntry = document.querySelector('.dex-entry')
    dexEntry.innerHTML = getEnglishEntry()
}

/**
 * styles the game over state depending on whether win or lose
 * @param {*} attempts number of wrong name guesses
 */
function setGameOverState(lost=false){
    clearInterval(timerInterval);
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    document.getElementById('timer').innerHTML = "";
    let btntxt, titletxt;
    const scoreBox = document.querySelector('.score');
    const guessBtn = document.querySelector('.guess-btn');
    if (lost) {
        btntxt = "Try Again";
        titletxt = "Oops, not quite!";
        score = 0;
        handleMistake();
    } else {
        btntxt = "Next";
        titletxt = "Nice job!";
        score++;
    }
    gameOver = true;
    document.querySelector(".result").innerHTML = `<h1>${`It's ${poke.name}!`}</h1>`
    scoreBox.innerHTML = `${score} streak!`;
    $(".dex-wrapper").toggle("slide");
    const pokeDiv = document.querySelector('.poke');
    pokeDiv.style["background-image"] = `url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${choice}.png")`;
    pokeDiv.style["background-repeat"] = "no-repeat";
    pokeDiv.style["background-size"] = "contain";
    pokeDiv.style["background-position"] = "center";
    guessBtn.innerHTML = `${btntxt}`;
    document.querySelector('.title').innerHTML = titletxt
    document.querySelector(".new-entry-btn").addEventListener("click", fillDexEntry);
    fillDexEntry()
}

