'use strict';
const PostModel = require('../../models/PostModel'),
    PostCommentModel = require('../../models/PostCommentModel'),
    Response = require('../../utils/responseObj'),
    dateUtil = require('../../utils/dateUtil'),
    marked = require('marked'),
    toMarkdown = require('to-markdown'),
    co = require('co');


let logger = require('../../utils/logger.js').getLogger('ctrl');


/**
 * get post information
 * @param req
 * @param res
 */
exports.postList = (req, res)=> {
    let responseObj = Response();
    let type = req.query.type;
    let searchText = req.query.searchText;
    let params = {};
    if (type) params['type.type'] = type;
    if (searchText) params.title = new RegExp(searchText, 'i');
    co(function*() {
        let postList = yield PostModel
            .find(params)
            .populate('Channel type.channel', 'name')
            .populate('Editor editor', 'username')
            .sort({'create_date': -1})
            .exec();
        yield Promise.all(postList.map((post) => {
            convertValue(post);
            return post;
        }));
        responseObj.data.postList = postList;
        res.send(responseObj);
    }).catch((err)=> {
        logger.error('postList Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


let convertValue = (post)=> {
    let type = post.type.type;
    if (type == 'suji') {
        post.type.type = '速记';
    } else if (type == 'post') {
        post.type.type = '帖子';
    } else if (type == 'demo') {
        post.type.type = '实例';
    }
    return post;
};

/**
 * add post
 * @param req
 * @param res
 */
exports.postAdd = (req, res)=> {
    let responseObj = Response();
    let object = req.body.object;
    let htmlStr = marked(object.content.toString());
    let params = {};
    params.title = object.title;
    params.type = {
        type: object.type,
        channel: object.channel ? object.channel : null
    };
    params.content = htmlStr.toString();
    params.is_top = object.is_top ? object.is_top : 0;
    req.session.sessionUser._id ? params.editor = req.session.sessionUser._id : '';
    params.release_state = object.release_state;
    params.cover = object.cover;
    params.create_date = dateUtil.currentDate();
    params.update_date = dateUtil.currentDate();
    co(function*() {
        let newPost = new PostModel(params);
        yield newPost.save();
        res.send(responseObj);
    }).catch(err=> {
        logger.error('postAdd Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};


/**
 * remove post
 * @param req
 * @param res
 */
exports.postDel = (req, res)=> {
    let responseObj = Response();
    let _id = req.query._id;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty !');
        res.send(responseObj);
    }
    co(function*() {
        yield PostModel.remove({_id: _id});
        res.send(responseObj);
    }).catch((err)=> {
        logger.error('postDel Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

/**
 * find one post information
 * params _id
 */
exports.postOne = (req, res)=> {
    let responseObj = Response();
    let _id = req.query._id;
    if (!_id) {
        responseObj.errMsg(false, '_id is empty !');
        res.send(responseObj);
    }
    co(function*() {
        let post = yield  PostModel.findOne({_id: _id});
        if (!post) {
            responseObj.errMsg(false, 'no such post !');
            res.send(responseObj);
        }
        post.content = toMarkdown(post.content);
        responseObj.data.post = post;
        res.send(responseObj);
    }).catch((err)=> {
        logger.error('postOne Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

/**
 * update post information
 * @param req
 * @param res
 */
exports.postEdit = (req, res)=> {
    let responseObj = Response();
    let object = req.body.object;
    let htmlStr = marked(object.content.toString());
    object.content = htmlStr.toString();
    let type = {
        type: object.type,
        channel: object.channel ? object.channel : null
    };
    object.type = type;
    let _id = object._id;
    co(function*() {
        yield PostModel.update({_id: _id}, object);
        res.send(responseObj);
    }).catch((err)=> {
        logger.error('postEdit Error:' + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

/**
 * get post comment list information
 * @param req
 * @param res
 */
exports.commentList = (req, res)=> {
    let responseObj = Response();
    let searchText = req.query.searchText;
    let params = {};
    if(searchText){
        params.content=new RegExp(searchText,'i');
    }
    co(function*() {
        let commentList = yield PostCommentModel.find(params).populate('Post post', 'title');
        responseObj.data.commentList = commentList;
        res.send(responseObj);
    }).catch(err=> {
        logger.error("commentList Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};

/**
 * update comment
 * @param req
 * @param res
 */
exports.updateComment = (req, res)=> {
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
        let postComment = yield PostCommentModel.findOne({_id: _id});
        if (!postComment) {
            responseObj.errMsg(false, 'no such comment');
            return res.send(responseObj);
        }
        postComment.state = state;
        yield postComment.save();
        res.send(responseObj);
    }).catch(err=> {
        logger.error("updateComment Error:" + err.message);
        responseObj.errMsg(false, err.message);
        res.send(responseObj);
    });
};