/**
 * Created by shandianhaizan on 16/6/30.
 */



var AV = require('leanengine');

var model = {};

model.name = '_User';


model.getQuery = function(){
    return new AV.Query(model.name);
};



model.getObject = AV.Object.extend(model.name);



//Todo check param valid
model.validation  = function(params){
    return {success:true};
};



model.formatQuery = function(arg_query, arg_params) {
    return arg_query;
};




module.exports = model;


