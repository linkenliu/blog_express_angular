'use strict';
const mongoose = require('mongoose');

var EditorSchema = new mongoose.Schema({
    username: {type: String,default:''},
    nickname: {type: String,default:''},
    password:{type:String,default:''},
    avatar:{type:String,default:''},
    phone: {type: String, default:''},
    email: {type: String,default:''},
    state: {type: Number,default:1},
    comment:{type:String,default:''},
    create_date: {type: Date, default: null},
    update_date: {type: Date, default: null}
});


module.exports = mongoose.model('Editor', EditorSchema);