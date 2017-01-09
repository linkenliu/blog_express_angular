'use strict';
require.config({
    paths: {
        jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
    }
});
require(["jquery"], function ($) {
    $(function () {
        $("#loginform").on('submit', function () {
            var username = $("#username").val();
            var password = $("#password").val();
            if (!username || !password) {
                $("#message").text('请检查用户名或密码是否填写!');
                return false;
            }
            $.post('/admin/login', {username: username, password: password}, function(data) {
                if (data.success) {
                    localStorage.setItem("username", data.data.editor.username);
                    $("#message").text(data.message);
                    window.location.href = '/admin/index';
                } else {
                    $("#message").text(data.message);
                }
            });
        });
    });
});


