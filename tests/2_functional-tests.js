const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
  
  suite('/api/solve', () => {
    test('valid puzzle string', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.strictEqual(res.body.solution, '568913724342687519197254386685479231219538467734162895926345178473891652851726943');
          done();
        });
    });
    
    test('missing puzzle string', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Required field missing');
          done();
        });
    });
    
    test('invalid characters', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '5AA91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    
    test('invalid length', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    
    test('unsolvable', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '55591372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });
  
  suite('/api/check', () => {
    test('all fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "A3", value: 8 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.notProperty(res.body, 'conflict');
          assert.isTrue(res.body.valid)
          done();
        });
    });

    test('1 conflict', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "A3", value: 2 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid)
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 1);
          done();
        });
    });
    
    test('2 conflicts', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "A3", value: 3 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid)
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 2);
          done();
        });
    });
    
    test('3 conflicts', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "A3", value: 9 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid)
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 3);
          done();
        });
    });
    
    test('missing required fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "A3" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('invalid characters', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '5AA91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
          coordinate: "A3",
          value: 9
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    
    test('invalid length', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
          coordinate: "A3",
          value: 9
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('invalid coordinate', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "L3", value: 2 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('invalid value', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle, coordinate: "A3", value: 12 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});

