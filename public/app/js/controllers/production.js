/**
 * Created by shandianhaizan on 16/6/13.
 */

define([], function () {

    function _controller($scope, httpService) {


        var model ="Production";
        var attrs = {"name":"名称","price":"价格", "num":"库存"};
        $scope.showAttrs = [];
        angular.forEach(attrs, function(v, k){
            $scope.showAttrs.push({"zhCn":v, "en": k });
        });

        $scope.showLoading();


        $scope.editObject = function(arg_o, arg_type){
            $scope.editOj = {};
            if(arg_o)  $scope.editOj =  angular.copy(arg_o);
            if(arg_type){
                if(arg_type == "store"){
                    $scope.editOj.way = "入库";
                    $scope.editOj.type = "inc";
                }else if(arg_type == "output"){
                    $scope.editOj.way = "代理分销";
                    $scope.editOj.type = "des";
                }else if(arg_type == "sale"){
                    $scope.editOj.way = "零售";
                    $scope.editOj.type = "des";
                }else if(arg_type == "out"){
                    $scope.editOj.way = "出库";
                    $scope.editOj.type = "des";
                }
            }
        };


        $scope.validation = function(oj){

            return {success:true};
        };


        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');
            var validation = $scope.validation($scope.editOj);
            if(!validation.success) return $scope.msg.show(validation.msg);
            if (!$scope.userForm.$valid) return;
            httpService.save(model, $scope.editOj).then(function (data) {
                $('#myModal').modal('hide');
                $scope.msg.show(data);
                $scope.getAll();
            });
        };



        $scope.store = function (editOj) {
            var body = {
                productionId: editOj.objectId,
                way: editOj.way,
                type : editOj.type,
                storeNum: editOj.storeNum,
                remark : editOj.remark,
                handler:$scope.user.username
            };
            if(!body.storeNum) return $scope.msg.show("请填写数目");
            if(body.type == "des" && body.storeNum > editOj.num)  return $scope.msg.show("库存不足");
            httpService.storeProduction(body).then(function (data) {
                $('#storeModal').modal('hide');
                $scope.msg.show(data);
                $scope.getAll();
            });
        };



        $scope.getAll = function () {
            httpService.get(model, {all:true, sort:"createdAt"}).then(function (data) {
                $scope.models = data.data.data;
                $scope.hideLoading();
            });

        };

        $scope.showRemove = function(m){
            $scope.deleteName = m.name;
            $scope.deleteObject = m;
        };


        $scope.remove = function(m){
            httpService.del(model, m.objectId).then(function (data) {
                httpService.removeParent(model, m.objectId).then(function (data) {
                    $scope.msg.show(data);
                    if($scope.isHandleSuccess(data)){
                        $scope.getAll();
                    }
                });
            });
        };


        $scope.getAll();

    }

    return _controller;
});
