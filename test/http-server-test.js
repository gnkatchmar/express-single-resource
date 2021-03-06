//check that teams.json = teamsOriginal.json before testing (it will be so after testing)
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const server = require('../lib/http-server');

let request = chai.request(server);
//original two-team data resource displayed as text
let origTeamsText = 'Oakland Athletics\nChicago Cubs\n';
let basedir = 'data/';
let filename = 'teamsTest.json';

describe('Five tests for Express single-resource http server', () => {

  // No longer need this one as Express always deals with non-existent paths

  // it('error message on non-existent path', done => {
  //   request
  //           .get('/DoesNotExist')
  //           .end((err, res) => {
  //             if (err) return done(err);
  //             assert.equal(res.text, '404 - Not Found');
  //             done();
  //           });
  // });

  it('a path (/teams) uses url.pathname', done => {
    request
            .get('/teams')
            .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.text, origTeamsText);
              done();
            });
  });

  it('/recognizes /teams/:team (fka querypath)', done => {
    request
            .get('/teams/Cubs')
            .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.text, 'Chicago Cubs');
              done();
            });
  });

  //City mispelled on purpose for next test purposes
  it('POST - adds team to data store; confirm by checking that /teams page updates', done => {
    newTeam = {"name":"Giants", "city": "San Frcisco"};   // eslint-disable-line
    request
     .post('/teams')
     .send(newTeam)
     .end((err, res) => {
       if (err) return done(err);
       request
            .get('/teams')
            .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.text, origTeamsText + 'San Frcisco Giants\n');
              done();
            });
     }); 
  });

  it('PUT - edits team city in data store; confirm by checking that /teams page updates', done => {
    editTeam = {"name":"Giants", "city": "San Francisco"};   // eslint-disable-line
    request
     .put('/teams/Giants')
     .send(editTeam)
     .end((err, res) => {
       if (err) return done(err);
       request
            .get('/teams')
            .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.text, origTeamsText + 'San Francisco Giants\n');
              done();
            });
     }); 
  });   

  it('DELETE - removes team from data store; confirm by checking that /teams page updates', done => {
    delTeam = {"name":"Giants", "city": "San Francisco"};   // eslint-disable-line
    request
     .delete('/teams/Giants')
     .send(delTeam)
     .end((err, res) => {
       if (err) return done(err);
       request
            .get('/teams')
            .end((err, res) => {
              if (err) return done(err);
              assert.equal(res.text, origTeamsText);
              done();
            });
     }); 
  });

});