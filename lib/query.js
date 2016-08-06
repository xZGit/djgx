/**
 * Created by  on 16/6/27.
 */


var models = require('../model/index');



var Query = function (modelName, params){
    if (!(this instanceof Query)) {
        return new Query(modelName);
    }
    this.model = models.getModel(modelName);
    this.params = params;
    this.query = this.model.getQuery();
};


Query.prototype.formatQueryType = function () {
    if(!this.params) return;
    if (!this.params.all) {    //一次性全部....
        var pageNo =this.params.pageNo || 1;
        var size = this.params.pageSize || 10;
        this.query.limit(size);// 最多返回 10 条结果
        this.query.skip((pageNo - 1) * size);
    }
    var sortType = this.params.sortType || "ascending";
    this.query.notEqualTo("deleted", true);
    if (this.params.sort)  this.query[sortType](this.params.sort);
};


Query.prototype.formatQuery = function() {
    if (this.model.formatQuery) {
        this.query = this.model.formatQuery(this.query, this.params);
    }
};


Query.prototype.getAll = function(){
    this.formatQuery();
    this.formatQueryType();
    if (this.params && this.params.count) {
        return Promise.all([this.query.count(), this.query.find()]).then(function (arg_result) {
            return {total: arg_result[0], data: arg_result[1]};
        });
    }
    return this.query.find().then(function (arg_result) {
        return {data: arg_result};
    });
};




Query.prototype.find = function(){
    this.formatQuery();
    return  this.query.find();
};


Query.prototype.getOneById = function (arg_id) {
    return this.query.get(arg_id);
};



Query.prototype.checkRepeat = function(obj, field, errCode){
    var self = this;
    return new Promise(function(resolve, reject){
        if(!obj.hasOwnProperty(field)) return resolve();
        self.query.equalTo(field, obj[field]);
        if(obj.objectId) self.query.notEqualTo('objectId', obj.objectId);
        return self.query.find().then(function(datas){
            if(datas.length>0)  return reject(errCode+"重复");
            return resolve();
        });
    })
};




module.exports  = Query ;



