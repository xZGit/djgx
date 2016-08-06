/**
 * Created by shandianhaizan on 16/8/2.
 */


define([], function () {

    function _controller($scope, $routeParams, $location, $timeout, httpService) {


        var model ="Phrase";
        var attrs = {"question":"问题", answer:"答案"};
        $scope.showAttrs = [];
        angular.forEach(attrs, function(v, k){
            $scope.showAttrs.push({"zhCn":v, "en": k });
        });

        $scope.showLoading();


        $scope.editObject = function(arg_o){
            $scope.editKey = {};
            if(arg_o)  $scope.editKey =  angular.copy(arg_o);
        };


        $scope.validation = function(editKey){
            return {success:true};
        };


        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');
            var validation = $scope.validation($scope.editKey);
            if(!validation.success) return $scope.msg.show(validation.msg);
            if (!$scope.userForm.$valid) return;
            httpService.save(model, $scope.editKey).then(function (data) {
                $('#myModal').modal('hide');
                $scope.msg.show(data);
                $scope.getAll();
            });
        };


        $scope.getAll = function () {
            httpService.get(model, {all:true, sort:"createdAt", type:"system"}).then(function (data) {
                $scope.models = data.data.data;
                $scope.hideLoading();
            });

        };



        $scope.showRemove = function(m){
            $scope.deleteName = m.name;
            $scope.deleteObject = m;
        };




        //$scope.remove = function(m){
        //    httpService.del(model, m.objectId).then(function (data) {
        //        httpService.removeParent(model, m.objectId).then(function (data) {
        //            $scope.msg.show(data);
        //            if($scope.isHandleSuccess(data)){
        //                $scope.getAll();
        //            }
        //        });
        //    });
        //};

        $scope.getAll();

    }

    return _controller;
});
