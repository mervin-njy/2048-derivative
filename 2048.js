"use strict";

////////////////////--------------------------------------------------------------------------------------------
// VARIABLES ---------------------------------------------------------------------------------------------------
// base variables to access DOM
const body = document.querySelector("body");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const instructButton = document.querySelector(".instruction");
// access classes: board, and tile as nested array of Tile classes
let board = null;
let allTiles = [];
let instruction = document.querySelector(".instructions");
let dropdowns = null; // add this to collect array of dropdown buttons later on
// let storeScore = 0;   // store best score to reassign best score value after removing DOM elements
let score = document.querySelector("#score").innerHTML;
let bestScore = document.querySelector("#best-score").innerHTML;
let gameState = true;
// colour palette picker - [2, 4, 8.... >2048, emptyTileCol, board/borderCol]
const redPalette = [
  "#F3DEDA", // 2 + later font colors
  "#E9C9C3", // 4
  "#D3978C", // 8
  "#CE8678", // 16
  "#C97261", // 32
  "#BF604C", // 64
  "#9F402D", // 128
  "#8A3220", // 256
  "#732516", // 512
  "#5B1B0F", // 1024
  "#390E06", // >= 2048 + earlier font colors #390E06
  "#BFA49F", // 0
  "#220702", // border colour
];
const yellowPalette = [];
const orangePalette = [];
const greenPalette = [
  "#D5EFF0", // 2 + later font colors
  "#AACECE", // 4
  "#80B5B5", // 8
  "#6EA0A0", // 16
  "#598E8E", // 32
  "#497D7D", // 64
  "#3C7373", // 128
  "#336969", // 256
  "#285B5B", // 512
  "#214E4E", // 1024
  "#1B3333", // >= 2048 + earlier font colors
  "#80918C", // 0
  "#284445", // border colour
];
const bluePalette = [
  "#eef6ff", // 2 + later font colors
  "#cdddee", // 4
  "#a8c4e4", // 8
  "#789cc2", // 16
  "#53779d", // 32
  "#416082", // 64
  "#274361", // 128
  "#183453", // 256
  "#11263E", // 512
  "#0B1A2C", // 1024
  "#050F1D", // >= 2048 + earlier font colors
  "#929ca7", // 0
  "#283845", // border colour
];
const purplePalette = [
  "#F7EDFF", // 2 + later font colors
  "#E8DFF8", // 4 -- CHANGE THIS
  "#DED0F5", // 8
  "#C8B8E2", // 16
  "#B0A0CB", // 32
  "#9E8DBA", // 64
  "#84759A", // 128
  "#6B5C82", // 256
  "#53456A", // 512
  "#44365B", // 1024
  "#1B1425", // >= 2048 + earlier font colors
  "#978E9F", // 0
  "#332845", // border colour
];
let colPalette = greenPalette;
let minValCol = colPalette[0];
let maxValCol = colPalette[colPalette.length - 3];
let emptyTileCol = colPalette[colPalette.length - 2];
let borderCol = colPalette[colPalette.length - 1];
let docBackgroundCol = colPalette[Math.floor(colPalette.length * 0.8)];
let accentCol = colPalette[Math.floor(colPalette.length * 0.7)];
let accentCol2 = colPalette[Math.floor(colPalette.length * 0.4)];
// base variables to change grid/tile parameters
let gridCount = 4; // to be changed if resetBoard() is triggered later on
const newGridCount = 6;
let gridSize = 100; // to be changed if resetBoard() triggered later on
const newGridSize = (gridSize / newGridCount) * gridCount;
const gridBorder = 4;
const maxInitialTiles = 2;
const numFontSize = gridSize * 0.35;
const buttonWidth = gridSize; // this ensures that button size doesn't change even if board is reset
////////////////////--------------------------------------------------------------------------------------------
// CLASSES -----------------------------------------------------------------------------------------------------
// class Board {} to store board DOM and functions to manipulate it with events
class Board {
  constructor() {
    this.DOM = null;
  }

