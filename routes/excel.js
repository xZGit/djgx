/**
 * Created by shandianhaizan on 16/6/23.
 */


var xlsx = require('node-xlsx');
var path = require('path');
var fs = require("fs");

exports.readExcel  = function (url, callback){
    try{
        var workSheetsFromFile = xlsx.parse(url);
    }catch(e){
        callback(e);
    }

    callback(null,workSheetsFromFile);
};





exports.exportExcel  = function (data, name, callback){
    try{
        //const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
        var buffer = xlsx.build([{name: name, data: data}]);

        var newFilename = "export.xlsx";
        var filePath = path.join(__dirname, '../public', newFilename);

        fs.writeFile(filePath ,buffer,function (err) {
            if (err) throw err ;
            console.log("File Saved !"); //文件被保存
        }) ;

        callback(null, "./export.xlsx");

    }catch(e){
        callback(e);
    }

};








