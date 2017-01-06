'use strict';
const
    Response = require('../../utils/responseObj'),
    FriendModel = require('../../models/FriendModel'),
    co = require('co');


let logger = require('../../utils/logger.js').getLogger('ctrl');

exports.friend = (req,res)=>{
    let responseObj = Response();
    co(function*(){
        let friendList = yield FriendModel.find({state:1});
        responseObj.data.friendList = friendList;
        return res.send(responseObj);
    }).catch(err=>{
        logger.error('friend Error:'+err.message);
        responseObj.errMsg(false,err.message);
        return res.send(responseObj);
    });
};
