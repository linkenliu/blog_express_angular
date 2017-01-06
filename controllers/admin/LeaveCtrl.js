'use strict';
const
    Response = require('../../utils/responseObj'),
    dateUtil = require('../../utils/dateUtil'),
    LeaveModel = require('../../models/LeaveModel'),
    co = require('co');


let logger = require('../../utils/logger.js').getLogger('ctrl');

exports.leaveList = (req, res)=> {
    let responseObj = Response();
    co(function*() {
        let leaveList = yield LeaveModel.find();
        responseObj.data.leaveList = leaveList;
        return res.send(responseObj);
    }).catch(err=> {
        logger.error('leaveList Error:' + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};


exports.updateLeave = (req,res)=>{
    let responseObj = Response();
    let _id = req.body._id;
    let action = req.body.action;
    let state = 0;
    if('recover' == action) state = 1;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        return res.send(responseObj);
    }
    co(function*() {
        let leave = yield LeaveModel.findOne({_id: _id});
        if (!leave) {
            responseObj.errMsg(false, 'no such comment');
            return res.send(responseObj);
        }
        leave.state = state;
        yield leave.save();
        res.send(responseObj);
    }).catch(err=> {
        logger.error("updateLeave Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};