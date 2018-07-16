process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const configuration = require('../knexfile')['test'];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should receive a response of some html when I request root endpoint', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done()
      })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/butt')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  })
});

describe('API Routes', () => {
  beforeEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return an array of space items', done => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('toothpaste');
        response.body[0].should.have.property('packed');
        response.body[0].packed.should.equal(false);
        response.body[0].should.have.property('created_at')
        response.body[0].should.have.property('updated_at')
        done();
      })
    })
  })

  describe('POST /api/v1/items', () => {
    it('should return the id of the freshly created item', done => {
      chai.request(server)
      .post('/api/v1/items')
      .send({
        name: 'rocket fuel'
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        done();
      })
    })

    it('should return an error message if the POST is formatted incorrectly', done => {
      chai.request(server)
      .post('/api/v1/items')
      .send({
        incorrectProperty: 'whoops'
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`Expected format: { name: <String>. You're missing a "name" property.`)
        done()
      })
    })
  })

  describe('DELETE /api/v1/items/:id', () => {
    it('should return a 204 status if successfully deleted', done => {
      chai.request(server)
      .delete('/api/v1/items/2')
      .end((error, response) => {
        response.should.have.status(204)
        done()
      })
    })

    it('should return an error message if no matching item', done => {
      chai.request(server)
        .delete('/api/v1/items/2234')
        .end((error, response) => {
          response.should.have.status(404)
          response.should.be.json
          response.body.should.be.a('object')
          response.body.should.have.property('error')
          response.body.error.should.equal(`Please enter a valid ID.`)
          done()
        })
    })
  })

  describe('PATCH /api/v1/items/:id', () => {
    it('should return an object with ID and updated status', done => {
      chai.request(server)
      .patch('/api/v1/items/1')
      .send({ packed: true })
      .end(((error, response) => {
        response.should.have.status(201)
        response.should.be.json
        response.body.should.be.a('object')
        response.body.should.have.property('id')
        response.body.id.should.equal('1')
        response.body.should.have.property('packed')
        response.body.packed.should.equal(true)
        done()
      }))
    })

    it('should return an error if body is incorrect', done => {
      chai.request(server)
        .patch('/api/v1/items/1')
        .send({ })
        .end(((error, response) => {
          response.should.have.status(422)
          response.should.be.json
          response.body.should.be.a('object')
          response.body.should.have.property(`error`)
          response.body.error.should.equal(`Request body must have "packed" property with a boolean value.`)
          done()
        }))
    })
  })
})