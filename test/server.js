var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server.js');

chai.use(chaiHttp);

describe('server', () => {
  describe('static files', () => {
    it('should GET /', (done) => {
      chai.request(server).get('/').then(res => {
          res.should.have.status(200);
          done();
      }).catch(done);
    });
    it('should GET / with valid html', (done) => {
      chai.request(server).get('/').then(res => {
        res.should.have.status(200);
        res.should.be.html
        done();
      }).catch(done);
    });
    it('should return 404 for /notafile', (done) => {
      chai.request(server).get('/notafile').then(done)
      .catch(res => {
        res.should.have.status(404);
        done();
      });
    });
  });
  describe('geolocations api endpoint (/api/geolocations)', () => {
    it('should return json from GET /api/geolocations', (done) => {
      chai.request(server)
        .get('/api/geolocations').then(res => {
          res.should.have.status(200);
          res.should.be.json;
          done();
        }).catch(done);
    });
    it('should return an array from GET /api/geolocations', (done) => {
      chai.request(server)
        .get('/api/geolocations').then(res => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        }).catch(done);
    });
    it('should accept post requests to /api/geolocations with valid data', (done) => {
      chai.request(server)
        .post('/api/geolocations')
        .send({ name: 'test', lat: 0, lng: 0 })
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.empty;
          done();
        }).catch(done);
    });
    it('should reject post requests to /api/geolocations with invalid data', (done) => {
      chai.request(server).post('/api/geolocations')
        .then(done)
        .catch(res => {
          res.should.have.status(400);
          return chai.request(server).post('/api/geolocations').send({ thisis: 'not valid', 'test': ['data']});
        }).catch(res => {
          res.should.have.status(400);
          return chai.request(server).post('/api/geolocations').send({});
        }).catch(res => {
          res.should.have.status(400);
          return chai.request(server).post('/api/geolocations').send('also not valid');
        }).catch(res => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
