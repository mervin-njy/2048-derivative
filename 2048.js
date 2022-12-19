"use strict";

////////////////////--------------------------------------------------------------------------------------------
// VARIABLES ---------------------------------------------------------------------------------------------------
// base variables to access DOM
const header = document.querySelector("header");
// colour palette picker - [2, 4, 8.... >2048, emptyTileCol, board/borderCol]
const bluePalette = [
  "#eef6ff",
  "#cdddee",
  "#a8c4e4",
  "#789cc2",
  "#53779d",
  "#49688a",
  "#365375",
  "#274361",
  "#183453",
  "#17293d",
  "#09192c",
  "#929ca7",
  "#283845",
];
const colPalette = bluePalette;
// base variables to change grid/tile parameters
const gridCount = 4;
const totalTiles = gridCount * gridCount;
const gridSize = 100;
const gridBorder = 4;
const maxInitialTiles = 2;
const numFontSize = 40;
// access tiles as arrays for functions
const allTiles = [];

////////////////////--------------------------------------------------------------------------------------------
// CLASSES -----------------------------------------------------------------------------------------------------
// class Tile {} to store tile id and values, combine functions
class Tile {
  constructor(colInd, rowInd, num = 0) {
    (this.x = colInd),
      (this.y = rowInd),
      (this.num = num),
      (this.id = `t${this.x}${this.y}`);
  }

  // construct DOM element with assigned value
  constructDOM() {
    //<div id="x y>">num</div>
    const newTile = document.createElement("div");
    newTile.id = this.id;
    newTile.style.width = gridSize - gridBorder * 2 + "px";
    newTile.style.height = gridSize - gridBorder * 2 + "px";
    newTile.style.border = gridBorder + "px solid";
    newTile.style.borderRadius = gridBorder * 2 + "px";

    // add classes for .tile, and tile+num
    newTile.classList.add("tile");
    this.updateVal(newTile);
    document.querySelector("#board").append(newTile);
  }

  // update tile's value in the DOM whenever it is changed
  updateVal(tileDOM) {
    // update number display and DOM class
    if (this.num >= 2) {
      tileDOM.innerText = this.num;
      tileDOM.classList.add("t" + this.num);
    } else {
      tileDOM.style.backgroundColor = colPalette[colPalette.length - 2];
    }

    // fixed border colour
    tileDOM.style.borderColor = colPalette[colPalette.length - 1];
    // change tile colours
    if (this.num <= 2048) {
      // Math.log(this.num) / Math.log(2) - 0 is the opposite of math.pow()
      tileDOM.style.backgroundColor =
        colPalette[Math.log(this.num) / Math.log(2) - 1];
    } else {
      tileDOM.style.backgroundColor = colPalette[colPalette.length - 3];
    }

    // reduce font size if num is too large
    if (this.num.toString().length <= 3) {
      tileDOM.style.fontSize = numFontSize;
    } else {
      tileDOM.style.fontSize =
        numFontSize - this.num.toString().length * 3 + "px";
    }

    // after tile 8, the font colour changes to white
    if (this.num <= Math.pow(2, 3)) {
      tileDOM.style.color = colPalette[colPalette.length - 3];
    } else {
      tileDOM.style.color = colPalette[0];
    }
  }
}

////////////////////--------------------------------------------------------------------------------------------
// FUNCTIONS ---------------------------------------------------------------------------------------------------
// setBoard() {} logic triggered by window onload
const setBoard = () => {
  //<div id="board"></div>
  const newBoard = document.createElement("div");
  newBoard.id = "board";
  newBoard.style.width = gridSize * gridCount + "px";
  newBoard.style.height = gridSize * gridCount + "px";
  newBoard.style.border = gridBorder + "px solid";
  newBoard.style.backgroundColor = colPalette[colPalette.length - 1];
  newBoard.style.borderRadius = gridBorder * 2 + "px";
  newBoard.style.borderColor = colPalette[colPalette.length - 1];

  header.after(newBoard);
  // construct tiles after board is set up
  createTiles();
};

