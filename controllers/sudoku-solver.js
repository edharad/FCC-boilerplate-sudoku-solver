class SudokuSolver {

  validate(puzzleString) {

    //Check if string length is = to 81
    if (puzzleString.length !== 81) {
      return { error : 'Expected puzzle to be 81 characters long' };
    }

    //Check if the string contain only numbers or dots which represent empty position
    if (/[^1-9.]/g.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle'};
    }
    //If it's all valid, return true
    return true; 

  }

  checkRowPlacement(puzzleString, row, column, value) {

    //Find start index of the corresponding row in puzzleString
    const startIndex = (row * 9);
    const rowString = puzzleString.slice(startIndex, startIndex + 9);

    //return false if the value is already present in the line, otherwise true
    return !rowString.includes(value);

  }

  checkColPlacement(puzzleString, row, column, value) {
    //Extract all the elements of the column
    for(let i = 0; i < 9; i++) {
      if(puzzleString[column + (i*9)] === value) {
        return false;
      }
    }
    return true; 

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Determine region by line and column
    const regionRow = Math.floor(row/3) * 3; 
    const regionCol = Math.floor(column / 3) * 3;

    // Look at each position of a region (3*3)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (puzzleString[(regionRow + r) * 9 + (regionCol + c)] === value) {
          return false;
        }
      }
    }
    return true; 

  }

  solve(puzzleString) {
    //Validate the string before beginning
    const validation = this.validate(puzzleString);
    if(validation !== true) {
      return validation; 
    }

    const solveRecursive = (puzzle) => {
      const emptyIndex = puzzle.indexOf('.')
      //If no empty box is founded, we have found a solution
      if(emptyIndex === -1) {
        return puzzle;
      }

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;

      //Try 1-9 values for empty boxes
      for(let num = 1; num <= 9; num++) {
        const value = num.toString();
        if(this.checkRowPlacement(puzzle, row, col, value) &&
           this.checkColPlacement(puzzle, row, col, value) &&
           this.checkRegionPlacement(puzzle, row, col, value)) {
          
          const newPuzzle = puzzle.slice(0, emptyIndex) + value + puzzle.slice(emptyIndex + 1);

          //Recursive call to a new puzzle version
          const solvedPuzzle = solveRecursive(newPuzzle);
          if(solvedPuzzle) {
            return solvedPuzzle;
          }
        }
      }
      //If no solution hasn't work, we go back to previous call
      return false;
    }

    //Call the recursive function solveRecursive to solve the sudoku
    const solution = solveRecursive(puzzleString);
    if(!solution) {
      return { error: 'Puzzle cannot be solved'};
    }

    return {solution};
    
  }
}

module.exports = SudokuSolver;

