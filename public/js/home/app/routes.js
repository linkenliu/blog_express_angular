'use strict';
angular.module('BlogApp.routes', ['ui.router', 'BlogApp.controllers'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider.state('index', {
            url: '/',
            views: {
                'vcon': {
                    templateUrl: 'home/layout/cont.html'
                },
                'right_aver':{
                    templateUrl: 'home/layout/right_aver.html',
                    controller: 'averCtrl'
                },
                'footer': {
                    templateUrl: 'home/layout/footer.html',
                    controller:'footerCtrl'
                }
            }
        }).state('index.home', {
            url: 'home',
            views: {
                'menu': {
                    templateUrl: 'home/layout/topbar.html',
                    controller: 'HeadCtrl'
                }
            }
        }).state('index.home.channel', {
            url: '/channel',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/channel.html',
                    controller: 'ChannelCtrl'
                }
            }
        })
        .state('index.home.post', {
            url: '/post',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/post.html',
                    controller: 'PostCtrl'
                }
            }
        })
        .state('index.home.post.details', {
            url: '/details/:_id',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/details.html',
                    controller: 'DetailsCtrl'
                }
            }
        })
        .state('index.home.demo', {
            url: '/demo',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/demo.html',
                    controller: 'DemoCtrl'
                }
            }
        })
        .state('index.home.suji', {
            url: '/suji',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/suji.html',
                    controller: 'SujiCtrl'
                }
            }
        })
        .state('index.home.about', {
            url: '/about',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/about.html',
                    controller: 'AboutCtrl'
                }
            }
        })
        .state('index.home.channelPost', {
            url: '/channelPost/:_id',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/post.html',
                    controller: 'PostCtrl'
                }
            }
        })
        .state('index.home.search', {
            url: '/search/:searchText',
            views: {
                'info@index': {
                    templateUrl: 'home/tpls/search.html',
                    controller: 'SearchCtrl'
                }
            }
        });
        $urlRouterProvider.otherwise("/home/channel");
        //$locationProvider.html5Mode(true);


    });