  // sets DOM element properties once setBoard() or resetBoard() is invoked
  constructDOM() {
    body.style.backgroundColor = maxValCol;
    body.style.color = minValCol;
    header.style.width = gridSize * gridCount + "px";
    footer.style.width = gridSize * gridCount + "px";
    document.querySelector("#best-score").innerHTML = bestScore;
    //<div id="board"></div>
    const newBoard = document.createElement("div");
    newBoard.id = "board";
    newBoard.style.width = gridSize * gridCount + "px";
    newBoard.style.height = gridSize * gridCount + "px";
    newBoard.style.border = gridBorder + "px solid";
    newBoard.style.backgroundColor = maxValCol;
    newBoard.style.borderRadius = gridBorder * 2 + "px";
    newBoard.style.borderColor = maxValCol;

    this.DOM = newBoard;
    header.after(newBoard);
  }

  // updates DOM colour properties when colour palette is swapped
  updateColour() {
    body.style.backgroundColor = maxValCol;
    body.style.color = minValCol;
    this.DOM.style.backgroundColor = maxValCol;
    this.DOM.style.borderColor = maxValCol;
  }
}

// class Tile {} to store tile id and values, combine functions
class Tile {
  // create id="trc", where r=row indices & c=column indices, also stores tile value under .num
  constructor(colInd, rowInd, num = 0) {
    (this.x = colInd),
      (this.y = rowInd),
      (this.num = num),
      (this.id = `t${this.x}${this.y}`),
      (this.DOM = null);
  }

  // sets DOM element properties once createTiles() is invoked
  constructDOM() {
    //<div id="x y>">num</div>
    const newTile = document.createElement("div");
    newTile.id = this.id;
    newTile.style.width = gridSize - gridBorder * 2 + "px";
    newTile.style.height = gridSize - gridBorder * 2 + "px";
    newTile.style.border = gridBorder + "px solid";
    newTile.style.borderRadius = gridBorder * 2 + "px";

    // add DOM classes for .tile and create tile within board DOM
    newTile.classList.add("tile");
    this.DOM = newTile;
    this.updateDOM();
    document.querySelector("#board").append(newTile);
  }

  // updateDOM has 2 update functions - to separate updateColour() when colour dropdown event is triggered
  updateDOM() {
    this.updateColour();
    this.updateNum();
  }

  // said updateColour() function
  updateColour() {
    // fixed border colour
    this.DOM.style.borderColor = borderCol;
    // change tile colours
    if (this.num < 2) {
      this.DOM.style.backgroundColor = emptyTileCol;
    } else if (this.num <= 2048) {
      // Math.log(this.num) / Math.log(2) - 0 is the opposite of math.pow()
      // ind  = 0, 1, 2, 3, 4... 11... => val = math.pow(2, ind) = 1, 2, 4, 8, 16... 2048... (let's just take 1 as 0 with val <2)
      this.DOM.style.backgroundColor =
        colPalette[Math.log(this.num) / Math.log(2) - 1];
    } else {
      this.DOM.style.backgroundColor = maxValCol;
    }

    // after tile 8, the font colour changes to lightest shade of palette (contrast with dark background)
    if (this.num <= Math.pow(2, 3)) {
      this.DOM.style.color = maxValCol;
    } else {
      this.DOM.style.color = minValCol;
    }
  }

  // update DOM element's number & font properties whenever it is changed from slide(), also triggers animation
  updateNum() {
    // update score
    document.querySelector("#score").innerHTML = score;
    // update number display and DOM class
    if (this.num >= 2) {
      this.DOM.innerText = this.num;
      this.DOM.classList.add("t" + this.num);
    } else {
      this.DOM.innerText = ""; // don't display if number is 1 or math.pow(2,1)
      this.DOM.style.backgroundColor = emptyTileCol;
    }

    this.DOM.style.fontSize = numFontSize + "px";
    // reduce font size if num is too large
    if (this.num.toString().length > 3) {
      this.DOM.style.fontSize =
        numFontSize - this.num.toString().length * 3 + "px";
    }

    // add combine and slide animation keyframes here
  }
}

