/**
 * Created by shandianhaizan on 16/7/6.
 */
var AV = require('leanengine');

var model = {};

model.name = 'Order';


//支付方式 payMethod

// 0 货到付款
// 1 支付宝网银支付
//   2 支付宝网页支付
//   3  支付宝wap支付
//   4 微信客户端支付
//   5 微信扫码支付
//   6 对公转账


//状态 state
//  0 等待付款
//  1 收款中
//   2收款失败
//   3 已付款
//   4 订单生效中
//   5 已完成
//   6已退货
//   7 已退款



model.getQuery = function(){
    return new AV.Query(model.name);
};



model.getObject = AV.Object.extend(model.name);



model.formatQuery = function(arg_query, arg_params) {
    if(arg_params.name)  {  //按订单号搜索
        arg_query.contains('orderNo', arg_params.name);
    }

    if(arg_params.state){
        arg_query.equalTo("state", arg_params.state);
    }else if(arg_params.common)  {   //普通查询  只获取 state 0 3 4三种状态
        var filterArray = [ '1', '2', '5', '6', '7'];
        arg_query.notContainedIn('state', filterArray);
    }else if(arg_params.hasRefund) {
        //var filterArray = ['1', '2', '5', '6', '7'];
        //arg_query.notContainedIn('state', filterArray);

        arg_query.equalTo("hasRefund", true);
    };
    return arg_query;
};




model.generateOrderNo = function(){
    return 'tpk' + (+new Date);
};



//Todo check param valid
model.validation  = function(params){
    if(!params.orderNo) params.orderNo = model.generateOrderNo() ;
    return {success:true};
};





module.exports = model;