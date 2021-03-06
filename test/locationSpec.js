const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/server');

const Location = require('../server/models/locationModel');

chai.use(chaiHttp);

describe('locations api endpoint (/api/locations)', () => {
  it('should return json from GET /api/locations', (done) => {
    chai.request(server)
      .get('/api/locations').then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      }).catch(done);
  });

  it('should return an array from GET /api/locations', (done) => {
    chai.request(server)
      .get('/api/locations').then((res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      }).catch(done);
  });

  it('should accept post requests with valid data', (done) => {
    Location.destroy({ where: { name: 'a_test_location' } });

    chai
      .request(server)
      .post('/api/locations')
      .send({
        name: 'a_test_location',
        lat: 123.456789,
        lng: 123.456789
      })
      .then((res) => {
        res.should.have.status(200);
        //based on the spec
        res.body.should.be.empty;
        done();
      }).catch(done);
  });

  it('should reject post requests with invalid data', (done) => {
    chai.request(server).post('/api/locations')
      .then(done)
      .catch((res) => {
        res.should.have.status(400);

        return chai.request(server).post('/api/locations')
          .send({ thisis: 'not valid', test: ['data'] });
      }).catch((res) => {
        res.should.have.status(400);

        return chai.request(server).post('/api/locations').send({});
      }).catch((res) => {
        res.should.have.status(400);

        return chai.request(server).post('/api/locations')
          .send('also not valid');
      }).catch((res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should persist and return posted locations', (done) => {
    const reqData = {
      name: 'firstTest',
      lat: '123.456789',
      lng: '987.654321'
    };

    chai.request(server).post('/api/locations')
    .send(reqData)
    .then((res) => {
      res.should.have.status(200);

      return chai.request(server).get('/api/locations');
    }).then((res) => {
      res.should.be.json;
      res.body.should.be.an('array');
      res.body.length.should.not.equal(0);
      res.body[res.body.length - 1].name.should.eql('firstTest');
      done();
    }).catch(done);
  });

  it('should delete test location data', (done) => {
    chai
      .request(server)
      .delete('/api/locations/firstTest')
      .then((res) => {
        res.should.have.status(200);
        res.body.should.eql([]);
      })
      .then(() => done())
      .catch(done);
  });
});
