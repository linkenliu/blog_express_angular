'use strict';
const mongoose = require('mongoose');

var LibrarySchema = new mongoose.Schema({
    title: {type: String,default:''},
    url: {type: String,default:''},
    is_top: {type: Number,default:0},
    state: {type: Number,default:1},
    create_date: {type: Date, default: null},
    update_date: {type: Date, default: null}
});


module.exports = mongoose.model('Library', LibrarySchema);