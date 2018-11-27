# Tetris
Game Tetris - modified version of popular Tetris game. There are additional features described below.
Additional features allow to practise the adaptation to changes and improve spacial orientation.
After completing the game the User is rewarded with random Chuck Norris Joke downloaded from API.
Game was created as a final project in JavaScript developer:React course in Coders Lab. 

**Technology:** CSS3, HTML5, JS, ES6, Webpack, npm, Babel-loader and REST Api.

**Installation:** Webpack is required for installation. Webpack file is added. For installation you have to use npm install command.

There are four main **additional features** of this game compared with the original one:
1. The presence of an additional button: **Rotate Tetris**. It rotates the game-board upside-down. When clicking the button again the game returns to normal.
2. Button **Change Keys** - when clicked it switches actions of left and right keys. The elements moves right when left arrow is clicked and moves left when right arrow is clicked.
3. Button **Slow down**. The game slows down for single element. It can be used 4 times.
4. **Bomb element**. It is marked red. When it drops down and collides with elements already present on the board or with board it detonates all already occupied elements in rage of 1 box.

Others (game handling):
1. Description box.
- The description of action of selected additional special button appears inside the box when the mouse is over the button of interest.
- Information about the bomb element appears in the box when the bomb element is falling down.
2. The Chuck Norris joke is filtered for the presence of inappropriate words.

The graphic was downloaded from 
https://www.wallpapervortex.com/wallpaper-20707_funny_ants_playing_tetris.html#.W5JKd6JR3IV

**Status:** completed

