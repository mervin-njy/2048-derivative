"use strict";

// base variables to access DOM
const header = document.querySelector("header");
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
];
// base variables to change grid/tile parameters
const gridCount = 4;
const gridSize = 100;
const gridBorder = 4;
const maxInitialTiles = 2;
const numFontSize = 40;
// access tiles as arrays for functions
const allTiles = [];

// on window load, construct board to fill tiles
window.addEventListener("load", (event) => {
  console.log("game board is loaded");
  //   alert(
  //     "Welcome to 2048 revamped, read the instructions below and you may begin when you are ready."
  //   );
  setBoard();
});

// setBoard() {} logic triggered by window onload
const setBoard = () => {
  //<div id="board"></div>
  const newBoard = document.createElement("div");
  newBoard.id = "board";
  newBoard.style.width = gridSize * gridCount + "px";
  newBoard.style.height = gridSize * gridCount + "px";
  newBoard.style.border = gridBorder + "px solid";
  newBoard.style.borderRadius = gridBorder * 2 + "px";
  newBoard.style.borderColor = "#17293d";

  header.after(newBoard);
  // construct tiles after board is set up
  createTiles();
};

// class Tile {} to store tile id and values, combine functions
class Tile {
  constructor(colInd, rowInd, num = 0) {
    (this.x = colInd), (this.y = rowInd), (this.num = num);
  }

  // construct DOM element with assigned value
  constructDOM() {
    //<div id="x y>">num</div>
    const newTile = document.createElement("div");
    newTile.id = this.x + " " + this.y;
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
    // fixed border colour
    tileDOM.style.borderColor = bluePalette[bluePalette.length - 1];
    if (this.num >= 2) {
      tileDOM.innerText = this.num;
      tileDOM.classList.add("t" + this.num);
    }
    // change tile colours
    if (this.num <= 2048) {
      // Math.log(this.num) / Math.log(2) - 0 is the opposite of math.pow()
      tileDOM.style.backgroundColor =
        bluePalette[Math.log(this.num) / Math.log(2) - 1];
    } else {
      tileDOM.style.backgroundColor = bluePalette[bluePalette.length - 1];
    }

    // reduce font size if num is too large
    if (this.num.toString().length <= 3) {
      tileDOM.style.fontSize = numFontSize;
    } else {
      tileDOM.style.fontSize =
        numFontSize - this.num.toString().length * 2 + "px";
    }

    // after tile 8, the font colour changes to white
    if (this.num <= Math.pow(2, 3)) {
      tileDOM.style.color = bluePalette[bluePalette.length - 1];
    } else {
      tileDOM.style.color = bluePalette[0];
    }
  }
}

// createTiles() {} logic triggered by setBoard()
const createTiles = () => {
  // construct array for each row
  let tileRow = [];
  // randomly generate starting tiles with values
  for (let i = 0; i < gridCount * gridCount; i++) {
    // construct new tile class to store index and value (col (x), row (y), num)
    const newTile = new Tile(
      i % gridCount,
      Math.floor(i / gridCount),
      Math.pow(2, i)
    );
    newTile.constructDOM();

    // fill tileRow array until length = gridCount
    tileRow.push(newTile);
    // if so, push to main array and empty tileRow for refill
    if (tileRow.length === gridCount) {
      allTiles.push(tileRow);
      tileRow = []; // reset row Array for new row
    }
  }
};

const generateNew = (tileCount) => {
  const currCount = 0;
  // loop through all tiles with val = 0
  // if currCount < tileCount
  // math.random() to add 2 or 4
  // else
  // break;
};

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

// FINAL: settings dropdown menu, change colour
