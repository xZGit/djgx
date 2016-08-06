/**
 * Created by shandianhaizan on 16/7/4.
 */


var models = require('../model/index');
var AV = require('leanengine');


var Doc = function(modelName, params){
    if (!(this instanceof Doc)) {
        return new Doc(modelName);
    }

    this.model = models.getModel(modelName);
    this.newObject =new this.model.getObject();
    this.params = params;
    this.validation();
    this.setObjProperty();
};


Doc.prototype.validation = function(){
    if (this.model.validation) {
        var result = this.model.validation(this.params);
        if(!result.success) throw new Error('');
    }
};


Doc.prototype.setObjProperty = function(){
    var self = this;
    Object.keys(this.params).forEach(function (k) {
        self.newObject.set(k, self.params[k]);
    });
    return this;
};




Doc.prototype.save = function(){
  return this.newObject.save();
};




module.exports.doc  = Doc ;
module.exports.batchSave = function(avObjectArray){
    return AV.Object.saveAll(avObjectArray)
};


