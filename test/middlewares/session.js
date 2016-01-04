"use strict";

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var mwSession = require( '../../middlewares/session');
chai.should();
chai.use(sinonChai);

describe('Session middleware', function() {

  it('should move on next() and get right req.currentData', function(done) {
    var cb = sinon.spy();

    var fakeReq = {
                    session : {
                                message : {
                                            content : null,
                                            type : null
                                          },
                                current_user : {
                                                  id: 1,
                                                  group: 1,
                                                  displayName: 'username',
                                                  avatar: 'http://placehold.it/250x250',
                                                  email: 'test@gmail.com'
                                }
                              }
                  };

    var fakeRes;

    mwSession(fakeReq, fakeRes, cb);

    cb.should.have.been.called();
    
    expect(fakeReq.currentData.isLoggedIn).to.equal(true);
    expect(fakeReq.currentData.current_user.id).to.equal(1);
    expect(fakeReq.currentData.current_user.group).to.equal(1);
    expect(fakeReq.currentData.current_user.displayName).to.equal('username');
    expect(fakeReq.currentData.current_user.avatar).to.equal('http://placehold.it/250x250');
    expect(fakeReq.currentData.current_user.email).to.equal('test@gmail.com');
    expect(fakeReq.currentData.message.content).to.equal(null);
    expect(fakeReq.currentData.message.type).to.equal(null);

    done();
  });

});