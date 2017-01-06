require.config({
    paths: {
        jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
    }
});
require(["jquery"], function ($) {
    $(function () {
        window.onscroll = function () {
            var scrollTop = document.body.scrollTop;
            if (scrollTop >= 200) {
                $(".gotop").css('display', 'block');
            } else {
                $(".gotop").css('display', 'none');
            }
        };

        $("#container").on('click', function () {
            $("#right-menu").animate({"right": "-300px"}, 350);
            $("#add").attr('is-show', 'hide');
        });
        $("#left-menu-item>div").on('click', function () {
            $("#left-menu-item div").css('color', '#999');
            $("#left-menu-item div").css('background-color', '');
            $(this).css('background-color', '#2ECC71');
            $(this).css('color', '#fff');
        });


    });
});

function goTop(){
    $("html,body").animate({scrollTop: 0}, 500);
}


