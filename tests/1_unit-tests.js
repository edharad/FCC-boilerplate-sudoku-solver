const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();




let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let invalidPuzzle = "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let nonsolvPuzzle = "145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let insuffPuzzle = "15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let complete = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'

suite('Unit Tests', () => {
    suite("Validation test:", () => {
        test('Logic handles a valid puzzle string of 81 characters', (done) => {
            assert.equal(solver.validate(validPuzzle), true);
            done()
        });

        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
            assert.deepEqual(solver.validate(invalidPuzzle), {error: "Invalid characters in puzzle"});
            done();
        });

        test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
            assert.deepEqual(solver.validate(insuffPuzzle), {error: "Expected puzzle to be 81 characters long"});
            done();
        });

    })

    
    suite("Placement test:", () => {
        test("Logic handles a valid row placement", (done) => {
            assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, '3'), true);
            done();
        });

        test("Logic handles an invalid row placement", (done) => {
            assert.equal(solver.checkRowPlacement(complete, 0, 1, '3'), false);
            done();
        });

        test("Logic handles a valid column placement", (done) => {
            assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, '3'), true);
            done();
        });

        test("Logic handles an invalid column placement", (done) => {
            assert.equal(solver.checkColPlacement(complete, 0, 1, '3'), false);
            done();
        });
        
        test("Logic handles a valid region (3x3 grid) placement", (done) => {
            assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 0, "3"), true);
            done();
        });

        test("Logic handles an invalid region (3x3 grid) placement", (done) => {
            assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 0, "1"), false);
            done();
        });
    })
    suite("Solver tests:", () => {
        test("Valid puzzle strings pass the solver", (done) => {
            assert.equal(solver.solve(complete).solution, complete);
            done();
        });

        test("Invalid puzzle strings fail the solver", (done) => {
            assert.deepEqual(solver.solve(nonsolvPuzzle), { error: "Puzzle cannot be solved"});
            done();
        });

        test("Solver returns the expected solution for an incomplete puzzle", (done) => {
            assert.equal(solver.solve(validPuzzle).solution, complete);
            done();
        });
    })


});
