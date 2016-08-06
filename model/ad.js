/**
 * Created by shandianhaizan on 16/8/5.
 */



var AV = require('leanengine');

var model = {};

model.name = 'Ad';


model.getQuery = function(){
    return new AV.Query(model.name);
};



model.getObject = AV.Object.extend(model.name);



//Todo check param valid
model.validation  = function(params){
    if(params.date) params.date = new Date(params.date);
    return {success:true};
};



model.formatQuery = function(arg_query, arg_params) {
    return arg_query;
};

module.exports = model;

