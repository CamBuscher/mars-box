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