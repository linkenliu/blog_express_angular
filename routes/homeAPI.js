'use strict';


const express = require('express'),
     router = express.Router(),
     channelCtrl = require('../controllers/home/ChannelCtrl'),
     postCtrl = require('../controllers/home/PostCtrl'),
     libraryCtrl = require('../controllers/home/LibraryCtrl'),
     leaveCtrl = require('../controllers/home/LeaveCtrl'),
     friendCtrl = require('../controllers/home/FriendCtrl'),
     publicCtrl = require('../controllers/home/PublicCtrl'),
     homeCtrl = require('../controllers/home/HomeCtrl');


//render home view
router.get('/home',homeCtrl.home);

//get channel list information
router.get('/home/v1/channel',channelCtrl.getChannels);

////get post list information
router.get('/home/v1/post',postCtrl.post);

//general single query, _id query conditions, model is the need to query the object
router.get('/home/v1/findModel',publicCtrl.findModel);

//get library list information
router.get('/home/v1/library',libraryCtrl.library);

//get friend list information
router.get('/home/v1/friend',friendCtrl.friend);

//search
router.get('/home/v1/search',postCtrl.search);

//click view
router.get('/home/v1/clickView',postCtrl.clickView);

//send comment
router.post('/home/v1/sendComment',postCtrl.sendComment);

//comment list
router.get('/home/v1/comment',postCtrl.commentList);

//save leave
router.post('/home/v1/leave',leaveCtrl.saveLeave);

//leave list information
router.get('/home/v1/leave',leaveCtrl.leaveList);

//read post
router.get('/home/v1/readPost',postCtrl.readPost);

//recent release
router.get('/home/v1/recentPost',postCtrl.recentPost);

router.get('/home/v1/correlationPost',postCtrl.correlationPost);

router.get('/home/v1/search2',postCtrl.search2);

module.exports = router;
