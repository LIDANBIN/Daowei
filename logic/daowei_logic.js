var path = require('path');
var db = require('../dao/login_dao.js');

var data = require('../data/China_area.json');
var provinces = data.provinceJson;
var cities = data.cityJson;
var counties = data.countyJson;

var web_data = require('../data/web_info.json');
var top_category = web_data.top_category;
var sub_category = web_data.sub_category;
var services = web_data.services;
var sellers = web_data.sellers;

// 首页-------------------------------------
function post_index(req, res) {
    res.redirect('/');
}
function get_index(req, res) {
    res.sendfile(path.resolve(__dirname, '../public/html/login.html'));
}
function init_index(req, res) {
    var service_arr = [];
    top_category.forEach(function (top_item) {
        var top_name = top_item.top_name;
        var sub_arr = sub_category.filter(function (sub_item) {
            return top_item.top_id === sub_item.top_id;
        });
        var service_list = services.filter(function (service_item) {
            return top_item.top_id === service_item.top_id;
        });
        service_list = service_list.slice(0, 5);
        var service = {
            top_name: top_name,
            sub_arr: sub_arr,
            service_list: service_list
        };
        service_arr.push(service);
    });
    var data = {
        service_arr: service_arr
    };
    res.send(data);
}
// 更多商品页面
function init_more(req, res) {
    res.sendFile(path.resolve(__dirname, '../public/html/more.html'));
}
// 更多商品数据
function get_more(req, res) {
    var sub_id = req.params.id;
    // 获取页码
    var index = req.query.index;
    // 获取排序方式
    var sort = req.query.sort;
    console.log(sort);
    // sort=recommend
    // sort=sales
    // sort=praise
    // sort=time shortest_time
    // sort=price
    var start = index * 5;
    var end = (1 * index + 1) * 5;
    var sub = {};
    sub_category.forEach(function (item) {
        if (item.sub_id == sub_id) {
            sub = item;
        }
    });
    var top_id = sub.top_id;
    var top = {};
    top_category.forEach(function (item) {
        if (item.top_id == top_id) {
            top = item;
        }
    });
    var sub_arr = sub_category.filter(function (item) {
        return item.top_id == top_id;
    });
    // sort=recommend
    var service_list = services.filter(function (item) {
        return item.sub_id == sub_id;
    });
    switch (sort) {
        case 'recommend':
            service_list = service_list.slice(start, end);
            break;
        case 'sales':
            service_list = service_list.sort(function (a, b) {
                return b.sell_count - a.sell_count;
            }).slice(start, end);
            break;
        case 'praise':
            service_list = service_list.sort(function (a, b) {
                return b.good_rate - a.good_rate;
            }).slice(start, end);
            break;
        case 'time':
            service_list = service_list.sort(function (a, b) {
                return a.fast - b.fast;
            }).slice(start, end);
            break;
        case 'price':
            service_list = service_list.sort(function (a, b) {
                return a.price - b.price;
            }).slice(start, end);
            break;
    }

    var seller_id_arr = service_list.map(function (item) {
        return item.seller_id;
    });
    seller_id_arr = new Set(seller_id_arr);
    var seller_arr = [];
    seller_id_arr.forEach(function (item) {
        var seller_list = sellers.filter(function (seller_item) {
            return item == seller_item.seller_id;
        });
        seller_arr = seller_arr.concat(seller_list);
    });
    var data = {
        sub_id: sub_id,
        top: top,
        service_list: service_list,
        sub_arr: sub_arr,
        seller_arr: seller_arr
    };
    res.send(data);
}
// 获取页面数量
function get_more_length(req, res) {
    var sub_id = req.params.id;
    var service_list = services.filter(function (item) {
        return item.sub_id == sub_id;
    });
    var length = service_list.length;
    var page = Math.ceil(length / 5);
    var page_arr = [];
    for (var i = 0; i < page; i++) {
        var page_item = {};
        page_item.index = i;
        page_arr.push(page_item);
    }
    var data = {
        page: page,
        page_arr: page_arr
    };
    res.send(data);
}
// 商品详情
function init_detail(req, res) {
    res.sendFile(path.resolve(__dirname, '../public/html/detail.html'));
}
function get_detail(req, res) {
    var service_id = req.params.id;
    var service = services.filter(function (item) {
        return item.service_id = service_id;
    });
    var seller_id = service[0].seller_id;
    var seller;
    sellers.forEach(function (item) {
        if (seller_id == item.seller_id) {
            seller = item;
        }
    });
    var sub_name;
    var top_id;
    sub_category.forEach(function (item) {
        if (item.sub_id == service[0].sub_id) {
            sub_name = item.sub_name;
            top_id = item.top_id;
        }
    });
    var top_name;
    top_category.forEach(function (item) {
        if (item.top_id == top_id) {
            top_name = item.top_name;
        }
    });
    var data = {
        seller: seller,
        sub_name: sub_name,
        top_name: top_name,
        service: service[0]
    };
    res.send(data);
}
// 省
function load_provinces(req, res, next) {
    res.send(provinces);
}
// 市
function load_cities(req, res, next) {
    var citiesData = [];
    var id = req.query.provinceID;
    cities.forEach(function (ele, index) {
        if (ele.parent === id || ele.id === id) {
            citiesData.push(ele);
        }
    });
    res.send(citiesData);
}
// 县
function load_counties(req, res, next) {
    var countiesData = [];
    var id = req.query.cityID;
    counties.forEach(function (ele, index) {
        if (ele.parent === id) {
            countiesData.push(ele);
        }
    });
    res.send(countiesData);
}

