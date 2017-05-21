;$(function () {
    // 初始化更多页数据
    renderingMore();
    function renderingMore() {
        // 默认获取前五条数据 默认按照推荐排序
        var url = '/ajax' + window.location.pathname + '?index=0&sort=recommend';
        $.getJSON(url, function (data) {
            $('#class_nav').html(template('class_nav_container', data));
            $('#title').html(template('title_container', data));
            $('#item_list').html(template('item_list_container', data));
            $('#sellers').html(template('sellers_container', data));
        })
    }

    // 点击切换二级分类 切换高亮样式
    toggleSub();
    function toggleSub() {
        var $class_nav = $('#class_nav');
        $class_nav.delegate('span', 'click', function () {
            $('#page').html(1);
            $(this).addClass('red').siblings().removeClass('red');
            var sort = $('span>i').filter('.active').attr('id');
            var sub_id = $('#class_nav>span').filter('.red').attr('data-id');
            // 更新总页数
            getLen(sub_id);
            // togglePage_style(0, sub_id);
            var $allA = $('#pages-list').find('a');
            changeA(0, $allA, sub_id);
            var url = '/ajax/more/' + $(this).attr('data-id') + `?index=0&sort=${sort}`;
            $.getJSON(url, function (data) {
                $('#item_list').html(template('item_list_container', data));
            })
        })
    }
    // 获取页数
    function getLen(sub_id) {
        var url = '/ajax/length/more/' + sub_id;
        $.getJSON(url, function (data) {
            data.index = 0;
            page = data.page;
            $('#pages').html(page);
            $('#pages-list').html(template('pages_list_container', data));
        });
    }
    // 切页
    var page;
    togglePage();
    function togglePage() {
        // 获取总页数
        var url = '/ajax/length' + window.location.pathname;
        $.getJSON(url, function (data) {
            data.index = 0;
            page = data.page;
            $('#pages').html(page);
            $('#pages-list').html(template('pages_list_container', data));
            console.log(data);
        });

        // 点击数字切换服务列表页码
        $('#pages-list').delegate('a', 'click', function () {
            // 获取当前排序
            var sort = $('span>i').filter('.active').attr('id');
            var $allA = $('#pages-list').find('a');
            var index = $(this).attr('data-index');
            var sub_id = $('#class_nav>span').filter('.red').attr('data-id');
            $('#page').html(1*index + 1);
            changeA(index, $allA, sub_id);
            page_ajax(index, sort, sub_id);
        });
        // 点击上一页切换服务列表页码
        var prev;
        $('.toggle-page a.prev').click(prev = function () {
            var sort = $('span>i').filter('.active').attr('id');
            var $allA = $('#pages-list').find('a');
            var index = $allA.filter('.active').attr('data-index');
            var sub_id = $('#class_nav>span').filter('.red').attr('data-id');
            // 当前页
            index--;
            $('#page').html(index + 1);
            changeA(index, $allA, sub_id);
            page_ajax(index, sort, sub_id);
        });
        $('.pages>i.prev').click(prev);
        // 点击下一页切换服务列表页码
        var next;
        $('.toggle-page a.next').click(next = function () {
            var sort = $('span>i').filter('.active').attr('id');
            var $allA = $('#pages-list').find('a');
            var index = $allA.filter('.active').attr('data-index');
            var sub_id = $('#class_nav>span').filter('.red').attr('data-id');
            // 当前页
            // console.log(index);
            index++;
            // console.log(index);
            $('#page').html(index + 1);
            changeA(index, $allA, sub_id);
            page_ajax(index, sort, sub_id);
        });
        $('.pages>i.next').click(next);
        // 点击切换排序方式
        $('.menus').delegate('i', 'click', function () {
            $(this).addClass('active').siblings().removeClass('active');
            var sort = $(this).attr('id');
            var $allA = $('#pages-list').find('a');
            var index = $allA.filter('.active').attr('data-index');
            var sub_id = $('#class_nav>span').filter('.red').attr('data-id');
            getLen(sub_id);
            page_ajax(index, sort, sub_id);
        });
        // 发送切换页面ajax
        function page_ajax(index, sort, sub_id) {
            var url = '/ajax/more/' + sub_id + `?index=${index}&sort=${sort}`;
            $.getJSON(url, function (data) {
                // togglePage_style(index, sub_id);
                $('#item_list').html(template('item_list_container', data));
            })
        }
    }
    // 改变a样式
    function changeA(index, $allA, sub_id) {
        if (index == 0) {
            $('a.prev').addClass('gray');
            $('i.prev').addClass('gray');
        } else {
            $('a.prev').removeClass('gray');
            $('i.prev').removeClass('gray');
        }
        if (index == page - 1) {
            $('a.next').addClass('gray');
            $('i.next').addClass('gray');
        } else {
            $('a.next').removeClass('gray');
            $('i.next').removeClass('gray');
        }
        $allA.removeClass('active');
        // console.log('changeA', index, $allA);
        togglePage_style(index, sub_id);
        // console.log($allA.filter('[data-index=' + index + ']'));
        $allA.filter('[data-index=' + index + 1 + ']').addClass('active');
        // $allA.eq(index).addClass('active');
    }
    // 重置page_list
    function togglePage_style(index, sub_id) {
        var url2 = '/ajax/length/more/' + sub_id;
        $.getJSON(url2, function (data) {
            data.index = index;
            if (index < 7) {
                $('#pages-list').html(template('pages_list_container', data));
            } else {
                $('#pages-list').html(template('pages_list2_container', data));
            }
        });
    }
});
