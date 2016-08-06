/**
 * Created by shandianhaizan on 16/6/15.
 */


'use strict';
var router = require('express').Router();
var models = require('../model/index');
var Query = require('../lib/query');
var docLib  = require('../lib/doc');
var Doc =  docLib.doc;
var BatchSave = docLib.batchSave;
var _  = require('lodash');
var xls = require('./excel');



var getAll = function (req, res, next) {
    try{
        var query = new Query(req.params.model, req.query);
        query.getAll().then(function (arg_result) {
            res.send({code: 0, data: arg_result});
        }).catch(next);
    }catch(err){
        next(err)
    }

};


var addNew = function (req, res, next) {
    try{
        var doc  = new Doc(req.params.model, req.body);
        doc.save().then(function (result) {
            res.send({code: 0, data: result});
        }).catch(next)
    }catch(err){
        next(err)
    }

};


var getOne = function (req, res, next) {
    var query = new Query(req.params.model);
    query.getOneById(req.params.id).then(function (arg_result) {
        res.send({code: 0, data: arg_result});
    }).catch(next);
};





var deleted = function (req, res, next) {
    try{
        var doc  = new Doc(req.params.model, {id:req.params.id, deleted: true});
        doc.save().then(function (result) {
            res.send({code: 0, data: result});
        }).catch(next)
    }catch(err){
        next(err)
    }
};



var exportExcel = function(req, res, next){
     var name = req.body.name;
     var data = req.body.data;
     xls.exportExcel(data,name,function(err, filePath){
         if(err) return next(err);
         res.send({code: 0, url:filePath});
     })
};


var storeProduction = function(req, res, next){
    var body = req.body;
    var objectId = body.productionId;
    var storeNum = body.storeNum;
    var type = body.type;
    var query = new Query("Production");
    query.getOneById(objectId).then(function (arg_result) {
        if(type == "des") storeNum = -storeNum;
        arg_result.increment('num', storeNum);
        var doc  = new Doc("ProductionRecord",body);
        return arg_result.save().then(function(){
            return doc.save().then(function (result) {
                res.send({code: 0, data: result});
            })
        });

    }).catch(next);
};






router.get('/:model', getAll);

router.get('/:model/:id', getOne);

router.post('/:model', addNew);

router.post('/delete/:model/:id', deleted);


router.post('/production/store', storeProduction);



module.exports = router;


