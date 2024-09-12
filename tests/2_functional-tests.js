const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);


let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let invalidPuzzle = "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let nonsolvPuzzle = "145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let insuffPuzzle = "15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
let complete = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'


suite('Functional Tests', () => {
    suite("Solver requests POST tests to /api/solve :", () => {
        test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: validPuzzle
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, complete);
                    done();
                })       
        });
        test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Required field missing");
                    done();
                })       
        });
        test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidPuzzle
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Invalid characters in puzzle");
                    done();
                })       
        });
        test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: insuffPuzzle
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                    done();
                })       
        });
        test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: nonsolvPuzzle
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Puzzle cannot be solved");
                    done();
                })       
        });

    });
    suite("Placement POST request test to /api/check: ", () => {
        test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "A1",
                    value: "1"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, true);
                    done();
                })       
        });
        test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "A7",
                    value: "1"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {valid: false, conflict: ['row']});
                    done();
                })       
        });
        test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "A2",
                    value: "1"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {valid: false, conflict: ['row', 'region']});
                    done();
                })       
        });
        test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "A4",
                    value: "1"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {valid: false, conflict: ['row', 'column', 'region']});
                    done();
                })       
        });
        test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "",
                    value: ""
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {error: "Required field(s) missing"});
                    done();
                })       
        });
        test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "A1",
                    value: "b"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {error: "Invalid value"});
                    done();
                })       
        });
        test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: insuffPuzzle,
                    coordinate: "A1",
                    value: "1"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {error: "Expected puzzle to be 81 characters long"});
                    done();
                })       
        });
        test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "J1",
                    value: "8"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {error: "Invalid coordinate"});
                    done();
                })       
        });
        test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: "A1",
                    value: "10"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {error: "Invalid value"});
                    done();
                })       
        });
    });

});

