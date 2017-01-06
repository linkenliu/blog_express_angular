'use strict';
const Model = require('../../models/Model'),
    uuid = require('../../utils/uuid'),
    co = require('co'),
    config = require('../../config/config'),
    logger = require('../../utils/logger.js').getLogger('ctrl'),
    Response = require('../../utils/responseObj');


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
        responseObj.data[model] = object;
        return res.send(responseObj);
    }).catch(err=>{
        logger.error('findModel>>'+model+" Error:"+err.message);
        responseObj.errMsg(false,err.message);
        return res.send(responseObj);
    });
};