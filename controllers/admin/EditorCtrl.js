'use strict';
const EditorModel = require('../../models/EditorModel'),
    Response = require('../../utils/responseObj'),
    dateUtil = require('../../utils/dateUtil'),
    co = require('co');

let editorCtrl = {};
let logger = require('../../utils/logger.js').getLogger('ctrl');
editorCtrl.login = (req, res)=> {
    let responseObj = Response();
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        responseObj.errMsg(false, '请检查用户名或密码是否填写!');
        res.send(responseObj)
    }
    co(function*() {
        let editor = yield EditorModel.findOne({username: username});
        if (!editor) {
            responseObj.errMsg(false, '用户名或密码错误!');
            res.send(responseObj)
        }
        if (password != editor.password) {
            responseObj.errMsg(false, '用户名或密码错误!');
            res.send(responseObj)
        }
        if (editor.state != 1) {
            responseObj.errMsg(false, '用户名已被冻结!');
            res.send(responseObj)
        }
        req.session.sessionUser = editor;
        req.session.save(function () {
            responseObj.message = '登录成功,正在跳转...';
            responseObj.data.editor = editor;
            res.send(responseObj);
        });
    }).catch(err=> {
        logger.error("login Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj)
    });
};


/**
 * get a list of user information
 */
editorCtrl.editorList = (req, res)=> {
    let responseObj = Response();
    let params = {};
    let searchText = req.query.searchText;
    if(searchText) params.username = new RegExp(searchText,'i');
    co(function*() {
        let editorList = yield EditorModel.find(params);
        responseObj.data.editorList = editorList;
        res.send(responseObj);
    }).catch(err=> {
        logger.error("editorList Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

editorCtrl.findEditor = (req, res)=> {
    let responseObj = Response();
    let _id = req.query._id;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        res.send(responseObj);
    }
    co(function*() {
        let editor = yield EditorModel.findOne({_id: _id});
        responseObj.data.editor = editor;
        res.send(responseObj);
    }).catch(err=> {
        logger.error('findEditor Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


/**
 * save or edit editor information
 */
editorCtrl.saveEditor = (req, res) => {
    let responseObj = Response();
    let object = req.body.object;
    let _id = object._id;
    if (_id) {
        //edit
        delete object._id;
        co(function*() {
            yield EditorModel.update({_id: _id}, object);
            res.send(responseObj);
        }).catch(err=> {
            logger.error("editEditor Error:" + err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    } else {
        //save
        object.create_date = dateUtil.currentDate();
        object.update_date = dateUtil.currentDate();
        let newEditor = new EditorModel(object);
        co(function*() {
            yield newEditor.save();
            res.send(responseObj);
        }).catch((err)=> {
            logger.error("saveEditor Error:" + err.message);
            responseObj.errMsg(false, err.message);
            res.send(responseObj);
        });
    }
};



editorCtrl.delEditor = (req,res)=>{
    let responseObj = Response();
    let _id = req.query._id;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        res.send(responseObj);
    }
    co(function*(){
        yield EditorModel.remove({_id:_id});
        res.send(responseObj);
    }).catch(err=>{
        logger.error("delEditor Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


editorCtrl.layout = (req, res)=> {
    req.session.destroy((err)=> {
        if (err) {
            logger.error("layout Error:" + err.message);
        } else {
            res.redirect('/admin/login');
        }
    });
};

module.exports = editorCtrl;