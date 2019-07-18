'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userId : {
        type :String,
        index :true,
        default : '',
        unique : true
    },
    firstName : {
        type : String,
        default : ''
    },
    lastName : {
        type: String,
        default : ''
    },
    password : {
        type : String,
        default : 'tsitneics'
    },
    email : {
        type: String,
        default : ''
    },
    mobileNumber : {
        type : String,
        default : ''
    },
    createdOn : {
        type: Date,
        default : ''
    }
})

mongoose.model('User',userSchema);