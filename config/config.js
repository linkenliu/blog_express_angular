'use strict';
module .exports = {
    debug: true,
    service_path:'http://127.0.0.1:7000/',
    "qiniu_config":{
        "accessKey":"",
        "secretKey":""
    },
    "mongoDB":"mongodb://username:pass@127.0.0.1:27017/databasename",
    options : {
        db: { native_parser: true },
        server: { poolSize: 5 },
        replset: { rs_name: 'userAdmin' },
        user: 'username',
        pass: 'pass'
    },
    "redisDB": {
        "dbhost": "127.0.0.1",
        "port": 6379,
        "password": ""
    },
    default_cover:'http://oim9lzsav.bkt.clouddn.com/ohter.jpg',
    qiniu:'http://oim9lzsav.bkt.clouddn.com/'
};