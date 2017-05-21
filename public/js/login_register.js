$(function () {
    // 登录
    $('#postInfo').click(function () {
        // 向服务器提交数据
        var username = $('#userName').val();
        var password = $('#password').val();
        $.post('/login', {userName: username, passWord: password}, function (data) {
            $('#usename').addClass('hide');
            $('#usename_password').addClass('hide');
            if (data.code == 0) {
                // 用户未注册
                $('#usename').removeClass('hide');
            } else if (data.code == 1) {
                // 用户名与密码不匹配
                $('#usename_password').removeClass('hide');
            } else if (data.code == 2) {
                // 网络错误
                alert('网络出错啦_(:з」∠)_');
            } else if (data.code == 3) {
                // 登录成功
                alert('登录成功！');
                location.href = 'http://localhost:3000/';
            }
        }, 'json');
    });


    // 注册
    var pic;
    var phone;
    var verifyCode = new GVerify(document.getElementById('v_container'));
    document.getElementById("code_input").onblur = function () {
        var res = verifyCode.validate(document.getElementById("code_input").value);
        if (res) {
//                    alert("验证正确");
            $('#true').removeClass('hide');
            $('#false').addClass('hide');
            pic = true;
        } else {
//                    alert("验证码错误");
            $('#false').removeClass('hide').next().addClass('hide');
            pic = false;
        }
    };
    $('#r_userName').blur(function () {
        var sMobile = $(this).val();
        $('#phone').addClass('hide');
        phone = true;
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
            // alert("不是完整的11位手机号或者正确的手机号前七位");
            $('#phone').removeClass('hide');
            phone = false;
        }
    });
    // 提交数据
    $('#my_button').click(function () {
        if (phone && pic) { // 当手机号码和验证图片都正确时
            var username = $('#r_userName').val();
            var password = $('#r_password').val();
            $.post('/register', {userName: username, passWord: password}, function (data) {
                $('#user').addClass('hide');
                if (data.code == 2) {
                    // 网络错误
                    alert('网络出错啦_(:з」∠)_');
                } else if (data.code == 0) {
                    // 用户名已被注册
                    $('#user').removeClass('hide');
                } else if (data.code == 3) {
                    // 注册成功 显示登录页面
                    alert('注册成功！');
                    location.href = 'http://localhost:3000/login';
                }
            }, 'json');
        }
    })
});
