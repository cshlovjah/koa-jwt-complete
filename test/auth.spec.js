//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
const User = require('../../app/api/models/users');
const chai = require('chai');
const should = chai.should;
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../server');
chai.use(require('chai-iso8601')({
  marginRequired: true
}));

chai.use(chaiHttp);
let token = '';
//Our parent block
describe('Аутентифика́ция', () => {

  beforeEach((done) => { //Before each test we empty the database
    /*
   User.remove({}, (err) => {
     done();
    });
    */
    setTimeout(function () {
      done();
    }, 1000);

  });


  it('Flush users', function (done) {
    // Calling `done()` twice is an error
    User.remove({}, (err) => {
      done();
    });

  });
  describe('/POST http://localhost:3000/user/register, new user test123, email test123@test.com, password test123', () => {
    it('it should result: status: success and message: User added successfully and data: null', () => {
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
          expect(res).to.have.status(200);
          expect(res.body).be.a('object');
          expect(res.body).to.deep.include({
            status: 'success',
            message: 'User added successfully',
            data: null
          });
        });
    })
  });

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
});