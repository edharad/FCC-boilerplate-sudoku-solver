'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //Extract the puzzle and other fiedls from req.body
      const {puzzle, coordinate, value} = req.body;

      //Check the presence of required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing'});
      }

      //Validate the puzzle
      const validationResult = solver.validate(puzzle);
      if(validationResult !== true) {
        return res.json(validationResult);
      }

      //Validation of coordinates and values
      if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const row = coordinate[0].toUpperCase().charCodeAt(0) - 65; // Conversion of 'A' in 0, 'B' in 1, etc.
      const col = parseInt(coordinate[1], 10) - 1; //Convert '1' in 0, '2' in 1, etc.

      if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if(!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value'});
      }

      const alreadyPlaced = puzzle[row * 9 + col] === value;

      if(alreadyPlaced) {
        return res.json({valid: true});
      }

      //Verify the placement
      const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
      const colValid = solver.checkColPlacement(puzzle, row, col, value);
      const regionValid = solver.checkRegionPlacement(puzzle, row, col, value);
      

      //Return the result of verification
        return res.json({
          valid: rowValid && colValid && regionValid,
          conflict: [
            !rowValid ? 'row': null,
            !colValid ? 'column' : null,
            !regionValid ? 'region' : null,
          ].filter(Boolean), //Filter the null values to return only conflicts
        })
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) {return res.json(validation)};

      const solution = solver.solve(puzzle);
      if (solution.error) {
        return res.json(solution);
      }

      return res.json(solution);

    });
};
