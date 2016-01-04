"use strict";

module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: 5000,
      hostname: 'trua-nay-an-gi.herokuapp.com',
    },
    database: {
      //url: 'mongodb://localhost/trua_nay_an_gi'
      url: 'mongodb://thucnq1994:123456987@ds031611.mongolab.com:31611/heroku_3d6nn3wv'
    },
    google: {
      CLIENT_ID : '306070905265-l15ufott6ebb2vqhij10ffrcq3r1mlak.apps.googleusercontent.com',
      CLIENT_SECRET : 'lf9bj9rzIf9SbspJBKcLvhEN',
      REDIRECT_URL : 'http://trua-nay-an-gi.herokuapp.com/gglogin'
    }
  }
  return config;
}