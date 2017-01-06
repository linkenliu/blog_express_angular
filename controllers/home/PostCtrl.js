'use strict';
const
    Response = require('../../utils/responseObj'),
    PostModel = require('../../models/PostModel'),
    dateUtil = require('../../utils/dateUtil'),
    ChannelModel = require('../../models/ChannelModel'),
    PostCommentModel = require('../../models/PostCommentModel'),
    co = require('co');


let logger = require('../../utils/logger.js').getLogger('ctrl');


/**
 * get post list information
 * @param req
 * @param res
 * @returns {*}
 */
exports.post = (req, res)=> {
    let responseObj = Response();
    let type = req.query.type;
    let chid = req.query.chid;
    if (!type) {
        responseObj.errMsg(false, 'type is empty');
        return res.send(responseObj);
    }
    let params = {
        'type.type': type
    };
    if (chid) params['type.channel'] = chid;
    co(function*() {
        let posts = yield PostModel.find(params).populate('Channel type.channel', 'name').where({release_state: 1}).sort({
            is_top: -1,
            create_date: -1
        }).exec();
        responseObj.data.posts = posts;
        return res.send(responseObj);
    }).catch(err=> {
        logger.error('post Error:' + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};


/**
 * search
 * @param req
 * @param res
 */
exports.search = (req, res)=> {
    let responseObj = Response();
    let searchText = req.query.searchText;
    co(function*() {
        let [postList, channelList] = yield Promise.all([
            PostModel.find({title: new RegExp(searchText, 'i')}).populate('Channel type.channel', 'name').where({release_state: 1}).sort({
                is_top: -1,
                create_date: -1
            }).exec(),
            ChannelModel.find({name: new RegExp(searchText, 'i')})
        ]);
        let postArr = [], sujiArr = [], demoArr = [];
        yield Promise.all(postList.map((post) => {
            if (post.type.type == 'post') {
                postArr.push(post);
            } else if (post.type.type == 'suji') {
                sujiArr.push(post);
            } else if (post.type.type == 'demo') {
                demoArr.push(post);
            }
        }));
        let allList = postArr.concat(sujiArr, demoArr);
        let resObj = {};
        resObj.channelList = channelList;
        resObj.postList = postArr;
        resObj.sujiList = sujiArr;
        resObj.demoList = demoArr;
        resObj.allList = allList;
        responseObj.data.data = resObj;
        res.send(responseObj);
    }).catch(err=> {
        logger.error('search Error:' + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};

/*click view*/

exports.clickView = (req, res)=> {
    let _id = req.query._id;
    let responseObj = Response();
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        return res.send(responseObj);
    }
    co(function*() {
        let post = yield PostModel.findOne({_id: _id}).select('_id view_count');
        if (!post) {
            responseObj.errMsg(false, 'no such post');
            return res.send(responseObj);
        }
        post.view_count = post.view_count + 1;
        yield post.save();
        return res.send(responseObj);
    }).catch(err=> {
        logger.error("clickView Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};


/*send comment*/
exports.sendComment = (req, res)=> {
    let object = req.body.object;
    let responseObj = Response();
    let _id = object._id;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty');
        return res.send(responseObj);
    }
    co(function*() {
        let post = yield PostModel.findOne({_id: _id}).select('_id comment_count');
        if (!post) {
            responseObj.errMsg(false, 'no such post');
            res.send(responseObj);
        }
        post.comment_count = post.comment_count + 1;
        yield post.save();
        object.create_date = dateUtil.currentDate();
        object.post = object._id;
        delete object._id;
        let newPostComment = new PostCommentModel(object);
        yield newPostComment.save(object);
        res.send(responseObj);
    }).catch(err=> {
        logger.error("sendComment Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


exports.commentList = (req, res)=> {
    let _id = req.query._id;
    let responseObj = Response();
    if (!_id) {
        responseObj.errMsg(false, "_id is empty");
        return res.send(responseObj);
    }
    co(function*() {
        let commentList = yield PostCommentModel.find({post: _id}).sort({create_date:-1}).exec();
        responseObj.data.commentList = commentList;
        res.send(responseObj);
    }).catch(err=> {
        logger.error("commentList Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};