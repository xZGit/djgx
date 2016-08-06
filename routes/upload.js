/**
 * Created by shandianhaizan on 16/6/16.
 */


'use strict';
var router = require('express').Router();
var qn = require('qn');
var path = require('path');
var fs = require("fs");



//7牛 client
var qnClient = null;
//TODO  add key to config
qnClient = qn.create({
    accessKey: '8TSldA04HJjHHHBnMTTJxFhGRPTyvAlXnXA3rBun',
    secretKey: 'WXqCbG-jNok1arDVC_m1blwtIxah_WVavLusYCZ_',
    bucket: 'zxblog',
    domain: 'http://7xo1cv.com1.z0.glb.clouddn.com'
});


router.post('/', function (req, res, next) {
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        qnClient.upload(file, {filename: filename}, function (err, result) {
            if (err) {
                return next(err);
            }
            var url = result.url;

            if (req.query && req.query.CKEditorFuncNum) {
                var script = '<script type="text/javascript">'
                    + 'window.parent.CKEDITOR.tools.callFunction("' + req.query.CKEditorFuncNum + '","' + url + '", "");'
                    + '</script>';
                return res.send(script);
            }

            res.json({
                code: 0,
                url: url
            });
        });
    });

    req.pipe(req.busboy);

});


router.post('/importExcel', function (req, res, next) {
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var newFilename = "import" + path.extname(filename);
        var filePath = path.join(__dirname, newFilename);
        file.on('end', function () {
            res.json({
                code: 0,
                url: filePath
            });

        });
        file.pipe(fs.createWriteStream(filePath));
    });
    req.pipe(req.busboy);
});




module.exports = router;