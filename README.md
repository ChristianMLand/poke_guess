## Who's That Pokemon? Guessing Game

Author: Christian Land

This is a Pokemon guessing game developed with HTML, CSS, and JavaScript as an end-of-stack project for Coding Dojo's full stack program in August of 2020. The project mostly uses regular JavaScript for all of its logic, but JQuery was used in a few places for animations. Axios was used for making the API calls.

Pokemon Data and images from PokeAPI: https://pokeapi.co/

## The Start Screen
----------------------
- Min and max inputs are used to determine the range of Pokemon that will be selected from
- Default range is 1-151 if no values are provided
- Clicking "Play!" will start the game

![Pick Range](img/wtpg3.png?raw=true "Pick game range")

## The Game Screen
------------------
- The timer starts counting down from 20
- Your goal is to guess the correct name in the text input provided
- You get three attempts to guess correctly
- Either clicking "Guess!" or pressing the enter key will submit the guess

![Silhouette](img/wtpg.png?raw=true "Poke Silhouette")

## The End Screen
-----------------
- Reveals the selected Pokemon's image and name
- Increments your streak if you guessed correct, or resets it if you didn't
- Clicking "New Entry" will cycle through different Pokedex entries to give you more information on the Pokemon
- Clicking "Try Again" or "Next" will start the next round

![Dex Info](img/wtpg2.png?raw=true "Pokedex Info")

*There currently is no end to the game, and Pokemon may be repeated. This may change in the future.