"use strict";

////////////////////--------------------------------------------------------------------------------------------
// VARIABLES ---------------------------------------------------------------------------------------------------
// base variables to access DOM
const header = document.querySelector("header");
let score = document.querySelector("#score").innerText;
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
const greenPalette = [
  "#E1F6E6",
  "#BEDEC8",
  "#A1C3B4",
  "#82ABA1",
  "#53779d",
  "#63A091",
  "#4D9587",
  "#368A7C",
  "#328071",
  "#2E7565",
  "#26604E",
  "#80918C",
  "#0C2C22",
];
const colPalette = greenPalette;
// base variables to change grid/tile parameters
const gridCount = 4;
const totalTiles = gridCount * gridCount;
const gridSize = 100;
const gridBorder = 4;
const maxInitialTiles = 2;
const numFontSize = 40;
// access tiles as nested array of Tile classes
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
    // update score
    document.querySelector("#score").innerText = "" + score;
    // update number display and DOM class
    if (this.num >= 2) {
      tileDOM.innerText = this.num;
      tileDOM.classList.add("t" + this.num);
    } else {
      tileDOM.innerText = ""; // don't display if number is 1 or math.pow(2,1)
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
  generateNew(2, countEmpty());
};

// counts total number of empty tiles left on the board
const countEmpty = () => {
  let count = 0;
  for (let r = 0; r < allTiles.length; r++) {
    for (let c = 0; c < allTiles[r].length; c++) {
      if (allTiles[r][c].num === 0) {
        count++;
      }
    }
  }
  return count;
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

// triggers with slideTile(dir), "flattens" array in a specific direction
const combineTiles = (dir) => {
  // creates a new array without the zeroes
  const filterZero = (row) => row.filter((num) => num !== 0);

  // combines adjacent tile values
  const combineAdjacent = (row) => {
    // 1. remove zero => e.g. from [0, 2, 2, 4]
    let newRow = filterZero(row); // to [2, 2, 4]
    // 2. check adjacent value and combine
    for (let c = 0; c < newRow.length - 1; c++) {
      if (newRow[c] === newRow[c + 1]) {
        newRow[c] *= 2;
        newRow[c + 1] = 0; // [2, 2, 4] => [4, 0, 4]
        score = score * 1 + newRow[c];
      }
    }
    // 3. remove zeroes again
    newRow = filterZero(newRow); // [4, 4]
    // 4. add back zeroes to the back
    while (newRow.length < gridCount) {
      newRow.push(0);
    }
    return newRow;
  };

  // 1. loop through each row of Tiles to "flatten"
  for (let r = 0; r < allTiles.length; r++) {
    let currRow = [];
    // 2. convert tile class array into array of their numbers
    for (const t of allTiles[r]) {
      currRow.push(t.num);
    }

    // 3. combine function
    if (dir === "left") {
      // 3a. combine values and update as new row
      currRow = combineAdjacent(currRow);
    } else if (dir === "right") {
      // 3b. manipulate row if slideTile dir is right
      currRow.reverse();
      currRow = combineAdjacent(currRow);
      currRow.reverse();
    }

    // 4. convert numbers back to .num of each tile
    allTiles[r].map((element, index) => {
      element.num = currRow[index];
      element.updateVal(document.querySelector(`#${element.id}`));
    });
  }
  generateNew(1, countEmpty());
};

// slideTile(dir) {} Logic
const slideTile = (dir) => {
  // for transposing array if dir === up and down
  const transposeArray = (nestedArray) => {
    const newArray = [];
    for (let row = 0; row < nestedArray.length; row++) {
      const innerArray = [];
      for (let col = 0; col < nestedArray[row].length; col++) {
        innerArray.push(nestedArray[col][row]);
        if (innerArray.length === nestedArray[row].length) {
          newArray.push(innerArray);
        }
      }
    }
  };

  // if (dir === "Up" || dir === "down") {
  //   for (let r = 0; r < allTiles.length; r++) {
  //     let transposedRow = [allTiles[0][r], allTiles[1][r]];
  //   }
  // }

  combineTiles(dir);
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
