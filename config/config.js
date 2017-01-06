'use strict';
module .exports = {
    debug: true,
    service_path:'http://127.0.0.1:7000/',
    "qiniu_config":{
        "accessKey":"DCqIYmhHuIgLdfUWpcn4Lzo-1QZ1juBALUTFVTkb",
        "secretKey":"Bp7Io4kyOOmN9HEiFJ8GNhKfcUk9fV6IDywtEuC0"
    },
    "mongoDB":"mongodb://127.0.0.1:27017/blog_express",
    "redisDB": {
        "dbhost": "127.0.0.1",
        "port": 6379,
        "password": ""
    },
    default_cover:'http://oim9lzsav.bkt.clouddn.com/ohter.jpg',
    qiniu:'http://oim9lzsav.bkt.clouddn.com/'
};