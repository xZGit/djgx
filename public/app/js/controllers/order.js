/**
 * Created by shandianhaizan on 16/7/7.
 */


define(['moment'], function (moment) {

    function _controller($scope,  $location,  httpService) {
        var attrs = {"orderNo":"订单号","receiverName":"收件人姓名","receiverPhone":"收件人手机号"};
        $scope.showAttrs = [];
        angular.forEach(attrs, function(v, k){
            $scope.showAttrs.push({"zhCn":v, "en": k });
        });

        $scope.showLoading();

        $scope.states = ["等待付款","收款中","收款失败","已付款","订单生效中","已完成","已退货","已退款"];
        $scope.payMethods = ["货到付款", "支付宝网银支付","支付宝网页支付", "支付宝wap支付","微信客户端支付", "微信扫码支付","对公转账"];


        $scope.search = $location.search();
        $scope.search.pageSize = $scope.search.pageSize || 5;
        //$scope.search.sort =  $scope.search.sort || "seq";
        //$scope.search.sortype = $scope.search.sortype ||"descending";



        var model = "Order";

        $scope.paging = function (page) {
            $location.search('pageNo', page);
            $scope.getDetail();
        };

        $scope.searchName = function(arg_name){
            $location.search('name', arg_name);
            $scope.getDetail();
        };

        $scope.setState = function(state){
            $location.search('state', state);
            $scope.getDetail();
        };



        $scope.getSearchQuery = function($location){
            var searchObject = $location.search();
            var query = {pageNo: 1, count:true, common:true};
            var params = ['size', 'pageNo','sort','pageSize', 'name', 'state', 'sortType'];
            angular.forEach(params, function(p){
                if(searchObject.hasOwnProperty(p)) query[p] = searchObject[p];
            });
            return query;
        };



        $scope.getDetail = function () {
            var query = $scope.getSearchQuery($location);
            httpService.get(model, query).then(function (data) {
                $scope.models = data.data.data;
                $scope.total = data.data.total;
                $scope.hideLoading();
            });
        };




        $scope.checkAll = function(arg_bool){
            angular.forEach($scope.models, function(model){
                model.checked = arg_bool;
            })
        };


        //descending
        $scope.sort = function(sortBy, sortType){
            $location.search('sort', sortBy);
            $location.search('sortType', sortType);
            $location.search('pageNo', 1);   //重置
            $scope.getDetail();
        };



        var getCheckedData = function(){
            var datas = [["所有商品","订单号","收件人姓名","收件人手机","购买时间","已付金额","待付金额","优惠金额","付款时间","状态","支付方式","最新备注"]];
            angular.forEach($scope.models, function(model){
                var pname = "";
               angular.forEach(model.production, function(p){
                    pname = pname +'|'+p.name;
               });
               var  createdAt = moment(model.createdAt).format("LLL");
               var  payTime = moment(model.payTime).format("LLL");
                var remark = "";
                if(model.remarks.length >0) remark = model.remarks[model.remarks.length-1].text;
                datas.push([pname, model.orderNo, model.receiverName, model.receiverPhone, createdAt, model.paidAmount, model.buyCost-model.paidAmount, model.cost- model.buyCost, payTime, $scope.states[model.state], $scope.payMethods[model.payMethod], remark])
            });
            return datas;
        };



        $scope.showRemove = function(m){
            $scope.deleteName = m.orderNo;
            $scope.deleteObject = m;
        };


        $scope.remove = function(m){
            httpService.del(model, m.objectId).then(function (data) {
                $scope.msg.show(data);
                if($scope.isHandleSuccess(data)){
                    $scope.getDetail();
                }
            });
        };


        $scope.editObject = function(m){
            $scope.editOrder = m;
        };



        $scope.saveRemark = function(remark, m){
            if(!remark || !remark.text) return $scope.msg.show("请填写备注内容");
            m.remarks = m.remarks || [];
            remark.createdAt = new Date();
            remark.handler = $scope.user.username;
            m.remarks.push(remark);
            var update = {objectId: m.objectId, remarks: m.remarks};
            httpService.save(model, update).then(function (data) {
                $scope.msg.show(data);
            });
        };



        $scope.exportExcel = function(){
            var data = getCheckedData();
            var name = "订单表";
            httpService.exportOrderExcel({data:data, name:name}).then(function(data){
                if(data && data.url){
                    window.location= data.url
                }else {
                    $scope.msg.show("操作失败");
                }
            });
        };



        $scope.getDetail();
    }

    return _controller;
});


