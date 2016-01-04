var config = require('../config/config');
var app = require('../index');
var fs = require('fs');
var DataImport = require('../config/dataimport.js');
var expect = require('chai').expect;

before(function(done) {
    app.listen;
    done();
});

describe('Import file function', function(){

  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+app.config.server.port + '/import')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Excel import: should get right json return string',function(done){
    fs.readFile('./test/file/menu.xlsx', function (err, data) {
		  expect(err).to.be.null;
		  DataImport(data, function(error, arr) {
		  	expect(error).to.be.null;
				expect(arr.length).to.be.equal(2);
				expect(arr[0].foodList.length).to.be.equal(3);
				expect(arr[1].foodList.length).to.be.equal(3);
				expect(arr[0].date).to.be.equal('07/12/15');
				expect(arr[0].foodList[1].name).to.be.equal('B');
				expect(arr[1].foodList[2].price).to.be.equal('35000');
				done();
			});
		});
  });

});