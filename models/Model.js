'use strict';
const ChannelModel = require('./ChannelModel'),
    EditorModel = require('./EditorModel'),
    LibraryModel = require('./LibraryModel'),
    PostModel = require('./PostModel'),
    LeaveModel = require('./LeaveModel'),
    PostCommentModel = require('./PostCommentModel'),
    FriendModel = require('./FriendModel');


exports.getModel = (model)=> {
    if (model == 'channel') return ChannelModel;
    else if (model == 'editor') return EditorModel;
    else if (model == 'library') return LibraryModel;
    else if (model == 'post') return PostModel;
    else if (model == 'friend') return FriendModel;
    else if (model == 'leave') return LeaveModel;
    else if (model == 'comment') return PostCommentModel;
    else return null;
};