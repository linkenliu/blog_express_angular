'use strict';
const mongoose = require('mongoose');

var PostCommentSchema = new mongoose.Schema({
    post:{type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    content:{type:String,default:''},
    username:{type:String,default:''},
    email:{type:String,default:''},
    personage_site:{type:String,default:''},
    state:{type:Number,default:1},
    create_date: {type: Date, default: null}
});



module.exports = mongoose.model('PostComment', PostCommentSchema);