'use strict';
const ChannelModel = require('../../models/ChannelModel'),
    Response = require('../../utils/responseObj'),
    co = require('co');


/*get home channel*/
exports.getChannels = (req, res) => {
    let responseObj = Response();
    return co(function*() {
        try {
            let channels = yield ChannelModel.find({state: 1}).sort({sort:-1}).exec();
            responseObj.data.channels = channels;
            res.send(responseObj);
        } catch (err) {
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        }
    });
};


