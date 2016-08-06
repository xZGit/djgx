/**
 * Created by shandianhaizan on 16/8/6.
 */


var AV = require('leanengine');

var model = {};

model.name = 'ProductionRecord';
model.getQuery = function(){
    return new AV.Query(model.name);
};


model.formatQuery = function(arg_query, arg_params) {
    if(arg_params.productionId) arg_query.equalTo("recordId", arg_params.productionId);
    return arg_query;
};


model.getObject = AV.Object.extend(model.name);

//Todo check param valid
model.validation  = function(params){
    return {success:true};
};



module.exports = model;