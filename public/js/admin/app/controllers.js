'use strict';


angular.module('BlogApp.controllers', [])
    .controller('EditorCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        $scope.editor = {};

        $scope.searchText = '';

        let loadEditor = ()=> {
            myload();
            blData.requestUrl('GET', 'editor', {searchText: $scope.searchText}).then((data)=> {
                if (data.success) {
                    $scope.editorList = data.data.editorList;
                    myclose();
                } else {
                    myalert(2, data.message);
                    myclose();
                }
            });
        };

        // user list information
        loadEditor();


        $scope.searchEditor = ()=> {
            if (GetStringByteLength($scope.searchText) > 2 || !$scope.searchText) {
                loadEditor();
            }
        };

        $scope.showEditorModal = (_id)=> {
            if (_id) {
                //edit
                $scope.modal_title = '编辑用户';
                blData.requestUrl('GET', 'findModel', {_id: _id, model: 'editor'}).then(data=> {
                    if (data.success) {
                        $scope.editor = data.data.editor;
                        $("#editorModal").toggle();
                    } else {
                        myalert(2, '系统异常');
                    }
                });
            } else {
                //save
                $scope.modal_title = '新增用户';
                $scope.editor = {state: 1};
                $("#editorModal").toggle();
            }
        };

        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };


        $scope.saveLibrary = ()=> {
            if (!$scope.editor.username) {
                myalert(2, '用户名不能为空!')
            } else if (!$scope.editor.password) {
                myalert(2, '密码不能为空!')
            } else {
                $http.post('/admin/editor', {object: $scope.editor}).success(data=> {
                    if (data.success) {
                        $("#editorModal").hide();
                        loadEditor();
                    } else {
                        myalert(2, '新增失败');
                    }
                });
            }
        };


        $scope.uploadAvatar = (_this)=> {
            var formData = new FormData();
            $.each($('#files')[0].files, function (i, file) {
                formData.append('files', file);
            });
            $.ajax({
                url: '/admin/uploadForQiniu',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.success) {
                        _this.editor.avatar = data.data.qiniu_image;
                    } else {
                        myalert('2', data.message);
                    }
                },
                error: function () {
                    myalert('2', '与服务器通信发生错误');
                }
            });
        };


        $scope.deleteEditor = (_id, username)=> {
            $scope.modal_title = '删除用户';
            $scope.delete_id = _id;
            $scope.delete_title = '[' + username + ']';
            $("#deleteModal").toggle();
        };


        $scope.destroy = ()=> {
            blData.requestUrl('DELETE', 'deleteModel', {_id: $scope.delete_id, model: 'editor'}).then(data=> {
                if (data.success) {
                    $("#deleteModal").toggle();
                    loadEditor();
                } else {
                    $("#deleteModal").toggle();
                    myalert(2, '删除失败');
                }
            });
        };

    }])
    .controller('TopbarCtrl', ['$scope', '$location', '$http', ($scope, $location, $http) => {
        //set username in localStorage
        $("#top_role_name>span.username").text(localStorage.getItem('username'));

    }])
    .controller('ChannelCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {
        $scope.channel = {};

        $scope.searchText = '';

        let loadChannel = ()=> {
            myload();
            blData.requestUrl('GET', 'channel', {searchText: $scope.searchText}).then((data)=> {
                if (data.success) {
                    $scope.channelList = data.data.channels;
                    myclose();
                } else {
                    myalert(2, data.message);
                    myclose();
                }
            });
        };

        //channel list information
        loadChannel();

        $scope.searchChannel = ()=> {
            if (GetStringByteLength($scope.searchText) > 2 || !$scope.searchText) {
                loadChannel();
            }
        };


        //show channel add modal
        $scope.showChannelModal = (_id)=> {
            if (_id) {
                $scope.modal_title = '编辑频道';
                blData.requestUrl('GET', 'findModel', {_id: _id, model: 'channel'}).then((data)=> {
                    if (data.success) {
                        $scope.channel = data.data.channel;
                    } else {
                        myalert('2', '程序异常');
                    }
                });
            } else {
                $scope.modal_title = '新增频道';
                $scope.channel = {state: 1};
            }
            $("#channelModal").toggle();
        };

        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };


        //add or edit channel
        $scope.saveChannel = ()=> {
            if (!$scope.channel.name) {
                myalert('2', '频道名不能为空');
            } else {
                $http.post('/admin/channel', {object: $scope.channel}).success(data=> {
                    if (data.success) {
                        $("#channelModal").hide();
                        loadChannel();
                    } else {
                        myalert('2', '新增失败');
                    }
                });
            }
        };


        //show delchannel modal
        $scope.deleteChannel = (_id, title)=> {
            $scope.delete_title = '删除频道';
            $scope.delete_id = _id;
            $scope.delete_title = '[' + title + ']';
            $("#deleteModal").toggle();
        };


        //delete channel
        $scope.destroy = ()=> {
            blData.requestUrl('DELETE', 'deleteModel', {_id: $scope.delete_id, model: 'channel'}).then((data)=> {
                if (data.success) {
                    $("#deleteModal").hide();
                    loadChannel();
                } else {
                    $("#deleteModal").hide();
                    myalert(2, '删除失败');
                    myclose();
                }
            });
        };

        //upload channel logo for qiniu
        $scope.uploadChannelLogo = (_this)=> {
            var formData = new FormData();
            $.each($('#files')[0].files, function (i, file) {
                formData.append('files', file);
            });
            $.ajax({
                url: '/admin/uploadForQiniu',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.success) {
                        _this.channel.cover = data.data.qiniu_image;
                    } else {
                        myalert('2', data.message);
                    }
                },
                error: function () {
                    myalert('2', '与服务器通信发生错误');
                }
            });
        };


    }])
    .controller('PostCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        $scope.type = '';

        $scope.searchText = '';

        $scope.types = [
            {text: '---请选择---', value: ''},
            {text: '速记', value: 'suji'},
            {text: '实例', value: 'demo'},
            {text: '帖子', value: 'post'}
        ];

        let loadPost = ()=> {
            myload();
            blData.requestUrl('GET', 'post', {type: $scope.type, searchText: $scope.searchText}).then((data)=> {
                if (data.success) {
                    $scope.postList = data.data.postList;
                    myclose();
                } else {
                    myalert(2, data.message);
                    myclose();
                }
            });
        };

        //post list information
        loadPost();

        //show delete post modal
        $scope.postDelete = (_id, title)=> {
            $scope.modal_title = '删除帖子';
            $scope.delete_id = _id;
            $scope.delete_title = '[' + title + ']';
            $("#deleteModal").toggle();
        };


        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };

        //delete post
        $scope.destroy = ()=> {

            blData.requestUrl('DELETE', 'deleteModel', {_id: $scope.delete_id, model: 'post'}).then(()=> {
                blData.requestUrl('DELETE', 'deleteModel', {_id: $scope.delete_id, model: 'comment'}).then((data)=> {
                    if (data.success) {
                        $("#deleteModal").hide();
                        loadPost();
                    } else {
                        $("#deleteModal").hide();
                        myalert(2, '删除失败');
                        myclose();
                    }
                });
            });
        };

        $scope.changePostType = ()=> {
            loadPost();
        };

        $scope.searchPost = ()=> {
            if (GetStringByteLength($scope.searchText) > 2 || !$scope.searchText) {
                loadPost();
            }
        };


    }])
    .controller('PostAddCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {
        $scope.types = [
            {text: '---请选择---', value: ''},
            {text: '速记', value: 'suji'},
            {text: '实例', value: 'demo'},
            {text: '帖子', value: 'post'}
        ];
        $scope.post = {};
        $scope.post.type = '';
        $scope.post.channel = '';
        $scope.post.release_state = 1;
        $scope.post.is_top = 0;
        let defalut_channel = {_id: '', name: '---请选择---'};
        $scope.channels = [defalut_channel];
        //add post
        $scope.postAdd = ()=> {
            console.log($scope.post)
            $http.post('/admin/post', {object: $scope.post}).success((data)=> {
                if (data.success) {
                    $location.path("/admin/post");
                } else {
                    myalert(2, '新增失败');
                    myclose();
                }
            });


        };
        //change channel list
        $scope.changeType = ()=> {
            if ($scope.post.type == 'post') {
                blData.requestUrl('GET', 'channel').then((data)=> {
                    data.data.channels.unshift(defalut_channel);
                    $scope.channels = data.data.channels;
                })
            } else {
                $scope.channels = [defalut_channel];
            }
        };


        //upload file
        $scope.uploadPostCover = (_this)=> {
            var formData = new FormData();
            $.each($('#files')[0].files, function (i, file) {
                formData.append('files', file);
            });
            $.ajax({
                url: '/admin/uploadForQiniu',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.success) {
                        _this.post.cover = data.data.qiniu_image;
                    } else {
                        myalert('2', data.message);
                    }
                },
                error: function () {
                    myalert('2', '与服务器通信发生错误');
                }
            });
        }


    }])
    .controller('PostEditCtrl', ['$scope', '$location', '$http', '$stateParams', 'blData', ($scope, $location, $http, $stateParams, blData) => {
        $scope.types = [
            {text: '---请选择---', value: ''},
            {text: '速记', value: 'suji'},
            {text: '实例', value: 'demo'},
            {text: '帖子', value: 'post'}
        ];
        //init
        $scope.post = {};
        $scope.post.type = '';
        $scope.post.channel = '';
        $scope.post.release_state = 1;
        $scope.post.is_top = 0;
        let defalut_channel = {_id: '', name: '---请选择---'};
        $scope.channels = [defalut_channel];

        //change channel list
        $scope.changeType = ()=> {
            if ($scope.post.type == 'post') {
                $scope.post.channel = '';
                blData.requestUrl('GET', 'channel').then((data)=> {
                    data.data.channels.unshift(defalut_channel);
                    $scope.channels = data.data.channels;
                })
            } else {
                $scope.post.channel = '';
                $scope.channels = [defalut_channel];
            }
        };

        //find one post information
        let _id = $stateParams._id;
        blData.requestUrl('GET', 'findModel', {_id: _id, model: 'post'}).then((data)=> {
            $scope.post.type = data.data.post.type.type;
            $scope.post.title = data.data.post.title;
            $scope.post.content = data.data.post.content;
            $scope.post.is_top = data.data.post.is_top;
            $scope.post.release_state = data.data.post.release_state;
            $scope.post.channel = data.data.post.type.channel;
            $scope.post.cover = data.data.post.cover;
            $scope.post._id = data.data.post._id;
            //if type equals procedure, initiated the request query information channel
            if (data.data.post.type.type == 'post') {
                blData.requestUrl('GET', 'channel').then((data)=> {
                    data.data.channels.unshift(defalut_channel);
                    $scope.channels = data.data.channels;
                })
            } else {
                $scope.channels = [defalut_channel];
            }
        });

        //update post information
        $scope.postEdit = ()=> {
            let post = $scope.post;
            $http.put('/admin/post', {object: post}).success((data)=> {
                console.log(data)
                if (data.success) {
                    $location.path("/admin/post");
                } else {
                    myalert(2, '修改失败');
                    myclose();
                }
            });
        };


        //upload file
        $scope.uploadPostCover = (_this)=> {
            var formData = new FormData();
            $.each($('#files')[0].files, function (i, file) {
                formData.append('files', file);
            });
            $.ajax({
                url: '/admin/uploadForQiniu',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.success) {
                        _this.post.cover = data.data.qiniu_image;
                    } else {
                        myalert('2', data.message);
                    }
                },
                error: function () {
                    myalert('2', '与服务器通信发生错误');
                }
            });
        }

    }])
    .controller('LibraryCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        $scope.library = {};

        $scope.searchText = '';

        let loadLibrary = ()=> {
            myload();
            blData.requestUrl('GET', 'library', {searchText: $scope.searchText}).then((data)=> {
                if (data.success) {
                    $scope.libraryList = data.data.libraryList;
                    myclose();
                } else {
                    myalert(2, data.message);
                    myclose();
                }
            });
        };

        //get library list information
        loadLibrary();


        $scope.searchLibrary = ()=> {
            if (GetStringByteLength($scope.searchText) > 2 || !$scope.searchText) {
                loadLibrary();
            }
        };


        $scope.showLibraryModal = (_id)=> {
            if (_id) {
                $scope.modal_title = '编辑内库';
                blData.requestUrl('GET', 'findModel', {_id: _id, model: 'library'}).then((data)=> {
                    if (data.success) {
                        $scope.library = data.data.library;
                    } else {
                        myalert('2', '程序异常');
                    }
                });
            } else {
                $scope.modal_title = '新增内库';
                $scope.library = {is_top: 0};
            }
            $("#libraryModal").toggle();
        };

        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };


        //save library
        $scope.saveLibrary = ()=> {
            if (!$scope.library.title) {
                myalert('2', '标题不能为空');
            } else if (!$scope.library.url) {
                myalert('2', 'Url不能为空');
            } else {
                $http.post('/admin/library', {object: $scope.library}).success(data=> {
                    if (data.success) {
                        $("#libraryModal").hide();
                        loadLibrary();
                    } else {
                        myalert('2', '新增失败');
                    }
                });
            }
        };


        //show delete library modal
        $scope.deleteLibrary = (_id, title)=> {
            $scope.modal_title = '删除内库';
            $scope.delete_id = _id;
            $scope.delete_title = '[' + title + ']';
            $("#deleteModal").toggle();
        };


        $scope.destroy = ()=> {
            blData.requestUrl('DELETE', 'deleteModel', {_id: $scope.delete_id, model: 'library'}).then(data=> {
                if (data.success) {
                    $("#deleteModal").hide();
                    loadLibrary();
                } else {
                    $("#deleteModal").hide();
                    myalert(2, '删除失败');
                }
            });
        };

    }])
    .controller('FriendCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        $scope.friend = {};

        $scope.searchText = '';

        let loadFriend = ()=> {
            myload();
            blData.requestUrl('GET', 'friend', {searchText: $scope.searchText}).then(data=> {
                if (data.success) {
                    $scope.friendList = data.data.friendList;
                    myclose();
                } else {
                    myalert(2, '加载失败');
                    myclose();
                }
            });
        };

        loadFriend();

        $scope.searchFriend = ()=> {
            if (GetStringByteLength($scope.searchText) > 2 || !$scope.searchText) {
                loadFriend();
            }
        };

        $scope.showFriendModal = (_id)=> {
            if (_id) {
                $scope.modal_title = '编辑友情';
                blData.requestUrl('GET', 'findModel', {_id: _id, model: 'friend'}).then(data=> {
                    if (data.success) {
                        $scope.friend = data.data.friend;
                    } else {
                        myalert(2, '程序异常');
                    }
                });
                $("#friendModal").toggle();
            } else {
                $scope.modal_title = '新增友情';
                $scope.friend = {state: 1};
                $("#friendModal").toggle();
            }
        };

        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };


        $scope.saveFriend = ()=> {
            $http.post('/admin/friend', {object: $scope.friend}).success(data=> {
                if (data.success) {
                    $("#friendModal").hide();
                    loadFriend();
                } else {
                    myalert(2, data.message);
                }
            });
        };

        $scope.deleteFriend = (_id, name)=> {
            $scope.modal_title = '删除友情';
            $scope.delete_title = '[' + name + ']';
            $scope.delete_id = _id;
            $("#deleteModal").toggle();
        };

        $scope.destroy = ()=> {
            blData.requestUrl('DELETE', 'deleteModel', {_id: $scope.delete_id, model: 'friend'}).then(data=> {
                if (data.success) {
                    $("#deleteModal").hide();
                    loadFriend();
                } else {
                    $("#deleteModal").hide();
                    myalert(2, '删除失败');
                }
            });
        };
    }])
    .controller('CommentCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        $scope.searchText = '';

        let loadComment = ()=> {
            myload();
            blData.requestUrl('GET', 'comment', {searchText: $scope.searchText}).then(data=> {
                if (data.success) {
                    $scope.commentList = data.data.commentList;
                    myclose();
                } else {
                    myclose();
                    myalert(2, '系统异常')
                }
            });
        };

        loadComment();


        $scope.searchComment = ()=> {
            if (GetStringByteLength($scope.searchText) > 2 || !$scope.searchText) {
                loadComment();
            }
        };

        $scope.postCommentDelete = (_id, title)=> {
            $scope.modal_title = '删除评论';
            $scope.delete_title = '[' + title + ']';
            $scope.delete_id = _id;
            $("#deleteModal").toggle();
        };

        $scope.destroy = ()=> {

            $http.put('/admin/comment', {_id: $scope.delete_id, action: 'delete'}).then(data=> {
                if (data.data.success) {
                    $("#deleteModal").hide();
                    loadComment();
                } else {
                    $("#deleteModal").hide();
                    myalert(2, '系统异常');
                }
            });
        };


        $scope.recover = (_id)=> {
            $http.put('/admin/comment', {_id: _id, action: 'recover'}).then(data=> {
                if (data.data.success) {
                    loadComment();
                } else {
                    myalert(2, '系统异常');
                }
            });
        };


        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };


        $scope.Text = 'All';
        $scope.is_selected = false;
        $scope.select_all = false;
        $scope.selectAll = ()=> {
            $scope.select_all = !$scope.select_all;
            $scope.is_selected = !$scope.is_selected;
            if ($scope.select_all) {
                $scope.Text = 'unAll';
            } else {
                $scope.Text = 'All';
            }
        }


        $scope.batchDel = () => {
            let ckl = $("input[type='checkbox']:checked").length;
            let cks = [];
            $("input[type='checkbox']").each(function () {
                if ($(this).attr('checked')) {
                    cks.push($(this).val());
                }
            });
            if (!ckl || ckl.length < 1) {
                return myalert(2, '请至少选中一条');
            }
            if (confirm('你确认要删除这' + ckl + '条数据吗?')) {
                blData.requestUrl('DELETE', 'batchDeleteModel', {ids: cks, model: 'comment'}).then(data=> {
                    loadComment();
                });
            }
            ;
        };


    }])
    .controller('LeaveCtrl', ['$scope', '$location', '$http', 'blData', ($scope, $location, $http, blData) => {

        let loadLeave = ()=> {
            myload();
            blData.requestUrl('GET', 'leave').then(data=> {
                if (data.success) {
                    $scope.leaveList = data.data.leaveList;
                    myclose();
                } else {
                    myclose();
                    myalert(2, '系统异常');
                }
            });
        };

        loadLeave();


        $scope.leaveDelete = (_id, title)=> {
            $scope.modal_title = '删除留言';
            $scope.delete_title = title;
            $scope.delete_id = _id;
            $("#deleteModal").toggle();
        };

        $scope.showModal = (modal)=> {
            $("#" + modal).toggle();
        };

        $scope.destroy = ()=> {
            $http.put('/admin/leave', {_id: $scope.delete_id, action: 'delete'}).then(data=> {
                if (data.data.success) {
                    $("#deleteModal").hide();
                    loadLeave();
                } else {
                    $("#deleteModal").hide();
                    myalert(2, '系统异常');
                }
            });
        };


        $scope.recover = (_id)=> {
            $http.put('/admin/leave', {_id: _id, action: 'recover'}).then(data=> {
                if (data.data.success) {
                    loadLeave();
                } else {
                    myalert(2, '系统异常');
                }
            });
        };

        $scope.Text = 'All';
        $scope.is_selected = false;
        $scope.select_all = false;
        $scope.selectAll = ()=> {
            $scope.select_all = !$scope.select_all;
            $scope.is_selected = !$scope.is_selected;
            if ($scope.select_all) {
                $scope.Text = 'unAll';
            } else {
                $scope.Text = 'All';
            }
        }


        $scope.batchDel = () => {
            let ckl = $("input[type='checkbox']:checked").length;
            let cks = [];
            $("input[type='checkbox']").each(function () {
                if ($(this).attr('checked')) {
                    cks.push($(this).val());
                }
            });
            if (!ckl || ckl.length < 1) {
                return myalert(2, '请至少选中一条');
            }
            if (confirm('你确认要删除这' + ckl + '条数据吗?')) {
                blData.requestUrl('DELETE', 'batchDeleteModel', {ids: cks, model: 'leave'}).then(data=> {
                    loadLeave();
                });
            }
            ;
        };


    }]);




