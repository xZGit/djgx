/**
 * Created by shandianhaizan on 16/6/15.
 */




var AV = require('leanengine');

var model = {};

model.name = 'Production';
model.getQuery = function(){
    return new AV.Query(model.name);
};


model.formatQuery = function(arg_query, arg_params) {
    return arg_query;
};


model.getObject = AV.Object.extend(model.name);

//Todo check param valid
model.validation  = function(params){
  return {success:true};
};



module.exports = model;