// createTiles() {} logic triggered by setBoard()
const createTiles = () => {
  // construct array for each row
  let tileRow = [];
  // randomly generate starting tiles with empty values
  for (let i = 0; i < totalTiles; i++) {
    // construct new tile class to store index and value (col (x), row (y), num)
    const newTile = new Tile(i % gridCount, Math.floor(i / gridCount));
    newTile.constructDOM();

    // fill tileRow array until length = gridCount
    tileRow.push(newTile);
    // if so, push to main array and empty tileRow for refill
    if (tileRow.length === gridCount) {
      allTiles.push(tileRow);
      tileRow = []; // reset row Array for new row
    }
  }

  // generate specific number of tiles to have starting values at random
  generateNew(2, totalTiles);
};

// generate new tiles at the end of each sliding step, only true if there are empty tiles
const generateNew = (tileCount, emptyTiles) => {
  let currCount = 0;
  let remainingTiles = totalTiles;
  // lower chance of added value if lesser empty tiles
  const randValue = emptyTiles / (totalTiles * 1.2);
  // function to assign value in the tile's DOM
  const addVal = (tileToAdd) => {
    tileToAdd.num = Math.ceil(Math.random() * 2) * 2;
    tileToAdd.updateVal(document.querySelector("#" + tileToAdd.id));
    return 1;
  };
  // loop through all tiles
  for (let r = 0; r < allTiles.length; r++) {
    for (let c = 0; c < allTiles[r].length; c++) {
      const currTile = allTiles[r][c];
      console.log(currTile);
      console.log(remainingTiles);
      // if number of tiles to be filled not achieved, continue running
      if (currCount < tileCount && currTile.num == 0) {
        if (remainingTiles === tileCount - currCount) {
          // checks if the number of tiles left in the loop is = tiles to be filled, just assign value
          // this accounts for last few tiles to be filled
          currCount += addVal(currTile);
        } else {
          // else check for random value before assigning value
          if (Math.random() > randValue) {
            currCount += addVal(currTile);
          }
        }
      } else {
        break;
      }
      remainingTiles--;
    }
  }
};

// triggers with slideTile(dir), removes 0 and combine val if equivalent, then add 0 to end of array
const combineTiles = () => {};

// slideTile(dir) {} Logic
const slideTile = (dir) => {
  // use nested array allTiles to compare row/column
  // use .transpose (map) function to swap row w/ column
  // use .reverse for array in opposite direction
  if (dir === "right") {
    // shift tiles right wards (+.reverse())
  } else if (dir === "up") {
    // shift tiles upwards (.transpose())
  } else if (dir === "down") {
    // shift tiles downwards (.transpose().reverse())
  }
  // updateTiles() - leftwards direction is default 2D array arrangement
};

////////////////////--------------------------------------------------------------------------------------------
// EVENT LISTENERS ---------------------------------------------------------------------------------------------
// on window load, construct board to fill tiles
window.addEventListener("load", (event) => {
  console.log("game board is loaded");
  //   alert(
  //     "Welcome to 2048 revamped, read the instructions below and you may begin when you are ready."
  //   );
  setBoard();
});

// eventListener: keypress for sliding tiles
window.addEventListener(
  "keyup",
  (event) => {
    if (event.defaultPrevented) {
      return; // Do nothing if event wasalready processed
    }

    switch (event.key) {
      case "ArrowDown":
        // slideTile(down)
        slideTile("down");
        console.log("sliding down");
        break;
      case "ArrowUp":
        // slideTile(up)
        slideTile("up");
        console.log("sliding up");
        break;
      case "ArrowLeft":
        // slideTile(left)
        slideTile("left");
        console.log("sliding left");
        break;
      case "ArrowRight":
        // slideTile(right)
        slideTile("right");
        console.log("sliding right");
        break;
      case "Escape":
        // requestRestart()
        break;
      // default:
      //   return; // Quit when this doesn't handle the key event
    }
    // Cancel the default action to avoid being handled twice
    event.preventDefault();
  },
  true
);

// Colour palette settings: settings dropdown menu
// addEventListener
