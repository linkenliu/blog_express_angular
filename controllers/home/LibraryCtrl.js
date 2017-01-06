'use strict';
const
    Response = require('../../utils/responseObj'),
    LibraryModel = require('../../models/LibraryModel'),
    co = require('co');


let logger = require('../../utils/logger.js').getLogger('ctrl');

exports.library = (req,res)=>{
    let responseObj = Response();
    co(function*(){
        let libraryList = yield LibraryModel.find({state:1});
        responseObj.data.libraryList = libraryList;
        return res.send(responseObj);
    }).catch(err=>{
        logger.error('library Error:'+err.message);
        responseObj.errMsg(false,err.message);
        return res.send(responseObj);
    });
};
