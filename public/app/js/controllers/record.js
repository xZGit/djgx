/**
 * Created by shandianhaizan on 16/7/11.
 */


define([], function () {

    function _controller($scope, $routeParams, $location,  httpService) {


        $scope.showLoading();


        var id = $routeParams.id;
        var model = "Record";



        $scope.getDetail = function () {
            httpService.get(model, {recordId:id}).then(function (data) {
                $scope.models = data.data.data;
                $scope.hideLoading();
            });
        };



        $scope.getDetail();



    }

    return _controller;
});

