'use strict';
const LibraryModel = require('../../models/LibraryModel'),
    uuid = require('../../utils/uuid'),
    co = require('co'),
    config = require('../../config/config'),
    dateUtil = require('../../utils/dateUtil'),
    logger = require('../../utils/logger.js').getLogger('ctrl'),
    Response = require('../../utils/responseObj');


/*get library list informartion*/
exports.libraryList = (req, res)=> {
    let responseObj = Response();
    let params = {};
    let searchText = req.query.searchText;
    if(searchText) params.title = RegExp(searchText,'i');
    co(function*() {
        let libraryList = yield LibraryModel.find(params);
        responseObj.data.libraryList = libraryList;
        res.send(responseObj);
    }).catch(err=> {
        logger.error('libraryList Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

exports.findLibrary = (req, res)=> {
    let responseObj = Response();
    let _id = req.query._id;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty !');
        res.send(responseObj);
    }
    co(function*() {
        let library = yield LibraryModel.findOne({_id: _id});
        responseObj.data.library = library;
        res.send(responseObj);
    }).catch(err=> {
        logger.error("findLibrary Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


exports.saveLibrary = (req,res)=> {
    let responseObj = Response();
    let object = req.body.object;
    let _id = object._id;
    if (_id) {
        delete object._id;
        co(function*(){
            object.update_date = dateUtil.currentDate();
            yield LibraryModel.update({_id: _id}, object);
            res.send(responseObj);
        }).catch(err=>{
            logger.error("editLibrary Error:" + err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    } else {
        co(function*() {
            object.create_date = dateUtil.currentDate();
            object.update_date = dateUtil.currentDate();
            let newLibrary = new LibraryModel(object);
            yield newLibrary.save();
            res.send(responseObj);
        }).catch(err=> {
            logger.error("saveLibrary Error:" + err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    }
};


exports.delLibrary = (req,res)=>{
    let responseObj = Response();
    let _id = req.query._id;
    if(!_id){
        responseObj.errMsg(false, '_id is empty !');
        res.send(responseObj);
    }
    co(function*(){
        yield LibraryModel.remove({_id:_id});
        res.send(responseObj);
    }).catch(err=>{
        logger.error("saveLibrary Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    })
};