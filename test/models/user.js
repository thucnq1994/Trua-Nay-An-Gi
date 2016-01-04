var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var mockgoose = require('mockgoose');
var expect = require('chai').expect;
mockgoose(mongoose);

var User = require('../models/UserModel.js')(mongoose);

before(function(done) {
  mongoose.connect('mongodb://localhost/trua_nay_an_gi_test', function(err) {
    if (err) return done(err);
    done();
  });
});

describe('User model', function() {

  it('should create a new user', function(done) {
    var user = new User({});
    user.gg_id = '123';
    user.username = 'username';
    user.group = 1;
    user.save(function(err, createdUser) {
      if (err) return done(err);
      expect(createdUser.gg_id).to.be.equal('123');
      expect(createdUser.username).to.be.equal('username');
      expect(createdUser.group).to.be.equal(1);
      done();
    });
  });

  it('should find user by gg_id', function(done) {
      User.findOne({
          gg_id: '123'
      }, function(err, createdUser) {
        if (err) return done(err);
        expect(createdUser.gg_id).to.be.equal('123');
        expect(createdUser.username).to.be.equal('username');
        expect(createdUser.group).to.be.equal(1);
        done();
      });
  });

  it('should delete a user', function(done) {
      User.remove({
          gg_id: '123'
      }, function(err) {
          if (err) return done(err);
          done();
      });
  });

});