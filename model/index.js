/**
 * Created by shandianhaizan on 16/6/15.
 */

var fs = require('fs');
var path = require('path');

var index = {};

var model;


var modelPath = path.resolve(__dirname, './');
fs.readdirSync(modelPath).forEach(function (file) {
    if (~file.indexOf("js")) {
        model = require(path.resolve(modelPath , file));
        index[model.name] = model;
    }
});



index.getModel =  function(modelName){
    console.log(modelName);
    var model = index[modelName];
    if (!model) {
        throw new Error("not found model");
    }
    return model;
};




module.exports  = index;

















