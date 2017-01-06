'use strict';
const mongoose = require('mongoose'),
    co = require('co'),
    autoIncrement = require('mongoose-auto-increment');

var PostSchema = new mongoose.Schema({
    post_id: {type: Number, index: {unique: true}},
    title: {type: String, default: ''},
    type: {
        type: {type: String, default: ''},
        channel: {type: mongoose.Schema.Types.ObjectId, ref: 'Channel'}
    },
    cover: {type: String, default: ''},
    content: {type: String, default: ''},
    view_count: {type: Number, default: 0},
    comment_count: {type: Number, default: 0},
    is_top: {type: Number, default: 0},
    editor: {type: mongoose.Schema.Types.ObjectId, ref: 'Editor'},
    state: {type: Number, default: 1},
    release_state: {type: Number, default: 1},
    create_date: {type: Date, default: null},
    update_date: {type: Date, default: null}
});


PostSchema.plugin(autoIncrement.plugin, {
    model: 'Post',
    field: 'post_id',
    startAt: 1,
    incrementBy: 1
});



module.exports = mongoose.model('Post', PostSchema);