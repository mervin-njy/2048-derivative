"use strict";

// base variables to access DOM
const header = document.querySelector("header");
// base variables to change grid parameters
const gridCount = 4;

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
  header.after(newBoard);
  createTiles();
};

// class Tile {} to store tile id and values, combine functions
class Tile {
  constructor(colInd, rowInd) {
    (self.x = colInd), (self.y = rowInd);
  }

  constructDOM() {
    const newTile = document.createElement("div");
    newTile.id = self.x + " " + self.y;
    newTile.classList.add("tile");
    document.querySelector("#board").append(newTile);
  }
}

// createTiles() {} logic triggered by setBoard()
const createTiles = () => {
  for (let i = 0; i < gridCount * gridCount; i++) {
    const newTile = new Tile(i % gridCount, Math.floor(i / gridCount));
    newTile.constructDOM();
  }
};

// randomly generate numbers to fill individual tiles

// slideTile() {} Logic

// eventListener: keypress for sliding tiles

// FINAL: settings dropdown menu, change colour
