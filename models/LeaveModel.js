'use strict';
const mongoose = require('mongoose');

var LeaveSchema = new mongoose.Schema({
    content:{type:String,default:''},
    username:{type:String,default:''},
    state:{type:Number,default:1},
    create_date: {type: Date, default: null}
});

module.exports = mongoose.model('Leave', LeaveSchema);