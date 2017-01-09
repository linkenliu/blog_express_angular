'use strict';
const Model = require('../../models/Model'),
    uuid = require('../../utils/uuid'),
    co = require('co'),
    async = require('async'),
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
exports.delModel = (req, res)=> {
    let _id = req.query._id;
    let model = req.query.model;
    let responseObj = Response();
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        return res.send(responseObj);
    }
    co(function*() {
        yield Model.getModel(model).findOne({"_id": _id}).remove();
        return res.send(responseObj);
    }).catch(err=> {
        logger.error('delModel>>' + model + " Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};

exports.batchDeleteModel = (req, res)=> {
    let ids = req.query.ids;
    let _model = req.query.model;
    let responseObj = Response();
    if (!ids || ids.length < 1) {
        responseObj.errMsg(false, '_id is empty');
        return res.send(responseObj);
    }
    if (typeof ids == 'string') {
        co(function*() {
            yield Model.getModel(_model).findOne({"_id": ids}).remove();
            return res.send(responseObj);
        }).catch(err=> {
            logger.error('delModel>>' + _model + " Error:" + err.message);
            responseObj.errMsg(false, err.message);
            return res.send(responseObj);
        });
    } else {
        async.map(ids, (item, next)=> {
            Model.getModel(_model).findOne({"_id": item}).remove(function (err, obj) {
                next(err, obj);
            });
        }, (err)=> {
            if (err) {
                responseObj.errMsg(false, err.message);
                res.send(responseObj);
            } else {
                return res.send(responseObj);
            }
        });
    }
};


/**
 * general single query, _id query conditions, model is the need to query the object
 * @param req
 * @param res
 * @returns {*}
 */
exports.findModel = (req, res)=> {
    let _id = req.query._id;
    let model = req.query.model;
    let responseObj = Response();
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        return res.send(responseObj);
    }
    co(function*() {
        let object = yield Model.getModel(model).findOne({"_id": _id});
        if (model == 'post') {
            object.content = toMarkdown(object.content);
        }
        responseObj.data[model] = object;
        return res.send(responseObj);
    }).catch(err=> {
        logger.error('findModel>>' + model + " Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};