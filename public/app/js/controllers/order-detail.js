/**
 * Created by shandianhaizan on 16/7/8.
 */


define(['validator'], function (validator) {

    function _controller($scope, $routeParams, $location, $timeout, httpService) {

        var id = $routeParams.id;
        var model ="Order";
        var isUpdate = function(){
            return id && id!=="new"
        };



        var inArray = function(one, arr){
            return $.inArray(one, arr)>=0
        };
        var inProperty = function(one , arr){
            for(var i= 0, l=arr.length; i<l; i++){
                if(one.name == arr[i].key){
                    return true;
                }
            }
            return false;
        };
        var inRelation = function(one , arr){
            for(var i= 0, l=arr.length; i<l; i++){
                if(one.objectId == arr[i].objectId){
                    return true;
                }
            }
            return false;
        };


        $scope.record = function(oldValue, newValue, name ,recordId){
            var obj = {oldValue: oldValue, newValue:newValue, name:name, username:$scope.user.username, recordId:recordId};
            httpService.save("Record", obj ).then(function (data) {
            });
        };


        $scope.remove = function(one, arr){
            arr.splice( $.inArray(one, arr), 1);
        };


        $scope.states = ["等待付款","收款中","收款失败","已付款","订单生效中","已完成","已退货","已退款"];
        $scope.payMethods = ["货到付款", "支付宝网银支付","支付宝网页支付", "支付宝wap支付","微信客户端支付", "微信扫码支付","对公转账"];


        $scope.setState = function(){
            $scope.order.state = '1';
            $scope.record("收款失败", "收款中", "状态", $scope.order.objectId);
            $scope.save();
        };




        $scope.validation = function(arg_params){
            if(arg_params.receiverPhone && !validator.isMobilePhone(arg_params.receiverPhone, "zh-CN")){
                return {success:false, msg:"手机号格式错误"};
            };
            if(arg_params.receiverEmail && !validator.isEmail(arg_params.receiverEmail) ){
                return {success:false, msg:"邮箱格式错误"};
            };

            if($scope.customer){
                arg_params.username = $scope.customer.username;
            }

            return {success:true}

        };




        $scope.save = function () {
            var validation = $scope.validation($scope.order);
            if(!validation.success) return $scope.msg.show(validation.msg);
            httpService.save(model, $scope.order).then(function (data) {
                $scope.msg.show(data);
                if($scope.isHandleSuccess(data) && !isUpdate()){
                $location.path('/edit-order/'+data.data.objectId);
                }
            });

        };


        $scope.searchProduction = function (keyword) {
            return httpService.get("Production",{name:keyword});
        };


        $scope.handleSeacherResult  = function (result) {
            if(result.address) $scope.order.receiverAddress = result.address;
            if(result.realName) $scope.order.receiverName = result.realName;
            if(result.mobilePhoneNumber) $scope.order.receiverPhone = result.mobilePhoneNumber;
            if(result.objectId) $scope.order.customerId = result.objectId;
        };

        $scope.searchCustomer  = function (keyword) {
            return httpService.get("Customer",{name:keyword});
        };


        $scope.calCost = function(){
            $scope.order.cost = 0;
            $scope.order.buyCost = 0;
            angular.forEach($scope.order.production, function(p){
                $scope.order.cost = $scope.order.cost + p.cost * p.num;
                $scope.order.buyCost = $scope.order.buyCost + p.buyCost * p.num;
            });
        };


        $scope.reset = function () {
            $scope.$broadcast('show-errors-reset');
            $scope.order = {};
        };

        $scope.saveRemark = function(remark, m){
            if(!remark || !remark.text) return $scope.msg.show("请填写备注内容");
            m.remarks = m.remarks || [];
            remark.createdAt = new Date();
            remark.handler = $scope.user.username;
            m.remarks.push(remark);
            $scope.save();
        };

        $scope.updateBuyCost = function(n){
            $scope.buyCostOldValue= n;
            $scope.editBuyCost = true;

        };

        $scope.saveBuyCost = function(n){
            $scope.save();
            $scope.editBuyCost = false;
            $scope.record($scope.buyCostOldValue, n, "价格", $scope.order.objectId);
        };

        $scope.updateFreight = function(n){
            $scope.FreightOldValue= n;
            $scope.editFreight = true;

        };

        $scope.saveFreight = function(n){
            $scope.save();
            $scope.editFreight = false;
            $scope.record($scope.FreightOldValue, n, "运费", $scope.order.objectId);
        };




        $scope.addLogistics = function(){
            $scope.order.logistics = $scope.order.logistics || [];
            $scope.order.logistics.push({createdAt: new Date()});
        };

        $scope.addProductionToL = function(p, l){
            l.production = l.production || [];
            if(!inArray(p,l)) {
                l.production.push(p)
            }

        };

        //obj 要退款的对象
        //type "order" 整个订单 "item" 订单项
        $scope.editRefund = function(obj, type){
            $scope.editRefundObj = obj,
            $scope.editRefundType = type;

        };

        $scope.saveRefund = function (refund){
            refund.createdAt = new Date();
            refund.handler = $scope.user.username;
            $scope.editRefundObj.refund = refund;
            $scope.order.hasRefund = true;
            if($scope.editRefundType == "order"){
                $scope.order.state = '7';
            }
            $scope.save();

        };


        if(isUpdate()){
            $scope.editType = "编辑";
            httpService.get(model, id).then(function (data) {
                $scope.order = data.data;
            });
        }else{
            $scope.editType = "添加";
            $scope.order = {};
        }

    }

    return _controller;
});