// dropdown menu DOM creation within this class
class Dropdown {
  constructor() {
    (this.container = null),
      (this.select = null),
      (this.selected = null),
      (this.arrow = null),
      (this.menu = null),
      (this.option = null),
      (this.active = null);
  }

  updateDOM() {
    // assign this. properties with DOM selector
    this.container = document.querySelector(".dropdown");
    this.select = document.querySelector(".select");
    this.selected = document.querySelector(".selected");
    this.arrow = document.querySelector(".arrow");
    this.menu = document.querySelector(".menu");
    this.options = document.querySelectorAll(".menu li");
    this.active = document.querySelector(".active");

    // dimension calculations
    const border = gridBorder / 4;
    const margin = (gridBorder * 3) / 4;
    const width = gridSize - (margin + border) * 2;
    // update dimensions (of dropdown DOM) - to match the tiles
    this.container.style.width = width + "px";
    this.container.style.margin = margin + "px";
    this.select.style.width = width + "px";
    this.select.style.border = border + "px solid";
    this.menu.style.border = border + "px solid";
    // update dimensions (of buttons as well) - to match the tiles
    instructButton.style.width = width + "px";
    instructButton.style.margin = margin + "px";
    instructButton.style.border = border + "px solid";

    // change colours
    this.updateColour();
  }

  updateColour() {
    // change dropdown colours
    console.log("Updating dropdown colours");
    this.select.style.backgroundColor = maxValCol;
    this.select.style.color = minValCol;
    this.select.style.borderColor = minValCol;
    this.menu.style.backgroundColor = accentCol;
    this.menu.style.borderColor = maxValCol;
    this.menu.style.color = accentCol2;
    this.active.style.backgroundColor = maxValCol;
    // change button colours to match too
    instructButton.style.backgroundColor = maxValCol;
    instructButton.style.color = minValCol;
    instructButton.style.borderColor = minValCol;
    // change selection background colour
    document.documentElement.style.setProperty("--highlight-color", accentCol2);
  }

  // sets event listeners for dropdown clicks
  assignListeners() {
    // click event to select element (dropdown button)
    this.select.addEventListener("click", () => {
      // add clicked select style transition
      this.select.classList.toggle("select-clicked");
      // add arrow rotation style transition
      this.arrow.classList.toggle("arrow-rotate");
      // add menu opening style transition
      this.menu.classList.toggle("menu-open");
    });

    // click event for all menu options
    this.options.forEach((option) => {
      option.addEventListener("click", () => {
        // remove select-clicked class to prevent the style transition
        this.select.classList.toggle("select-clicked");
        // remove rotating transition
        this.arrow.classList.toggle("arrow-rotate");
        // remove menu opening style transition
        this.menu.classList.toggle("menu-open");
        // remove active class from all menu items
        this.active.classList.remove("active");
        // add active class to currently clicked item from menu
        option.classList.add("active");
        this.active = option;
        console.log(`active colour is now ${this.active.innerText}`);

        this.resetColour();
      });
    });
  }

  resetColour() {
    // checks active colour to change colour palette
    if (this.active.innerText === "red") {
      colPalette = redPalette;
    } else if (this.active.innerText === "green") {
      colPalette = greenPalette;
    } else if (this.active.innerText === "blue") {
      colPalette = bluePalette;
    } else if (this.active.innerText === "purple") {
      colPalette = purplePalette;
    }
    console.log("resetting colour");
    // update colour variables
    minValCol = colPalette[0];
    maxValCol = colPalette[colPalette.length - 3];
    emptyTileCol = colPalette[colPalette.length - 2];
    borderCol = colPalette[colPalette.length - 1];
    docBackgroundCol = colPalette[Math.floor(colPalette.length * 0.8)];
    accentCol = colPalette[Math.floor(colPalette.length * 0.7)];
    accentCol2 = colPalette[Math.floor(colPalette.length * 0.4)];

    // reset colour for the button selection too!
    this.updateColour();

    // trigger updateColour() for Board & Tile classes
    board.updateColour();
    for (let r = 0; r < allTiles.length; r++) {
      for (let c = 0; c < allTiles[r].length; c++) {
        allTiles[r][c].updateColour();
      }
    }
  }
}

