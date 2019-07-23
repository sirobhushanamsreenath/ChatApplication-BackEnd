'use strict';
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('./../libraries/timeLib');

const Auth = new Schema({
  userId: {
    type: String
  },
  authToken: {
    type: String
  },
  tokenSecret: {
    type: String
  },
  tokenGenerationTime: {
    type: Date,
    default: time.now()
  }
});

//Exporting module..
mongoose.model = ('Auth', Auth);
