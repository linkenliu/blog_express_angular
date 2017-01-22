'use strict';
const
    Response = require('../../utils/responseObj'),
    PostModel = require('../../models/PostModel'),
    dateUtil = require('../../utils/dateUtil'),
    ChannelModel = require('../../models/ChannelModel'),
    LibraryModel = require('../../models/LibraryModel'),
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
    let index = req.query.pageIndex;
    let pageSize = req.query.pageSize;
    let pageIndex = index == null ? 1 : (index - 1) * pageSize;
    if (!type) {
        responseObj.errMsg(false, 'type is empty');
        return res.send(responseObj);
    }
    let params = {
        'type.type': type
    };
    if (chid) params['type.channel'] = chid;

    co(function*() {
        if('post' == type){
            let [posts,postCount] = yield Promise.all([
                PostModel.find(params).populate('Channel type.channel', 'name').skip(parseInt(pageIndex)).limit(parseInt(pageSize)).where({release_state: 1}).sort({
                    is_top: -1,
                    create_date: -1
                }).exec(),
                PostModel.count(params).populate('Channel type.channel', 'name').where({release_state: 1})
            ]);
            responseObj.data.posts = posts;
            responseObj.data.postCount = postCount;
            return res.send(responseObj);
        }else{
            let posts = yield PostModel.find(params).where({release_state: 1}).exec();
            responseObj.data.posts = posts;
            return res.send(responseObj);
        }
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
        let commentList = yield PostCommentModel.find({post: _id}).sort({create_date: -1}).exec();
        responseObj.data.commentList = commentList;
        res.send(responseObj);
    }).catch(err=> {
        logger.error("commentList Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};

/**
 * read according to the amount of reading posts limit 5
 * @param req
 * @param res
 */
exports.readPost = (req, res) => {
    let responseObj = Response();
    co(function*() {
        let postList = yield PostModel.find({release_state: 1}).sort({view_count: -1}).limit(5).exec();
        responseObj.data.postList = postList;
        return res.send(responseObj);
    }).catch(err=> {
        logger.err("readPost Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};

//recent release limit 5
exports.recentPost = (req, res)=> {
    let responseObj = Response();
    let calculateDate = dateUtil.calculateDate(30);
    co(function*() {
        let postList = yield PostModel.find({create_date: {$gte: calculateDate}}).limit(5).exec();
        responseObj.data.postList = postList;
        return res.send(responseObj);
    }).catch(err=> {
        logger.error("recentPost Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};

exports.correlationPost = (req, res) => {
    let type = req.query.type;
    let _id = req.query._id;
    let responseObj = Response();
    let params = {};
    if (_id) {
        params._id = {$ne: _id};
    }
    co(function*() {
        if ('null' == type || 'undefined' == type) {
            params['type.type'] = 'demo';
        } else {
            params['type.channel'] = type;
        }
        let postList = yield PostModel.find(params).exec();
        responseObj.data.postList = postList;
        return res.send(responseObj);
    }).catch(err=> {
        logger.error("correlationPost Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};


exports.search2 = (req, res)=> {
    let object = req.query.object;
    if (object) object = JSON.parse(object);
    let searchText = object.searchText;
    let tag = object.tag;
    let responseObj = Response();
    let params = {};
    let params2 = {};
    if (searchText && 'null' != searchText && 'undefined' != searchText) {
        params.title = new RegExp(searchText, 'i');
        params2.title = new RegExp(searchText, 'i');
    }
    if (tag && 'null' != tag && 'undefined' != tag) {
        params['type.channel'] = tag;
    }
    co(function*() {
        let [postList, libraryList] = yield Promise.all([
            PostModel.find(params).where({release_state: 1}).sort({
                is_top: -1,
                create_date: -1
            }).exec(),
            LibraryModel.find(params2).where({state: 1}).exec()
        ]);
        responseObj.data.postList = postList;
        responseObj.data.libraryList = libraryList;
        return res.send(responseObj);
    }).catch(err=> {
        logger("search2 Error:" + err.message);
        responseObj.errMsg(false, err.message);
        return res.send(responseObj);
    });
};