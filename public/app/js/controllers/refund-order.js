/**
 * Created by shandianhaizan on 16/7/9.
 */
define(['moment'], function (moment) {

    function _controller($scope,  $location,  httpService) {


        $scope.showLoading();

        $scope.states = ["等待付款","收款中","收款失败","已付款","订单生效中","已完成","已退货","已退款"];
        $scope.payMethods = ["货到付款", "支付宝网银支付","支付宝网页支付", "支付宝wap支付","微信客户端支付", "微信扫码支付","对公转账"];


        $scope.search = $location.search();
        $scope.search.pageSize = $scope.search.pageSize || 5;



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
            var query = {pageNo: 1, count:true, hasRefund:true};
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
            m.remarks.push(remark);
            var update = {objectId: m.objectId, remarks: m.remarks};
            httpService.save(model, update).then(function (data) {
                $scope.msg.show(data);
            });
        };





        $scope.getDetail();



    }

    return _controller;
});


