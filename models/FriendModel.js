'use strict';
const mongoose = require('mongoose');

var FriendSchema = new mongoose.Schema({
    name: {type: String,default:''},
    url: {type: String,default:''},
    state: {type: Number,default:1},
    sort: {type: Number,default:0},
    create_date: {type: Date, default: null},
    update_date: {type: Date, default: null}
});


module.exports = mongoose.model('Friend', FriendSchema);