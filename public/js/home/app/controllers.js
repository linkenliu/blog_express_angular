'use strict';


angular.module('BlogApp.controllers', [])
    .controller('ChannelCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {
        myload();
        blData.requestUrl('GET', 'channel').then((data)=> {
            if (data.success) {
                $scope.channels = data.data.channels;
                myclose();
            } else {
                myalert(2, data.message);
            }
        });

    }])
    .controller('PostCtrl', ['$scope', '$location', '$http', 'blData', '$stateParams', ($scope, $location, $http, blData, $stateParams) => {
        let chid = $stateParams._id;
        myload();
        blData.requestUrl('GET', 'post', {type: 'post', chid: chid}).then((data)=> {
            $scope.posts = data.data.posts;
            myclose();
        });
    }])
    .controller('DemoCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {
        myload();
        blData.requestUrl('GET', 'post', {type: 'demo'}).then((data)=> {
            $scope.posts = data.data.posts;
            myclose();
        });


        $scope.$on('ngRepeatFinished', function () {
            $(".demo_container .item .rsp").hide();
            hover();
        });


        $scope.mouseover = ()=> {
            //$(".demo_container .item .rsp").hide();
            hover();
        };


        var hover = ()=> {
            $(".demo_container .item").hover(function () {
                    $(this).find(".rsp").stop().fadeTo(500, 0.5);
                    $(this).find(".text").stop().animate({left: '0'}, {duration: 500})
                },
                function () {
                    $(this).find(".rsp").stop().fadeTo(500, 0);
                    $(this).find(".text").stop().animate({left: '100%'}, {duration: "fast"});
                    $(this).find(".text").animate({left: '-100%'}, {duration: 0})
                });
        }


    }])
    .controller('SearchCtrl', ['$scope', '$location', '$http', 'blData', '$stateParams', ($scope, $location, $http, blData, $stateParams) => {
        let searchText = $stateParams.searchText;
        blData.requestUrl('GET', 'search', {searchText: searchText}).then(data=> {
            $scope.data = data.data;
        });

        $scope.value = 'all';

        let searchNavs = [
            {text: '全部', value: 'all'},
            {text: '帖子', value: 'post'},
            {text: '速记', value: 'suji'},
            {text: '实例', value: 'demo'}
        ];

        $scope.searchNavs = searchNavs;

        $scope.ck = (value)=> {
            $scope.value = value;

            $("#search_container div.post_item").css('display', 'none');
            $("#" + value).css('display', 'block');
        };


        $scope.$on('ngRepeatFinished', function () {
            $(".demo_container .item .rsp").hide();
            hover();
        });


        $scope.mouseover = ()=> {
            //$(".demo_container .item .rsp").hide();
            hover();
        };


        var hover = ()=> {
            $(".demo_container .item").hover(function () {
                    $(this).find(".rsp").stop().fadeTo(500, 0.5);
                    $(this).find(".text").stop().animate({left: '0'}, {duration: 500})
                },
                function () {
                    $(this).find(".rsp").stop().fadeTo(500, 0);
                    $(this).find(".text").stop().animate({left: '100%'}, {duration: "fast"});
                    $(this).find(".text").animate({left: '-100%'}, {duration: 0})
                });
        }


    }])
    .controller('SujiCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {
        myload();
        blData.requestUrl('GET', 'post', {type: 'suji'}).then((data)=> {
            $scope.posts = data.data.posts;
            myclose();
        });
    }])
    .controller('DetailsCtrl', ['$scope', '$location', '$http', 'blData', '$stateParams', ($scope, $location, $http, blData, $stateParams) => {
        let _id = $stateParams._id;
        myload();
        blData.requestUrl('GET', 'findModel', {_id: _id, model: 'post'}).then((data)=> {
            blData.requestUrl('GET', 'clickView', {_id: _id}).then((post)=> {
                data.data.post.view_count = data.data.post.view_count + 1;
                $scope.post = data.data.post;
                myclose();
            });
        });

        $scope.F = 'F';

        $scope.isMore = 'F';

        let loadComment = (F)=> {
            blData.requestUrl('GET', 'comment', {_id: _id}).then(data=> {
                let commentList = data.data.commentList;
                if('Save' != F){
                    if(!F){
                        if(commentList.length>5) $scope.isMore = 'T';
                    }
                }
                if ('F' == $scope.F) {
                    let newCommentList = [];
                    for (let i = 0; i < commentList.length; i++) {
                        if (i < 5) {
                            newCommentList.push(commentList[i]);
                        }
                    }
                    $scope.commentList = newCommentList;
                } else {
                    $scope.commentList = commentList;
                }
            });
        };

        loadComment();


        $scope.allComment = ()=>{
            loadComment(true);
            $scope.F = 'T';
            $scope.isMore = 'S';
        };


        $scope.sComment = ()=>{
            $scope.F = 'F';
            $scope.isMore = 'T';
            loadComment(true);
        };

        $scope.user = {};

        $scope.sendComment = (_id)=> {
            $scope.user._id = _id;
            if (!$scope.user.content) {
                return layer.msg('请输入留言内容', function () {
                });
            } else if (!$scope.user.username) {
                return layer.msg('请输入您的大名', function () {
                });
            }
            if ($scope.user.email) {
                if (!/^\w+@[0-9a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test($scope.user.email)) {
                    return layer.msg('邮箱格式有误', function () {
                    });
                }
            }
            $("#sendComment").attr('disabled', 'disabled');
            $http.post('/home/v1/sendComment', {object: $scope.user}).success(data=> {
                $("#sendComment").removeAttr('disabled');
                if (data.success) {
                    layer.msg('评论成功');
                    loadComment('Save');
                } else {
                    return layer.msg('评论失败', function () {
                    });
                }
            });
        };


        setTimeout(()=> {
            $('a[href^="http"]').each(function () {
                $(this).attr('target', '_blank');
            });
            $('a[href^="https"]').each(function () {
                $(this).attr('target', '_blank');
            });
        }, 1000);

    }])
    .controller('HeadCtrl', ['$scope', '$location', '$http', 'blData', '$state', ($scope, $location, $http, blData, $state) => {
        $scope.value = 'home';
        let navs = [
            {"text": "主页", "value": "home", "sref": "/home/channel"},
            {"text": "帖子", "value": "post", "sref": "/home/post"},
            {"text": "实例", "value": "demo", "sref": "/home/demo"},
            {"text": "速记", "value": "suji", "sref": "/home/suji"},
            {"text": "关于", "value": "about", "sref": "/home/about"}
        ];
        $scope.navs = navs;

        $scope.navClick = (sref, value)=> {
            $scope.value = value;
            $location.path(sref);
        };

        $scope.searchText = '';
        $scope.search = ()=> {
            if ($scope.searchText) {
                $state.go('index.home.search', {searchText: $scope.searchText});
            }
        };


        $scope.myKeyup = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.search();
            }
        };


    }]).controller('averCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {
        let averList = [
            {text: 'Library', value: 'library'},
            {text: '友情', value: 'friend'}
        ];
        $scope.averList = averList;


        $scope.value = 'library';
        let loadLibrary = ()=> {
            blData.requestUrl('GET', 'library').then(data=> {
                $scope.friendList = '';
                $scope.libraryList = data.data.libraryList;
            });
        };

        loadLibrary();

        $scope.toGo = (value)=> {
            $scope.value = value;
            if ('library' == value) {
                loadLibrary();
            } else {
                let loadFriend = ()=> {
                    blData.requestUrl('GET', 'friend').then(data=> {
                        $scope.libraryList = '';
                        $scope.friendList = data.data.friendList;
                    });
                };

                loadFriend();
            }
        };


        let i = 1;
        $scope.moveAver = ()=> {
            $("#add").css("transform", "rotate(" + (i * 360) + "deg)");
            i += 1;
            var isShow = $("#add").attr('is-show');
            if ('hide' == isShow) {
                $("#right-menu").animate({"right": "0px"}, 350);
                $("#add").attr('is-show', 'show');
            } else {
                $("#right-menu").animate({"right": "-300px"}, 350);
                $("#add").attr('is-show', 'hide');
            }
        };


    }]).controller('footerCtrl', ['$scope', '$location', '$http', ($scope, $location, $http) => {
        $scope.cutBackground = () => {
            var items = ['http://7xoxjl.com1.z0.glb.clouddn.com/FqPnf9c1pYzLwaoDoECxZ3EIzXfx', 'http://7xoxjl.com1.z0.glb.clouddn.com/FoadU4Vqi0-VqdbIEIXIbzDUGHsN', 'http://oim9lzsav.bkt.clouddn.com/02K58PICY4N.jpg'];
            var item = items[Math.floor(Math.random() * items.length)];
            $("body").css("background-image", "url(" + item + ")");
        };

    }]).controller('AboutCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        $scope.F = 'F';

        $scope.isMore = 'F';

        let loadLeave = (F)=> {
            myload();
            blData.requestUrl('GET', 'leave').then(data=> {
                let leaveList = data.data.leaveList;
                if('Save' != F){
                    if(!F){
                        if(leaveList.length>5) $scope.isMore = 'T';
                    }
                }
                if ('F' == $scope.F) {
                    let newLeaveList = [];
                    for (let i = 0; i < leaveList.length; i++) {
                        if (i < 5) {
                            newLeaveList.push(leaveList[i]);
                        }
                    }
                    $scope.leaveList = newLeaveList;
                } else {
                    $scope.leaveList = leaveList;
                }
                myclose();
            });
        };

        loadLeave();

        $scope.leave = {};

        $scope.sendLeave = ()=> {
            if(!$scope.leave.content){
                return layer.msg('请输入留言内容', function () {
                });
            }else if(!$scope.leave.username){
                return layer.msg('请输入您的大名', function () {
                });
            }else{
                $("#sendComment").attr('disabled', 'disabled');
                $http.post('/home/v1/leave', {object: $scope.leave}).success(data=> {
                    $("#sendComment").removeAttr('disabled');
                    if (data.success) {
                        layer.msg('留言成功');
                        loadLeave('Save');
                    } else {
                        return layer.msg('留言失败', function () {
                        });
                    }
                });
            }
        };


        $scope.allLeave = ()=>{
            loadLeave(true);
            $scope.F = 'T';
            $scope.isMore = 'S';
        };


        $scope.sLeave = ()=>{
            $scope.F = 'F';
            $scope.isMore = 'T';
            loadLeave(true);
        };



    }]);


