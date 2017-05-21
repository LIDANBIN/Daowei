//引入
var mongoose = require('mongoose');
//建立连接
mongoose.connect('mongodb://127.0.0.1:27017/emp');
//获取连接对象
var connect = mongoose.connection;
//监听连接
connect.on('open', function () {
    console.log('yes!')
});
connect.on('error', function (err) {
    console.log(err);
});

//建立用户信息对象
var logicSchema = new mongoose.Schema({
    userName: String,
    passWord: Number,
    registerDate: {type: Date, default: Date.now()},
    email: String
});
//建立用于信息模型
var logicModel = mongoose.model('logic', logicSchema);


//查找用户
function findUser(userName, callback) {
    logicModel.findOne({userName: userName}, function (err, doc) {
        if (err) {
            callback(err);
        } else {
            callback(null, doc);
        }
    })
}

//添加用户
function addUser(userInfo, callback) {
    logicModel.create(userInfo, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    })
}

exports.findUser = findUser;
exports.addUser = addUser;