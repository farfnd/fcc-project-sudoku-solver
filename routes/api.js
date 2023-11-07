'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }

      try {
        let validationResult = solver.validate(puzzle);
        if (validationResult.error) return res.json({ error: validationResult.error });

        validationResult = solver.checkValidate(coordinate, value);
        if (validationResult.error) return res.json({ error: validationResult.error });
        
        const conflicts = solver.check(solver.toMatrix(puzzle), coordinate, parseInt(value));

        if (conflicts.length) {
          return res.json({ valid: false, conflict: conflicts });
        }
        res.json({ valid: true });
      } catch (error) {
        console.log(error);
        return res.json({ error });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      if (!puzzleString) {
        return res.json({ error: "Required field missing" });
      }
      
      const validationResult = solver.validate(puzzleString);
      if (validationResult.error) return res.json({ error: validationResult.error });
      
      const solution = solver.solve(solver.toMatrix(puzzleString));
      if (!solution || solution === puzzleString) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      res.json({ solution });
      
      try {
        
      } catch (error) {
        return res.json({ error });
      }
    });
};
