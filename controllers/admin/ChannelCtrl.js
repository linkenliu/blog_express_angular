'use strict';
const ChannelModel = require('../../models/ChannelModel'),
    Response = require('../../utils/responseObj'),
    dateUtil = require('../../utils/dateUtil'),
    co = require('co');

let logger = require('../../utils/logger.js').getLogger('ctrl');

/*get channels list information*/
exports.getChannels = (req, res) => {
    let responseObj = Response();
    let searchText = req.query.searchText;
    let params = {};
    if(searchText) params.name = RegExp(searchText,'i');
    return co(function*() {
        try {
            let channels = yield ChannelModel.find(params);
            responseObj.data.channels = channels;
            res.send(responseObj);
        } catch (err) {
            logger.error("getChannels Error:"+err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        }
    });
};


/*save channel or edit channel*/
exports.saveChannel = (req,res)=>{
    let responseObj = Response();
    let object = req.body.object;
    if(object._id){
        let _id = object._id;
        delete object._id;
        co(function*(){
            yield ChannelModel.update({_id:_id},object);
            res.send(responseObj);
        }).catch(err=>{
            logger.error("editChannel Error:"+err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    }else{
        object.name_node = object.name;
        req.session.sessionUser._id ? object.editor = req.session.sessionUser._id : '';
        object.create_date = dateUtil.currentDate();
        object.update_date = dateUtil.currentDate();
        let newChannel = new ChannelModel(object);
        co(function*(){
            yield newChannel.save();
            res.send(responseObj);
        }).catch(err=>{
            logger.error("addChannel Error:"+err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    }
};

/*find one channel information*/
exports.findChannel = (req,res)=>{
    let _id = req.query._id;
    let responseObj = Response();
    if(!_id){
        responseObj.errMsg(false, '_id is empty');
        res.send(responseObj);
    }
    co(function*(){
        let channel = yield ChannelModel.findOne({_id:_id});
        responseObj.data.channel = channel;
        res.send(responseObj);
    }).catch(err=>{
        logger.error("editChannel Error:"+err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

/*delete channel*/
exports.delChannel = (req,res)=>{
    let _id = req.query._id;
    let responseObj = Response();
    if(!_id){
        responseObj.errMsg(false, '_id is empty');
        res.send(responseObj);
    }
    co(function*(){
        yield ChannelModel.remove({_id:_id});
        res.send(responseObj);
    }).catch(err=>{
        logger.error("delChannel Error:"+err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};