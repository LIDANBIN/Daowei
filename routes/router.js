var express = require('express');
var fs = require('fs');
var router = express.Router();

var logic = require('./daowei_logic.js');

// 请求首页数据
router.post('/', logic.post_index);
router.get('/ajax_index', logic.init_index);

// 更多商品页
// 初始化页面
router.get('/more/:id', logic.init_more);
// 根据id index sort 获取对应的sub数据
router.get('/ajax/more/:id', logic.get_more);
// 根据id 获取对应的所有sub数据长度
router.get('/ajax/length/more/:id', logic.get_more_length);

// 商品详情页
router.get('/detail/:id', logic.init_detail);
router.get('/ajax/detail/:id', logic.get_detail);

//三级联动
//返回省
router.get('/provinces', logic.load_provinces);

//返回市
router.get('/cities', logic.load_cities);

//返回区、县
router.get('/counties', logic.load_counties);

// 登录
//post登录
router.post('/login', logic.setPostLogin);
//回车登录
router.get('/login', logic.setGetLogin);
// 注册
//post注册
router.post('/register', logic.setPostRegister);
//get注册
router.get('/register', logic.setGetRegister);

module.exports = router;
