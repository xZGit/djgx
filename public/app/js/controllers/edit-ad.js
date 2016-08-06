/**
 * Created by shandianhaizan on 16/8/5.
 */
define(['validator'], function (validator) {

    function _controller($scope, $routeParams, $location, $timeout, httpService) {

        var id = $routeParams.id;
        var model ="Ad";


        var isUpdate = function(){
            return id && id!=="new"
        };


        $scope.validation = function(arg_params){
            if(!isUpdate()){
                arg_params.handler = $scope.user.username;
            }
            return {success:true}
        };


        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');
            if (!$scope.userForm.$valid) return;
            var validation = $scope.validation($scope.editOj);
            if(!validation.success) return $scope.msg.show(validation.msg);
            httpService.save(model, $scope.editOj).then(function (data) {
                $scope.msg.show(data);
                if($scope.isHandleSuccess(data) && !isUpdate()){
                    $location.path('/edit-ad/'+data.data.objectId);
                }
            });

        };




        $scope.reset = function () {
            $scope.$broadcast('show-errors-reset');
        };


        if(isUpdate()){
            $scope.editType = "编辑";
            httpService.get(model, id).then(function (data) {
                $scope.editOj = data.data;
            });
        }else{
            $scope.editType = "添加";
            $scope.editOj = {};
        }



    }

    return _controller;
});

