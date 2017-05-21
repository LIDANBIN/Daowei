/**
 * Created by lidanbin on 2017/4/27.
 */
$(function () {
    // 头部导航切换效果
    // 1、刷新页面时若top值小于0 动画出现 给header添加类fixed-animated、navbar-fixed-top
    // 2、页面滚动过程top值小于0时 动画出现 给header添加类fixed-animated、navbar-fixed-top
    // 刷新页面时
    fixHeader();
    function fixHeader() {
        var $banner = $('.banner-wrapper');
        // console.log($banner.offset().top - $(window).scrollTop());
        $(window).scroll(function () {
            if ($banner.offset().top - $(window).scrollTop() < 0) {
                $(".header-wrapper").addClass('fixed-animated navbar-fixed-top');
            } else {
                $(".header-wrapper").removeClass('fixed-animated navbar-fixed-top');
            }
        })
    }

    // 三级联动效果
    // 1、首先使用Geolocation API获取当前实时位置信息 同时根据当前位置发送ajax请求填充城市列表
    // 2、当前位置#current-position 的文本为#province + #city + #county
    // 3、悬浮显示下方所有城市列表 默认显示第三级
    // 4、点击tab>li切换tab-con>ul
    // 5、点击tab-con>li 发送ajax请求 本层隐藏，对应的tab>li文本更改 下层显示，对应的tab>li文本为请选择 下下一层ul隐藏
    togglePosition();
    function togglePosition() {
        //页面初次加载数据
        $('#provinces').html('');
        $('#cities').html('');
        $('#counties').html('');
        // 省
        var province_text = $('#province').text().slice(0, 3);
        // 市
        var city_text = $('#city').text().slice(0, 4);
        // 县
        var county_text = $('#county').text();
        // 当前地址
        var position_text = province_text + city_text + county_text;
        $('#current-position').text(position_text);
        $.getJSON('/provinces', function (data) {
            data.forEach(function (ele) {
                var id = ele.id;
                var name = ele.province;
                var province = "<li data-name=" + id + "><a href='#none'>" + name + "</a></li>";
                $(province).appendTo($('#provinces'));
            });
        });
        $.getJSON('/cities', {provinceID: 2}, function (data) {
            //城市列表  数组
            data.forEach(function (ele) {
                var id = ele.id;
                var name = ele.city;
                var city = "<li data-name=" + id + "><a href='#none'>" + name + "</a></li>";
                $(city).appendTo($('#cities'));
            });
        });
        $.getJSON('/counties', {cityID: 2}, function (data) {
            //区县列表  数组
            data.forEach(function (ele) {
                var id = ele.id;
                var name = ele.county;
                var county = "<li data-name=" + id + "><a href='#none'>" + name + "</a></li>";
                $(county).appendTo($('#counties'));
            });
        });

        // 鼠标悬浮切换
        $('#position>a').click(function () {
            var $content = $('.content');
            if ($content.hasClass('hide')) {
                $content.removeClass('hide');
            } else {
                $content.addClass('hide');
            }
        });
        // 点击tab>li切换tab-con>ul
        $('.tab>li').click(function () {
            $(this).addClass('current').siblings().removeClass('current');
            var index = $('.tab>li').index(this);
            $('.tab-con>ul').eq(index).removeClass('hide').siblings().addClass('hide');
        });
        // 点击发送ajax请求
        // 点击tab-con>li 本层隐藏，对应的tab>li文本更改 下层显示，对应的tab>li文本为请选择 下下一层ul隐藏
        $('.tab-con>ul').delegate('li','click', function () {
            // 获取当前li的索引
            var index = $('.tab-con>ul').index($(this).parent());
            // 获取当前li的文本
            var text = $(this).text();
            // 获取当前tab-con
            var $tab_con = $('.tab-con>ul');
            // 获取当前tab-con对应的tab的文本
            var $tab = $('.tab>li');
            $tab.eq(index).text(text);
            // 省
            province_text = $('#province').text().slice(0, 3);
            // 市
            city_text = $('#city').text().slice(0, 4);
            // 县
            county_text = $('#county').text();
            // 当前地址
            var position_text = province_text + city_text + county_text;
            // 当前为省tab 根据province_text请求cities
            if (index === 0) {
                $('#cities').html('');
                //获得 provinceID
                var provinceID = $(this).attr('data-name');
                if ('' === provinceID) {
                    return;
                }
                //请求数据
                $.getJSON('/cities', {provinceID: provinceID}, function (data) {
                    //城市列表  数组
                    data.forEach(function (ele) {
                        var id = ele.id;
                        var name = ele.city;
                        var city = "<li data-name=" + id + "><a href='#none'>" + name + "</a></li>";
                        $(city).appendTo($('#cities'));
                        $('#current-position').text(province_text);
                    });
                });
            }
            if (index === 1) {
                $('#counties').html('');
                // 城市的id
                var cityID = $(this).attr('data-name');
                if ('' === cityID) {
                    return;
                }
                $.getJSON('/counties', {cityID: cityID}, function (data) {
                    //区县列表  数组
                    data.forEach(function (ele) {
                        var id = ele.id;
                        var name = ele.county;
                        var county = "<li data-name=" + id + "><a href='#none'>" + name + "</a></li>";
                        $(county).appendTo($('#counties'));
                        $('#current-position').text(province_text + city_text);
                    });
                })
            }
            if (index === 2) {
                $('.content').addClass('hide');
                $('#current-position').text(position_text);
                return;
            }
            // 更改tab-con
            $tab_con.eq(index).addClass('hide').next().removeClass('hide');
            // 更改tab
            $tab.eq(index).next().addClass('current').text('请选择').siblings().removeClass('current');
        })
    }
});