////////////////////--------------------------------------------------------------------------------------------
// FUNCTIONS ---------------------------------------------------------------------------------------------------
// restarts game either by clicking restart at gameOver or restart button in menu

// ----------------------------------------------------------------------------------------- regarding the game
const restartGame = () => {
  // remove all existing game elements
  document.querySelector("#board").remove();
  document.querySelector(".modal").remove();
  // reset allTiles array to clean slate
  allTiles = [];
  // reset score and replace high score if it is higher than it
  if (Number(score) > Number(bestScore)) bestScore = score;
  score = 0;
  // reset game state and reset board for new game
  gameState = true;
  setBoard();
};

// ends the game due to tiles running out
const gameOver = () => {
  gameState = false; // stops eventlistener from ocurring when you slide tiles
  console.log("Game over. Would you like to restart?");

  const mainColour = docBackgroundCol;
  const accentColour = minValCol;
  // create HTML DOM: Modal & modal content
  // <div class="modal">
  const modalBox = document.createElement("div");
  modalBox.classList.add("modal");
  //  <div class="modal-content">
  const modalDisplay = document.createElement("div");
  modalDisplay.classList.add("modal-content");
  modalDisplay.style.width = gridSize * gridCount * 1.2 + "px";
  modalDisplay.style.backgroundColor = mainColour;
  modalDisplay.style.color = accentColour;
  //      <h3>gameover text</h3>
  const modalText = document.createElement("h3");
  modalText.innerText = "Game over. Would you like to restart?";
  modalDisplay.append(modalText);

  //      <button class="restart-button">restart</button>
  const restartButton = document.createElement("button");
  restartButton.classList.add("restart-button");
  restartButton.innerText = "YES PLEASE";
  restartButton.style.backgroundColor = accentColour;
  restartButton.style.color = mainColour;
  modalText.after(restartButton);
  // </div></div>
  modalBox.append(modalDisplay);
  header.after(modalBox);

  // restart game once button is clicked
  restartButton.addEventListener("click", () => {
    restartGame();
  });
};

// similar to gameOver modal box - open one to display instructions
const openInstructions = () => {
  console.log("Showing game instructions");

  const mainColour = docBackgroundCol;
  const accentColour = minValCol;
  // create HTML DOM: Modal & modal content
  // <div class="modal">
  const modalBox = document.createElement("div");
  modalBox.classList.add("modal");
  //  <div class="modal-content">
  const modalDisplay = document.createElement("div");
  modalDisplay.classList.add("modal-content");
  modalDisplay.style.width = gridSize * gridCount * 2 + "px";
  modalDisplay.style.backgroundColor = mainColour;
  modalDisplay.style.color = accentColour;
  //      <h3>instruction text</h3>
  const modalTitle = document.createElement("h4");
  modalTitle.innerText = "How to play:";
  modalDisplay.append(modalTitle);
  //      <h3>instruction text</h3>
  const modalText1 = document.createElement("p");
  modalText1.innerText =
    "2048 is a puzzle game that progresses with sliding tiles. The goal is to accumulate tiles of as high value as possible. To achieve this, you can slide the board in one direction in each turn, and adjacent tiles with the same number on them can be combined, and the tile will double in value.";
  const modalText2 = document.createElement("p");
  modalText2.innerText =
    "There are only 4 directions to slide - up, down, left and right! Just use the arrow keys on your keyboard to activate your move.";
  modalDisplay.append(modalText1, modalText2);

  //      <button class="close-button">X</button>
  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.innerText = "Got it, let me play!";
  closeButton.style.backgroundColor = accentColour;
  closeButton.style.color = mainColour;
  modalText2.after(closeButton);
  // </div></div>
  modalBox.append(modalDisplay);
  header.after(modalBox);

  // add event listener for close button to remove instruction display
  closeButton.addEventListener("click", () => {
    document.querySelector(".modal").remove();
  });
};

