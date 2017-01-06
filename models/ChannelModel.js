'use strict';
const mongoose = require('mongoose');

var ChannelSchema = new mongoose.Schema({
    name: {type: String,default:''},
    name_node: {type: String,default:''},
    cover:{type:String,default:''},
    color: {type: String, default:'#ffffff'},
    box_shadow_color: {type: String,default:'yellow'},
    state: {type: Number,default:1},
    sort: {type: Number,default:0},
    editor:{type: mongoose.Schema.Types.ObjectId, ref: 'Editor'},
    create_date: {type: Date, default: null},
    update_date: {type: Date, default: null}
});


module.exports = mongoose.model('Channel', ChannelSchema);