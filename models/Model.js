'use strict';
const ChannelModel = require('./ChannelModel'),
    EditorModel = require('./EditorModel'),
    LibraryModel = require('./LibraryModel'),
    PostModel = require('./PostModel'),
    FriendModel = require('./FriendModel');


exports.getModel = (model)=> {
    if (model == 'channel') return ChannelModel;
    else if (model == 'editor') return EditorModel;
    else if (model == 'library') return LibraryModel;
    else if (model == 'post') return PostModel;
    else if (model == 'friend') return FriendModel;
    else return null;
};