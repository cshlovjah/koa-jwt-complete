//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';
const axios = require("axios");
var qs = require('qs');
require("dotenv").config();
const client = require("redis").createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const chai = require("chai");
const should = chai.should;
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../build/main.js");
chai.use(
  require("chai-iso8601")({
    marginRequired: true
  })
);

chai.use(chaiHttp);
const hostname = process.env.HOST;
const port = process.env.PORT;

let token = "";
//Our parent block
describe("Аутентифика́ция", () => {
  beforeEach(done => {
    //Before each test we empty the database
    setTimeout(function() {
      done();
    }, 1000);
  });

  it("Flush users", function(done) {
    client.flushall(res => {
      done();
    });
  });

  describe("POST /auth/register, username test123890, password test123890", () => {
    it("it should result: ", async () => {
      const data = {
        username: "test123890",
        password: "test123890"
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `http://${hostname}:${port}/auth/register`
      };
      const result = await axios(options);
      console.log(result.data)
   
    });
  });
  /*
  describe('again /POST http://localhost:3000/user/register, new user test123, email test123@test.com, password test123', () => {
    it('it should Status 409', () => {
      chai.request(app)
        .post('/users/register')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .type('form')
        .send({
          'name': 'test123',
          'password': 'test123',
          'email': 'test123@test.com'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(409);
          expect(res).to.have.include.header('content-type', 'text/plain; charset=utf-8');
          expect(res).to.be.text;
        });
    })
  });

  describe('/POST http://localhost:3000/user/authenticate', () => {
    it('it should POST auth user test123, email test123@test.com, password test123', (done) => {
      chai.request(app)
        .post('/users/authenticate')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .type('form')
        .send({
          'password': 'test123',
          'email': 'test123@test.com'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).be.a('object');
          token = res.body.data.token
          done();
        });
    })
  });

  describe('/GET http://localhost:3000/profile', () => {
    it('it should ', (done) => {
      chai.request(app)
        .get('/profile')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.include({
            status: 'success',
            message: 'found',
            data: { name: 'test123', email: 'test123@test.com' }
          });
          done();
        });
    })
  });

  describe('/PUT http://localhost:3000/profile - firstname field Tester', () => {
    it('it should complete', (done) => {
      const requestDate = new Date().toISOString();
      chai.request(app)
        .put('/profile')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ firstname: 'Tester' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data.adding.firstname).to.equal('Tester');
          expect(res.body.data.adding.updateAt).to.be.iso8601('gt', requestDate, 100);
          done();
        });
    })
  });

  describe('/PUT http://localhost:3000/profile - lastname field Tester123', () => {
    it('it should Tester123', (done) => {
      const requestDate = new Date().toISOString();
      chai.request(app)
        .put('/profile')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ lastname: 'Tester123' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data.adding.lastname).to.equal('Tester123');
          expect(res.body.data.adding.updateAt).to.be.iso8601('gt', requestDate, 100);
          done();
        });
    })
  });

  describe('/PUT http://localhost:3000/profile - phone field 89121231232', () => {
    it('it should 89121231232', (done) => {
      const requestDate = new Date().toISOString();
      chai.request(app)
        .put('/profile')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ phone: 89121231232 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data.adding.phone).to.equal('89121231232');
          expect(res.body.data.adding.updateAt).to.be.iso8601('gt', requestDate, 100);
          done();
        });
    })
  });
*/
});
