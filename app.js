'use strict';
const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    ejs = require('ejs'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser');

const  config = require('./config/config');

const mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    extend = require('mongoose-schema-extend');


const connect =  ()=> {mongoose.connect(config.mongoDB,{server: {socketOptions: {keepAlive: 1}}});};connect();
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.on('disconnected', connect);


const  homeAPI = require('./routes/homeAPI');
const  adminAPI = require('./routes/adminAPI');
const  app = express();



// 设置会话参数
app.use(session({
    name:'connect.sid',//这里的name值得是cookie的name，默认cookie的name是：connect.sid
    secret:'1234567890QWERTY',
    cookie: {
        secure: false
    },
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true。
    saveUninitialized: true
}));


//登陆验证
app.use('/admin',function(req,res,next){
    //session不存在并且不是登陆页面时跳转到对应的页面
     if (!req.session.sessionUser && req.url == "/login") {
        next();
    } else if(req.session.sessionUser){
        app.locals.sessionUser = req.session.sessionUser;
        next();
    } else {
        //否则跳转到登陆页面
        res.render('admin/login');
    }
});



app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminAPI);
app.use(homeAPI);


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
