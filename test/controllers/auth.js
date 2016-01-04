var config = require('../config/config');
var app = require('../index');
var superagent = require('superagent');
var expect = require('chai').expect;

before(function(done) {
    app.listen;
    done();
});

describe('Homepage', function(){

  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+app.config.server.port)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

});

describe('Login page', function(){

  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+app.config.server.port+'/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

});

describe('Logout page', function(){

  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+app.config.server.port+'/logout')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

});

describe('Google login page', function(){

  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+app.config.server.port+'/gglogin')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

});