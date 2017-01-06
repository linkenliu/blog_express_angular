'use strict';
const Model = require('../../models/Model'),
    uuid = require('../../utils/uuid'),
    co = require('co'),
    config = require('../../config/config'),
    toMarkdown = require('to-markdown'),
    logger = require('../../utils/logger.js').getLogger('ctrl'),
    Response = require('../../utils/responseObj');


/**
 * generic deletion to _id for deletion condition, model for objects to be deleted
 * @param req
 * @param res
 * @returns {*}
 */
exports.delModel = (req,res)=>{
    let _id = req.query._id;
    let model = req.query.model;
    let responseObj = Response();
    if (!_id) {
        responseObj.errMsg(false,'_id is empty');
        return res.send(responseObj);
    }
    co(function*(){
        yield Model.getModel(model).findOne({"_id": _id}).remove();
        return res.send(responseObj);
    }).catch(err=>{
        logger.error('delModel>>'+model+" Error:"+err.message);
        responseObj.errMsg(false,err.message);
        return res.send(responseObj);
    });
};

/**
 * general single query, _id query conditions, model is the need to query the object
 * @param req
 * @param res
 * @returns {*}
 */
exports.findModel = (req,res)=>{
    let _id = req.query._id;
    let model = req.query.model;
    let responseObj = Response();
    if (!_id) {
        responseObj.errMsg(false,'_id is empty');
        return res.send(responseObj);
    }
    co(function*(){
        let object = yield Model.getModel(model).findOne({"_id": _id});
        if(model == 'post'){
            object.content = toMarkdown(object.content);
        }
        responseObj.data[model] = object;
        return res.send(responseObj);
    }).catch(err=>{
        logger.error('findModel>>'+model+" Error:"+err.message);
        responseObj.errMsg(false,err.message);
        return res.send(responseObj);
    });
};