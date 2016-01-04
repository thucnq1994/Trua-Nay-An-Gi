"use strict";

module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: 3000,
      hostname: 'localhost',
    },
    database: {
      url: 'mongodb://localhost/trua_nay_an_gi'
    },
    google: {
      CLIENT_ID : '306070905265-l15ufott6ebb2vqhij10ffrcq3r1mlak.apps.googleusercontent.com',
      CLIENT_SECRET : 'lf9bj9rzIf9SbspJBKcLvhEN',
      REDIRECT_URL : 'http://localhost:3000/gglogin'
    }
  }
  return config;
}