const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  let puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
  let puzzleArr = solver.toMatrix(puzzle);

  suite('Puzzle Input', () => {
    test('valid', () => {
      assert.isTrue(solver.validate(puzzle));
    });

    test('invalid characters', () => {
      assert.deepEqual(
        solver.validate(
          "AA.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"
        ),
        { error: "Invalid characters in puzzle" }
      );
    });

    test('invalid length', () => {
      assert.deepEqual(
        solver.validate(
          "91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"
        ),
        { error: "Expected puzzle to be 81 characters long" }
      );
    });
  });

  suite('Placement', function() {
    test('valid row', () => {
      assert.isTrue(solver.isValidRowMove(puzzleArr, 0, 2, 8));
    });

    test('invalid row', () => {
      assert.isFalse(solver.isValidRowMove(puzzleArr, 0, 2, 9));
    });

    test('valid column', () => {
      assert.isTrue(solver.isValidColMove(puzzleArr, 0, 2, 8));
    });

    test('invalid column', () => {
      assert.isFalse(solver.isValidColMove(puzzleArr, 0, 2, 9));
    });

    test('valid region', () => {
      assert.isTrue(solver.isValidRegionMove(puzzleArr, 0, 2, 8));
    });

    test('invalid region', () => {
      assert.isFalse(solver.isValidRegionMove(puzzleArr, 0, 2, 9));
    });
  });

  suite('Solver', function() {
    test('valid puzzle pass', () => {
      assert.isString(solver.solve(puzzleArr));
    });

    test('invalid puzzle fail', () => {
      assert.isFalse(solver.solve(solver.toMatrix(
        "55591372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"
      )));
    });

    test('return expected solution', () => {
      assert.strictEqual(
        solver.solve(puzzleArr),
        '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
      );
    });
  });
});
