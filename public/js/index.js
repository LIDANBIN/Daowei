;$(function () {
    // 左侧边栏 hover显示二级菜单效果
    hoverleftMenu();
    function hoverleftMenu() {
        $('.nav-container>ul').delegate('li', 'mouseenter', function () {
            var top = $('.nav-container>ul>li').index(this) * $(this).height();
            $(this).find('ul').addClass('visible').css('top', -top);
        });
        $('.nav-container>ul').delegate('li', 'mouseleave', function () {
            var top = $('.nav-container>ul>li').index(this) * $(this).height();
            $(this).find('ul').removeClass('visible');
        });
    }

    // 轮播图
    autoBanner();
    function autoBanner() {
        var i = 0;
        var timer;
        $('.pic-list').hover(function () {
            clearInterval(timer);
        }, function () {
         timer = setInterval(function () {
                if (i > 2) i = 0;
                $('.pic-list>li').eq(i).removeClass('hide').siblings().addClass('hide');
                i++
            });
        }).trigger('mouseleave');

    }






    // ajax请求首页数据
    renderingIndex();
    function renderingIndex() {
        $.getJSON('/ajax_index', function (data) {
            $('#nav').html(template('nav_container', data));
            $('#service_list').html(template('service_list_container', data));
        });
    }
});