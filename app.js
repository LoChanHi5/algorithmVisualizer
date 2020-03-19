const matrixSizeElement = document.getElementById("js-matrixSize");
const matrixElement = document.getElementById("js-matrix");
const algoListElement = document.getElementById("js-algoList");

matrixSizeElement.addEventListener("change", e => {
  const matrixSize = parseInt(e.target.value);

  if (1 <= matrixSize && matrixSize <= 25) {
    updateMatrixBySize(matrixSize);
  }
});

matrixElement.addEventListener("click", e => {
  const target = e.target;

  if(target && target.id.startsWith("row-")) {
    updateStartAndEndCells(target);
  }
})

algoListElement.addEventListener("click", e => {
  if (!e.target) return;

  switch(e.target.id) {
    case 'js-randomSearch':
      randomSearch();
      break;
    default:
      return;
  }
})

function updateMatrixBySize(matrixSize) {
  while(matrixElement.firstChild) {
    matrixElement.removeChild(matrixElement.lastChild)
  }

  for (let i = 1; i <= matrixSize; i++) {
    const colElement = document.createElement("ul");
    colElement.setAttribute("id", `col-${i}`);
    colElement.setAttribute("class", "column");

    for (let i = 1; i <= matrixSize; i++) {
      const rowElement = document.createElement("li");
      rowElement.setAttribute("id", `row-${i}`);
      rowElement.setAttribute("class", "row");
      colElement.appendChild(rowElement);
    }

    matrixElement.appendChild(colElement);
  }

  tracker.matrixSize = matrixSize;
}

const tracker = {
  startingCell: null,
  endingCell: null,
  isStartingCellSet: false,
  isEndingCellSet: false,
  currentCell: null,
  matrixSize: 0
}

function updateStartAndEndCells(target) {
  if (tracker.isStartingCellSet && tracker.isEndingCellSet) {
    tracker.startingCell.style.backgroundColor = 'white';
    target.style.backgroundColor = 'green';
    tracker.startingCell = target;
    tracker.isEndingCellSet = false;
  } else if(tracker.isStartingCellSet) {
    if(tracker.endingCell) {
      tracker.endingCell.style.backgroundColor = 'white'
    }
    target.style.backgroundColor = 'black';
    tracker.endingCell = target;
    tracker.isEndingCellSet = true;
  } else {
    target.style.backgroundColor = 'green';
    tracker.startingCell = target;
    tracker.isStartingCellSet = true;
  }
}

function randomSearch() {
  if (!tracker.startingCell || !tracker.endingCell) return;

  let direction;
  tracker.currentCell = tracker.startingCell;

  while (tracker.currentCell != tracker.endingCell) {
    paths = validPaths(tracker.currentCell)
    direction = Math.floor(Math.random() * 10) % paths.length;

    if (isNaN(direction)) return;

    switch(paths[direction]) {
      case 'up':
        nextCell = up(tracker.currentCell);
        break;
      case 'right':
        nextCell = right(tracker.currentCell);
        break;
      case 'down':
        nextCell = down(tracker.currentCell);
        break;
      case 'left':
        nextCell = left(tracker.currentCell);
    }

    tracker.currentCell = nextCell;
    tracker.currentCell.style.backgroundColor = 'blue';
  }

  if (tracker.currentCell == tracker.endingCell) {
    tracker.currentCell.style.backgroundColor = 'purple';
  }
}

function currentRow(cell) {
  return parseInt(cell.id.split('-')[1]);
}

function currentCol(cell) {
  return parseInt(cell.parentNode.id.split('-')[1]);
}

function isNotVisited(cell) {
  return cell.style.backgroundColor == ''
    || cell.style.backgroundColor == 'white'
    || cell.style.backgroundColor == 'black';
}

function up(cell) {
  if (currentRow(cell) - 1 <= 0) return;

  const nextCell = cell.previousSibling;

  if (isNotVisited(nextCell)) return nextCell;
}

function right(cell) {
  if (currentCol(cell) + 1 > tracker.matrixSize) return;

  const nextCell = cell.parentNode.nextSibling.querySelector(`#row-${currentRow(cell)}`)

  if (isNotVisited(nextCell)) return nextCell;
}

function down(cell) {
  if (currentRow(cell) + 1 > tracker.matrixSize) return;

  const nextCell = cell.nextSibling;

  if (isNotVisited(nextCell)) return nextCell;
}

function left(cell) {
  if (currentCol(cell) - 1 <= 0) return;

  const nextCell = cell.parentNode.previousSibling.querySelector(`#row-${currentRow(cell)}`)

  if (isNotVisited(nextCell)) return nextCell;
}

function validPaths(cell) {
  let paths = [];

  if (up(cell)) paths.push('up');
  if (down(cell)) paths.push('down');
  if (right(cell)) paths.push('right');
  if (left(cell)) paths.push('left');

  return paths;
}
