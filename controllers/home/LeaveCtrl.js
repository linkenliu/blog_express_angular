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
        let leaveList = yield LeaveModel.find({state: 1}).sort({create_date:-1}).exec();
        responseObj.data.leaveList = leaveList;
        return res.send(responseObj);
    }).catch(err=> {
        logger.error('leaveList Error:' + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};


exports.saveLeave = (req, res)=> {
    let responseObj = Response();
    let object = req.body.object;
    co(function*() {
        object.create_date = dateUtil.currentDate();
        let newLeave = new LeaveModel(object);
        yield newLeave.save();
        res.send(responseObj);
    }).catch(err=> {
        logger.error('saveLeave Error:' + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};


exports.test = (req,res)=>{
    LeaveModel.findByIdAndRemove({_id:'58732b4d54cd08073e206791'},function(err,obj){
        res.send('123')
    });
};