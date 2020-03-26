const matrixSizeElement = document.getElementById("js-matrixSize");
const matrixElement = document.getElementById("js-matrix");
const algoListElement = document.getElementById("js-algoList");

document.addEventListener("DOMContentLoaded", e => {
  updateMatrixBySize(20);
});

matrixSizeElement.addEventListener("change", e => {
  const matrixSize = parseInt(e.target.value);

  if (1 <= matrixSize && matrixSize <= 25) {
    updateMatrixBySize(matrixSize);
    tracker.visited = {};
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
    case 'js-dfs':
      dfs();
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

function dfs() {
  if (!tracker.startingCell || !tracker.endingCell) return;

  let visited = {};
  let found = false;
  let timeout = 100;
  const paths = ['up', 'right', 'down', 'left'];
  helper(tracker.startingCell, false);

  function helper(cell) {
    if (!cell || found || currentColRow(cell) in visited) {
      return;
    } else if (cell === tracker.endingCell) {
      found = true;
    }

    visited[currentColRow(cell)] = true;

    setTimeout(currentCell => {
      if (currentCell === tracker.endingCell) {
        currentCell.style.backgroundColor = 'purple';
      } else if (cell !== tracker.startingCell) {
        currentCell.style.backgroundColor = 'blue';
      }
    }, timeout += 200, cell)

    paths.forEach(path => {
      helper(nextCell(path, cell), found);
    })
  }
}

function nextCell(path, cell) {
  switch(path) {
    case 'up':
      return navigation.up(cell);
    case 'right':
      return navigation.right(cell);
    case 'down':
      return navigation.down(cell);
    case 'left':
      return navigation.left(cell);
  }
}

function randomSearch() {
  if (!tracker.startingCell || !tracker.endingCell) return;

  currentCell = tracker.startingCell;

  const paths = ['up', 'down', 'left', 'right'];
  let direction;
  let visited = {[currentColRow(currentCell)]: true};
  let timeout = 100;
  let tempCell;

  while (currentCell != tracker.endingCell) {
    while (currentColRow(currentCell) in visited) {
      direction = Math.floor(Math.random() * 10) % 4;
      tempCell = nextCell(paths[direction], currentCell);

      while (!tempCell) {
        direction = Math.floor(Math.random() * 10) % 4;
        tempCell = nextCell(paths[direction], currentCell);
      }

      currentCell = tempCell;
    }

    visited[currentColRow(currentCell)] = true;

    setTimeout(cell => {
      if (cell == tracker.endingCell) {
        cell.style.backgroundColor = 'purple';
      } else {
        cell.style.backgroundColor = 'blue'
      }}, timeout += 200, currentCell)
  }
}

function currentColRow(cell) {
  return currentCol(cell) + '-' + currentRow(cell)
}

function currentRow(cell) {
  return parseInt(cell.id.split('-')[1]);
}

function currentCol(cell) {
  return parseInt(cell.parentNode.id.split('-')[1]);
}

const navigation = {
  up: function(cell) {
    if (currentRow(cell) - 1 <= 0) return;

    return cell.previousSibling;
  },

  right: function(cell) {
    if (currentCol(cell) + 1 > tracker.matrixSize) return;

    return cell.parentNode.nextSibling.querySelector(`#row-${currentRow(cell)}`)
  },

  down: function(cell) {
    if (currentRow(cell) + 1 > tracker.matrixSize) return;

    return cell.nextSibling;
  },

  left: function(cell) {
    if (currentCol(cell) - 1 <= 0) return;

    return cell.parentNode.previousSibling.querySelector(`#row-${currentRow(cell)}`)
  },

  validPaths: function(cell) {
    let paths = [];

    if (this.up(cell)) paths.push('up');
    if (this.down(cell)) paths.push('down');
    if (this.right(cell)) paths.push('right');
    if (this.left(cell)) paths.push('left');

    return paths;
  }
}

const tracker = {
  startingCell: null,
  endingCell: null,
  isStartingCellSet: false,
  isEndingCellSet: false,
  matrixSize: 0
}

