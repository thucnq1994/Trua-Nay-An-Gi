var config = require('../config/config');
var app = require('../index');
var superagent = require('superagent');
var expect = require('chai').expect;

before(function(done) {
    app.listen;
    done();
});

describe('Profile page', function(){

  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+app.config.server.port + '/profile')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

});