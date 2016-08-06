/**
 * Created by shandianhaizan on 16/6/23.
 */


var proxy = module.exports  = {};


proxy.findModel = function (modelName) {
    if(!modelName) throw new Error("not found model");
    var model = models[modelName];
    if (!model) {
        throw new Error("not found model");
    }
    return model;
};


proxy.formatQueryType = function (arg_query, arg_params) {
    if (!arg_params.all) {    //一次性全部....
        var pageNo = arg_params.pageNo || 1;
        var size = arg_params.size || 10;
        arg_query.limit(size);// 最多返回 10 条结果
        arg_query.skip((pageNo - 1) * size);
    }
    var sortType = arg_params.sortType || "ascending";
    if (arg_params.sort)  arg_query[sortType](arg_params.sort);
    return arg_query;
};


proxy.getAll = function (arg_params) {
    var model = this.findModel(arg_params.model);
    var query = model.getQuery();
    query = this.formatQueryType(arg_query, arg_params);
    if (arg_params.count) {
        return Promise.all([query.count(), query.find()]).then(function (arg_result) {
            return {total: arg_result[0], data: arg_result[1]};
        });
    }
    return query.find().then(function (arg_result) {
        return {data: arg_result};
    });
};



proxy.getOne = function (arg_query, arg_id) {
    return arg_query.get(arg_id);
};