//post登录
function setPostLogin(req, res, next) {
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    var result;
    db.findUser(userName, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (doc) {
                //result = 1;
                if (err) {
                    console.log(err);
                    res.send({code: 2});
                    // res.render('404.ejs', {});
                } else {
                    //console.log(doc);
                    if (doc.passWord == passWord) {
                        //种一个cookie
                        /*res.cookie('THE_LAST_NAME', userName, {expires: new Date(Date.now() + 60 * 1000)});
                         req.session.userName = userName;
                         req.session.userID = doc._id;
                         req.session.loginState = 'logged-in';*/
                        // res.redirect('/');
                        res.send({code: 3});
                        //res.render('item_list.ejs', {userName: userName});
                    } else {
                        res.send({code: 1});
                        // res.redirect('/login');
                    }
                }
            } else {
                res.send({code: 0});
                // result = '<font color="red">用户名未注册</font>';
                // res.send(result);
                // res.redirect('/register');
            }
        }
    });
}

//get登录
function setGetLogin(req, res) {
    /*   var loginState = req.session.loginState;
     if (loginState == 'logged-in') {
     res.redirect('/');
     } else {
     //res.send('您未曾登录过。（显示登录页面）');*/
    res.sendfile(path.resolve(__dirname, '../public/html/login.html'));
    // }
}
//post注册
function setPostRegister(req, res, next) {
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    // var passWordConfirm = req.body.passwordConfirm;
    var email = req.body.email;
    db.findUser(userName, function (err, doc) {
        if (err) {
            console.log(err);
            res.send({code: 2});
        } else {
            if (doc) {
                //res.send('该用户名已被注册，请重新输入。（显示注册页面）')
                // result = '<font color="red">该用户名已被注册，请重新输入。</font>';
                res.send({code:0});
                // res.redirect('/register');
            } else {
                // if (passWord == passWordConfirm) {
                    var userInfo = {
                        userName: userName,
                        passWord: passWord,
                        email: email
                    };
                    db.addUser(userInfo, function (err) {
                        if (err) {
                            console.log(err);
                            res.send({code: 2});
                            // res.render('404.ejs', {});
                        } else {
                            res.send({code:3});
                            // res.redirect('/login');
                        }
                    });
                // } else {
                    //res.send('两次输入的密码不一致，请重新输入。（显示注册页面）');
                    // result = '<font color="red">两次输入的密码不一致，请重新输入。</font>';
                    // res.send(result);
                    // res.redirect('/register');
                // }
            }
        }
    })
}

//get注册
function setGetRegister(req, res, next) {
    /*var userName = req.session.userName;
     var loginState = req.session.loginState;
     if (loginState == 'logged-in') {
     // res.send(userName + '，欢迎回来！（显示主页）');
     res.redirect('/');
     } else {*/
    //res.send('您未曾登录过。（显示注册页面）');
    res.sendfile(path.resolve(__dirname, '../public/html/register.html'));
    // }
}


exports.init_index = init_index;
exports.post_index = post_index;
exports.get_index = get_index;
exports.init_more = init_more;
exports.get_more = get_more;
exports.get_more_length = get_more_length;
exports.init_detail = init_detail;
exports.get_detail = get_detail;
exports.load_provinces = load_provinces;
exports.load_cities = load_cities;
exports.load_counties = load_counties;
exports.setPostLogin = setPostLogin;
exports.setGetLogin = setGetLogin;
exports.setPostRegister = setPostRegister;
exports.setGetRegister = setGetRegister;
