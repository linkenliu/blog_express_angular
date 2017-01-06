'use strict';
angular.module('BlogApp.routes', ['ui.router','BlogApp.controllers'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider.state('index', {
            url: '/',
            views: {
                'topbar': {
                    templateUrl: 'admin/layout/topbar.html',
                    controller:'TopbarCtrl'
                },
                'vcon': {
                    templateUrl: 'admin/layout/cont.html'
                },
                'footer': {
                    templateUrl: 'admin/layout/footer.html'
                }
            }
        }).state('index.admin', {
            url: 'admin',
            views: {
                'menu': {
                    templateUrl: 'admin/layout/leftmenu.html'
                }
            }
        }).state('index.admin.index', {
            url: '/index',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/index.html'
                }
            }
        }).state('index.admin.editor', {
            url: '/editor',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/editorList.html',
                    controller:'EditorCtrl'
                }
            }
        })
        .state('index.admin.channel', {
            url: '/channel',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/channelList.html',
                    controller:'ChannelCtrl'
                }
            }
        })
        .state('index.admin.post', {
            url: '/post',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/postList.html',
                    controller:'PostCtrl'
                }
            }
        })
        .state('index.admin.post.postApp', {
            url: '/postAdd',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/postAdd.html',
                    controller:'PostAddCtrl'
                }
            }
        })
        .state('index.admin.post.postEdit', {
            url: '/postEdit?_id',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/postEdit.html',
                    controller:'PostEditCtrl'
                }
            }
        })
        .state('index.admin.library', {
            url: '/library',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/libraryList.html',
                    controller:'LibraryCtrl'
                }
            }
        })
        .state('index.admin.friend', {
            url: '/friend',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/friendList.html',
                    controller:'FriendCtrl'
                }
            }
        })
        .state('index.admin.comment', {
            url: '/comment',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/commentList.html',
                    controller:'CommentCtrl'
                }
            }
        })
        .state('index.admin.leave', {
            url: '/leave',
            views: {
                'info@index': {
                    templateUrl: 'admin/tpls/leaveList.html',
                    controller:'LeaveCtrl'
                }
            }
        });
        $urlRouterProvider.otherwise("/admin/index");
        //$locationProvider.html5Mode(true);


    });

