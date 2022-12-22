# 2048-derivative

2048 is a popular puzzle game developed by Gabriele Cirulli back in 2014. With a simple gameplay of 4 sliding directions, the goal is to combine tiles of equal value to accumulate the score.

# Technologies used

# General approach

# Major hurdles

1. Since the game interaction's sliding is triggered by arrow key presses, . Default scrolling of the browser window when the display is too large.

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
