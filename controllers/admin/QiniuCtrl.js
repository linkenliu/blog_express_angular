'use strict';
const qiniu = require('../../utils/qiniu'),
    uuid = require('../../utils/uuid'),
    co = require('co'),
    config = require('../../config/config'),
    qiniutoken = qiniu.upToken('blog'),
    logger = require('../../utils/logger.js').getLogger('ctrl'),
    Response = require('../../utils/responseObj');




/*upload image for qiniu */
exports.uploadForQiniu = (req, res)=> {
    console.log(req.files);
    let responseObj = Response();
    if (req.files.files.type.indexOf('image') == -1){
        responseObj.errMsg(false, '提交的不是图片文件');
        res.send(responseObj);
    }

    co(function*(){
        let body = yield qiniu.uploadFile(req.files.files.path, uuid.v1(), qiniutoken);
        if (body.success) {
            responseObj.data.qiniu_image = config.qiniu + body.key;
        } else {
            responseObj.errMsg(false, body.message);
        }
        res.send(responseObj);
    }).catch((err)=>{
        responseObj.errMsg(false, '上传失败');
        res.send(responseObj);
    });

};