'use strict';
const FriendModel = require('../../models/FriendModel'),
    Response = require('../../utils/responseObj'),
    dateUtil = require('../../utils/dateUtil'),
    co = require('co');

let logger = require('../../utils/logger.js').getLogger('ctrl');

/*get friend list information*/
exports.friendList = (req, res)=> {
    let responseObj = Response();
    let searchText = req.query.searchText;
    let params = {};
    if(searchText) params.name = new RegExp(searchText,'i');
    co(function*() {
        let friendList = yield FriendModel.find(params);
        responseObj.data.friendList = friendList;
        res.send(responseObj);
    }).catch(err=> {
        logger.error("friendList Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

/*save or edit friend*/
exports.saveFriend = (req,res)=>{
    let responseObj = Response();
    let object = req.body.object;
    let _id = object._id;
    if(_id){
        //edit
       co(function*(){
           delete object._id;
           object.update_date = dateUtil.currentDate();
           yield FriendModel.update({_id:_id},object);
           res.send(responseObj);
       }).catch(err=>{
           logger.error("editFriend Error:" + err.message);
           responseObj.errMsg(false, err.message);
           res.send(responseObj);
       });
    }else{
        co(function*(){
            delete object._id;
            object.create_date = dateUtil.currentDate();
            object.update_date = dateUtil.currentDate();
            let newFriend = new FriendModel(object);
            yield newFriend.save();
            res.send(responseObj);
        }).catch(err=>{
            logger.error("saveFriend Error:" + err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    }
};

/*delete friend*/
exports.delFriend = (req,res)=>{
    let responseObj = Response();
    let _id = req.query._id;
    if(!_id){
        responseObj.errMsg(false,'_id is empty');
        return res.send(responseObj);
    }
    co(function*(){
        yield FriendModel.remove({_id:_id});
        res.send(responseObj);
    }).catch(err=>{
        logger.error("delFriend Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


/*find one friend*/
exports.findFriend = (req,res)=>{
    let _id = req.query._id;
    let responseObj = Response();
    if(!_id){
        responseObj.errMsg(false,'_id is empty');
        res.send(responseObj);
    }
    co(function*(){
        let friend = yield FriendModel.findOne({_id:_id});
        responseObj.data.friend = friend;
        res.send(responseObj);
    }).catch(err=>{
        logger.error("findFriend Error:"+err.message);
        responseObj.errMsg(false,err.message);
        res.send(responseObj);
    });
};