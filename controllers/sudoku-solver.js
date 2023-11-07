class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle'};
    }
    
    return true;
  }

  checkValidate(coordinate, value) {
    if (/^[A-Ia-i][1-9]$/.test(coordinate) === false) {
      return { error: 'Invalid coordinate' };
    }

    if (/^[1-9]$/.test(value) === false) {
      return { error:  'Invalid value' };
    }
    
    return true;
  }

  check(puzzle, coordinate, value) {
    let row = coordinate.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    let column = coordinate[1] - 1;
    let conflicts = [];

    if (puzzle[row][column] === value) {
      return conflicts;
    }

    if (!this.isValidRowMove(puzzle, row, column, value)) {
      conflicts.push("row");
    }
    if (!this.isValidColMove(puzzle, row, column, value)) {
      conflicts.push("column");
    }
    if (!this.isValidRegionMove(puzzle, row, column, value)) {
      conflicts.push("region");
    }

    return conflicts;
  }

  isValidRowMove(puzzle, row, column, value) {
    return !(puzzle[row].includes(value));
  }

  isValidColMove(puzzle, row, column, value) {
    return !(puzzle.some(rowData => rowData[column] === value));
  }

  isValidRegionMove(puzzle, row, column, value) {
    const regStartRow = Math.floor(row / 3) * 3;
    const regStartCol = Math.floor(column / 3) * 3;
    for (let i = regStartRow; i < regStartRow + 3; i++) {
      for (let j = regStartCol; j < regStartCol + 3; j++) {
        if (puzzle[i][j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  toMatrix(puzzleString) {
    let puzzle = [];
    for (let row = 0; row < 9; row++) {
      puzzle[row] = [];
      for (let col = 0; col < 9; col++) {
        puzzle[row][col] = puzzleString[row * 9 + col] === '.' ? 0 : (puzzleString[row * 9 + col] - '0');
      }
    }
    return puzzle;
  }

  solve(puzzle) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (
              this.isValidRowMove(puzzle, row, col, num) &&
              this.isValidColMove(puzzle, row, col, num) &&
              this.isValidRegionMove(puzzle, row, col, num)
            ) {
              puzzle[row][col] = num;
              if (this.solve(puzzle)) {
                return this.stringify(puzzle);
              }
              puzzle[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return this.stringify(puzzle);
  }

  stringify(puzzle) {
    let puzzleString = '';
    for (let row = 0; row < 9; row++) {
      puzzleString += puzzle[row].join('');
    }
    return puzzleString;
  }
}

module.exports = SudokuSolver;

