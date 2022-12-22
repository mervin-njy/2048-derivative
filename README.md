# 2048-derivative

2048 is a popular puzzle game developed by Gabriele Cirulli back in 2014. With a simple gameplay of 4 sliding directions, the goal is to combine tiles of equal value to accumulate the score. To read more about the game's history and rules, do check out [2048's wiki](<https://en.wikipedia.org/wiki/2048_(video_game)#:~:text=2048%20is%20a%20single%2Dplayer,Cirulli%20and%20published%20on%20GitHub.>)

# Technologies used

1. The HTML document consists of 3 main parts

# General approach

# Major hurdles

1. Since the game interaction's sliding is triggered by arrow key presses, there still exists the default scrolling of the browser window when the display is too large. I tried removing event listener to prevent this issue, but it didn't work. After debugging with console.log(), I noticed that since I used keyup as a event listener, keydown has to happen in order to trigger keyup, since keyup can only happen after the key that is pressed down has been lifted. I figured that keydown could by default be enabling the scrollbar motion of the browser window.

2. After the main sliding logic has been completed, the generation of new tiles at the end of each turn was still triggered although the tiles cannot be combined at a slide event. I implemented a function to check if the board's tile arrangement is the same before and after the slide function was invoked.

3. Similarly, for the game over scenario to be triggered, I extended the duplicate checking for all 4 directions, to make sure that no other tiles can be combined or added onto the board.

4. When implementing the gameover modal box, the arrow key press event listener should be deactivated to prevent any further triggering of the event. I tried removing event listener but it did not work. Even if it did, I would have to add it back at board reset. To prevent that, I added a gameState variable to toggle false for the invoking of the sliding function.

# Unsolved problems / Future work

UI:

1. Dropdown selection does not work when fill tiles button has been clicked.
2. Restart button to be added.
3. Dropdown selection to vary grid count variable i.e. 3x3 grid, 4x4 grid, 5x5 grid.

Animation:

1. Although animation of the tiles mostly appeared correctly, there are a few instances combine animation did not trigger.
2. Apart from appear and combine animations of the tiles, sliding animation can help to visualize sliding direction better.

Script:

1. One of the stretch goals was to incorporate a sudden death/clear tiles event once 2048 has been reached. This was the result of reaching 2048 too many times when I was addicted to the game. When the event is triggered, a tile will be selected at random, i.e. 8, 16 or 32 with a glowing animation. Once the tile has been combined within 5 sliding turns, extra tiles will be added surrounding existing board of tiles, i.e. 4x4 grids expand into 6x6. Note that the existing tiles should still be kept! Once this happens, the exterior tiles are darker in colour (compared to existing empty tiles). This will trigger a popup element describing a challenge imposed to the user. For example, in 20 turns, there should be exactly 4 tiles of 8 left in the 4x4 grid. If the user clears the challenge, the tiles in the exterior ring will be removed and the score will increment by the total value of the removed tiles; if they fail, the game is instantly over. This sudden death scenario that reaps high gains will make the game more exciting.