// -------------------------------------------------------------------- regarding board & tile element creation
const resetBoard = () => {
  gridSize = newGridSize;
  gridCount = newGridCount;
  setBoard();
};

// setBoard() {} logic triggered by window onload
const setBoard = () => {
  // constructs new board element with properties based on grid count, default = 4
  board = new Board();
  board.constructDOM();
  // construct tiles after board is set up
  createTiles();
  // update button dropdowns
  const newDropdown = new Dropdown();
  newDropdown.updateDOM();
  newDropdown.assignListeners();
};

// createTiles() {} logic triggered by setBoard()
const createTiles = () => {
  // construct array for each row
  let tileRow = [];
  // randomly generate starting tiles with empty values
  for (let i = 0; i < gridCount * gridCount; i++) {
    // construct new tile class to store index and value (col (x), row (y), num)
    const newTile = new Tile(
      i % gridCount,
      Math.floor(i / gridCount)
      // Math.pow(2, i)
    );
    // num = Math.pow(2, i) to see values with colours
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
  generateNew(maxInitialTiles, countTileValue(0));
};

// -------------------------------------------------------------------------------- general functions for reuse
// counts total number of empty tiles left on the board
const countTileValue = (val) => {
  // val = 1 refers to empty tiles, finding number of val = 2048 can trigger next event
  let count = 0;

  for (let r = 0; r < allTiles.length; r++) {
    for (let c = 0; c < allTiles[r].length; c++) {
      if (allTiles[r][c].num === val) {
        count++;
      }
    }
  }
  return count;
};

// ------------------------------------------------------------------------ main functions for game interaction
// generate new tiles at the end of each sliding step, only true if there are empty tiles
const generateNew = (tileCount, emptyTiles) => {
  // function to get array of emptyTiles for randomized tile allocation
  const emptyTileArray = (nestedArr) => {
    const arr = [];
    for (let r = 0; r < nestedArr.length; r++) {
      for (let c = 0; c < nestedArr[r].length; c++) {
        if (nestedArr[r][c].num === 0) {
          arr.push(nestedArr[r][c]);
        }
      }
    }
    return arr;
  };

  // function to assign value in the tile's DOM
  const addVal = (tileToAdd) => {
    tileToAdd.num = Math.ceil(Math.random() * 2) * 2; // returns 2 or 4 randomly
    tileToAdd.updateDOM(); // update values to DOM element's properties
    return 1;
  };

  // get empty tiles to choose from
  const allEmpty = emptyTileArray(allTiles);
  // randomly assign tiles with values n times
  for (let i = 0; i < tileCount; i++) {
    const randomTileIndex = Math.floor(Math.random() * (emptyTiles - i));
    addVal(allEmpty[randomTileIndex]);
    allEmpty.splice(randomTileIndex, 1);
  }
};

// triggers with slide(dir), "flattens" array in a specific direction
const combineTiles = (row) => {
  // creates a new array without the zeroes
  const filterZero = (arr) => arr.filter((num) => num !== 0);

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
  // 4. add back zeroes to the back (while row is not full)
  while (newRow.length < gridCount) {
    newRow.push(0);
  }
  return newRow;
};

// slide(dir) {} Logic
const slide = (dir) => {
  console.log("Sliding " + dir);
  // console.log(allTiles);
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
    return newArray;
  };

  // checks arrays before and after sliding, if its the same, return false so generateTiles() does not get invoked
  const checkDuplicate = (arrayOne, arrayTwo) => {
    let same = true;
    // loops through each tile value for comparison
    for (let r = 0; r < arrayOne.length; r++) {
      for (let c = 0; c < arrayOne[r].length; c++) {
        if (arrayOne[r][c].num !== arrayTwo[r][c]) {
          same = false;
          break;
        }
      }
    }
    return same;
    // true = array is the same throughout, don't change
    // false = not the same, change
  };

  const checkAdjacency = (dir) => {
    let same = false;
    let arr = allTiles;
    // transpose arr to check for vertical adjacency
    if (dir === "vertical") arr = transposeArray(arr);

    // loops through each tile to compare with adjacent tile's value
    for (let r = 0; r < arr.length; r++) {
      // compare for all rows
      for (let c = 0; c < arr[r].length - 1; c++) {
        // last column not required to compare (index +1 will exceed range)
        if (arr[r][c].num === arr[r][c + 1].num) {
          same = true; // change to true if any adjacent tile can be combined
          break;
        }
      }
    }
    if (same) {
      console.log(`${dir} direction can still slide.`);
    } else {
      console.log(`${dir} direction cannot move anymore.`);
    }
    return same;
    // true = tiles still can combine, game is not over
    // false = tiles cannot combine anymore, gameOver
  };

  // start with initial array to manipulate,
  // if dir === left, continue combining as per normal (correct direction in combineTiles by flattening leftwards)
  // if dir === right, reverse() array, before combineTiles(), then reverse() to get back original
  // if dir === up, tranposeArray(), before combineTiles(), then transposeArray() to get back
  // if dir == down, transposeArray(), array.reverse(), combineTiles(array), array.reverse(), transposeArray()
  // then finally remap values onto tile DOM's innerText based on  actual tile class' .num property
  let initialArr = allTiles;

  if (dir === "up" || dir === "down") {
    initialArr = transposeArray(initialArr);
  }

  let combinedArr = [];
  // 1. loop through each row of Tiles to "flatten"
  for (let r = 0; r < initialArr.length; r++) {
    let currRow = [];
    // 2. convert tile class array into array of their numbers
    for (const t of initialArr[r]) {
      currRow.push(t.num);
    }

    // 3. combine function
    if (dir === "left" || dir == "up") {
      // a. combine values and update as new row
      currRow = combineTiles(currRow);
    } else if (dir === "right" || "down") {
      // b. manipulate row if slide dir is right
      currRow.reverse();
      currRow = combineTiles(currRow);
      currRow.reverse();
    }
    combinedArr.push(currRow);
  }

  if (dir === "up" || dir === "down") {
    combinedArr = transposeArray(combinedArr);
  }

  // checks if after combination, array is the same: false => change / true => don't change
  if (checkDuplicate(allTiles, combinedArr) === false) {
    // 4. convert numbers back to .num of each tile
    // maps combinedArr values into allTiles' tile classes
    for (let r = 0; r < allTiles.length; r++) {
      allTiles[r].map((element, index) => {
        element.num = combinedArr[r][index];
        element.updateDOM();
      });
    }

    // generate new tile for next step, however we need a condition to check if the tile layout changed after sliding
    generateNew(1, countTileValue(0));
  }

  // after generating new tile, check if the new board can still rearrange tiles
  // 1. check if board has empty tiles
  if (countTileValue(0) === 0) {
    // 2. if board has no more space, check if adjacent tiles can be combined (in both directions) => either is false = gameOver()
    if (checkAdjacency("horizontal") || checkAdjacency("vertical")) {
      console.log("game continues");
    } else {
      gameOver();
    }
  }
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
  (e) => {
    if (e.defaultPrevented) {
      return; // Do nothing if event was already processed
    }
    if (gameState === true) {
      switch (e.key) {
        case "ArrowDown":
          // slide(down)
          slide("down");
          break;
        case "ArrowUp":
          // slide(up)
          slide("up");
          break;
        case "ArrowLeft":
          // slide(left)
          slide("left");
          break;
        case "ArrowRight":
          // slide(right)
          slide("right");
          break;
        case "Escape":
          // requestRestart()
          break;
        default:
          return; // Quit when this doesn't handle the key event
      }
    }
    e.preventDefault();
  },
  true
);

// keyup has preventdefault to prevent scrollbar from moving, but when you keyup, keydown has to happen too, use this to prevent scrolling
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown":
      e.preventDefault();
      break;
  }
});

instructButton.addEventListener("click", () => {
  openInstructions();
});
