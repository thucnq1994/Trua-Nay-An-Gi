"use strict";

module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: process.env.PORT,
      hostname: 'trua-nay-an-gi.herokuapp.com',
    },
    database: {
      url: process.env.MONGOLAB_URI || 'mongodb://localhost/trua_nay_an_gi'

    },
    google: {
      CLIENT_ID : '306070905265-l15ufott6ebb2vqhij10ffrcq3r1mlak.apps.googleusercontent.com',
      CLIENT_SECRET : 'lf9bj9rzIf9SbspJBKcLvhEN',
      REDIRECT_URL : 'http://trua-nay-an-gi.herokuapp.com/gglogin'
    }
  }
  return config;
}