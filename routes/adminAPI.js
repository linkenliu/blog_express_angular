'use strict';


const express = require('express'),
     router = express.Router(),
     multipart = require('connect-multiparty'),
     multipartMiddleware = multipart(),
     channelCtrl = require('./../controllers/admin/ChannelCtrl'),
     postCtrl = require('./../controllers/admin/PostCtrl'),
     qiniuCtrl = require('./../controllers/admin/QiniuCtrl'),
     friendCtrl = require('./../controllers/admin/FriendCtrl'),
     libraryCtrl = require('./../controllers/admin/LibraryCtrl'),
     publicCtrl = require('./../controllers/admin/PublicCtrl'),
     leaveCtrl = require('./../controllers/admin/LeaveCtrl'),
     editorCtrl = require('./../controllers/admin/EditorCtrl');


router.get('/login', (req, res)=> {
    res.render('admin/login')
});

router.get('/index',(req,res)=>{
   res.render('admin/index');
});


//user login
router.post('/login',editorCtrl.login);

//editor list
router.get('/editor',editorCtrl.editorList);

//editor add
router.post('/editor',editorCtrl.saveEditor);

//user layout
router.get('/layout',editorCtrl.layout);

// get channels information
router.get('/channel',channelCtrl.getChannels);

//add channel
router.post('/channel',channelCtrl.saveChannel);

//get post information
router.get('/post',postCtrl.postList);

//add post
router.post('/post',postCtrl.postAdd);

//update post
router.put('/post',postCtrl.postEdit);

//get library list
router.get('/library',libraryCtrl.libraryList);

//save or edit library
router.post('/library',libraryCtrl.saveLibrary);

//get friend list information
router.get('/friend',friendCtrl.friendList);

//save or edit friend information
router.post('/friend',friendCtrl.saveFriend);

//get comment list
router.get('/comment',postCtrl.commentList);

//update comment
router.put('/comment',postCtrl.updateComment);

//get leave list
router.get('/leave',leaveCtrl.leaveList);

//update leave
router.put('/leave',leaveCtrl.updateLeave);

//delete model
router.delete('/deleteModel',publicCtrl.delModel);

//batch delete model
router.delete('/batchDeleteModel',publicCtrl.batchDeleteModel);

//find model
router.get('/findModel',publicCtrl.findModel);

//upload image for qiniu
router.post('/uploadForQiniu',multipartMiddleware,qiniuCtrl.uploadForQiniu);

module.exports = router;
