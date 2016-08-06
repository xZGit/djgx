/**
 * Created by shandianhaizan on 16/6/13.
 */


'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var docLib  = require('../lib/doc');
var Doc =  docLib.doc;
// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');


router.get('/', function(req, res, next) {

   res.render('login',{error:""});
});


router.post('/', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;
    AV.User.logIn(username, password).then(function (loginedUser) {
        res.redirect("/backend");
    }, (function (error) {
        var err = {
            211:"用户未找到",
            210:"密码错误"
        };
        res.render('login',{error: err[error.code]});
    }));
});



router.get("/auth", function(req, res, next) {
     var currentUser = AV.User.current();
     res.json({code:0, user: currentUser});
});



router.post("/changePwd", function(req, res, next) {
    var currentUser = AV.User.current();
    var newPwd = req.body.new;
    if(!newPwd) return res.json({code:1,msg:"密码为空"});
    console.log(currentUser);
    if(!currentUser || !currentUser.attributes || !currentUser.attributes.username) {
        return  res.json({code:2,msg:"用户未登陆"});
    }
    AV.User.logIn(currentUser.attributes.username, req.body.old).then(function (loginedUser) {
        var doc  = new Doc("_User", {id:currentUser.id,password: newPwd});
        doc.save().then(function (result) {
            res.send({code: 0, data: result});
        }).catch(next);
    }, (function (error) {
        var err = {
            211:"用户未找到",
            210:"密码错误"
        };
        res.json({code:error.code, msg: err[error.code]});
    }));

});







router.get("/logout", function(req, res, next) {
    AV.User.logOut();
    res.redirect("/login");
});









module.exports = router;
