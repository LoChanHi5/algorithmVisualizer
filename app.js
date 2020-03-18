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
}

const tracker = {
  startingCell: null,
  endingCell: null,
  isStartingCellSet: false,
  isEndingCellSet: false
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
  console.log(tracker.startingCell);
  console.log(tracker.endingCell);
}
