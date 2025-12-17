const board = document.getElementById("board");
const startBtn = document.getElementById("start");
const info = document.getElementById("info");

let size, mineCount;
let cells = [];
let gameOver = false;
let openedCells = 0;

startBtn.addEventListener("click", startGame);
function startGame() {
  size = parseInt(document.getElementById("size").value);
  mineCount = parseInt(document.getElementById("mines").value);

  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${size}, 35px)`;

  cells = [];
  gameOver = false;
  openedCells = 0;
  info.textContent = "";

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.dataset.mine = "false";
    cell.dataset.open = "false";

    cell.addEventListener("click", () => openCell(i));
    cell.addEventListener("contextmenu", (e) => toggleFlag(e, i));

    board.appendChild(cell);
    cells.push(cell);
  }

  placeMines();
}

function placeMines() {
  let placed = 0;
  while (placed < mineCount) {
    const random = Math.floor(Math.random() * cells.length);
    if (cells[random].dataset.mine === "false") {
      cells[random].dataset.mine = "true";
      placed++;
    }
  }
}

function openCell(index) {
  if (gameOver) return;

  const cell = cells[index];

  if (
    cell.dataset.open === "true" ||
    cell.classList.contains("flag")
  ) return;

  if (cell.dataset.mine === "true") {
    revealMines();
    info.textContent = "💥 Game Over";
    gameOver = true;
    return;
  }

  cell.dataset.open = "true";
  cell.classList.add("open");
  openedCells++;

  const minesAround = countMines(index);

  if (minesAround > 0) {
    cell.textContent = minesAround;
  } else {
    revealNeighbors(index);
  }

  checkWin();
}

function countMines(index) {
  return getNeighbors(index).filter(
    i => cells[i].dataset.mine === "true"
  ).length;
}

function revealNeighbors(index) {
  const neighbors = getNeighbors(index);
  neighbors.forEach(i => {
    if (cells[i].dataset.open === "false") {
      openCell(i);
    }
  });
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / size);
  const col = index % size;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {

      if (r === 0 && c === 0) continue;

      const newRow = row + r;
      const newCol = col + c;

      if (
        newRow >= 0 && newRow < size &&
        newCol >= 0 && newCol < size
      ) {
        neighbors.push(newRow * size + newCol);
      }
    }
  }
  return neighbors;
}

function toggleFlag(e, index) {
  e.preventDefault();
  const cell = cells[index];

  if (cell.dataset.open === "true" || gameOver) return;

  cell.classList.toggle("flag");
  cell.textContent = cell.classList.contains("flag") ? "🚩" : "";
}

function revealMines() {
  cells.forEach(cell => {
    if (cell.dataset.mine === "true") {
      cell.classList.add("mine");
      cell.textContent = "💣";
    }
  });
}

function checkWin() {
  const totalSafeCells = size * size - mineCount;
  if (openedCells === totalSafeCells) {
    info.textContent = "🎉 ¡Ganaste!";
    gameOver = true;
  }
}
