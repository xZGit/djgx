/**
 * Created by shandianhaizan on 16/7/29.
 */



define([], function () {

    function _controller($scope, $location,  httpService) {
        var attrs = {"username":"用户名"};
        $scope.showAttrs = [];
        angular.forEach(attrs, function(v, k){
            $scope.showAttrs.push({"zhCn":v, "en": k });
        });

        $scope.showLoading();

        $scope.search = $location.search();
        $scope.search.pageSize = $scope.search.pageSize || 5;
        $scope.search.sort =  $scope.search.sort || "seq";
        $scope.search.sortype = $scope.search.sortype ||"descending";



        var model = "_User";

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
            var query = {pageNo: 1, count:true};
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





        //descending
        $scope.sort = function(sortBy, sortType){
            $location.search('sort', sortBy);
            $location.search('sortType', sortType);
            $location.search('pageNo', 1);   //重置
            $scope.getDetail();
        };


        $scope.remove = function(m){
            httpService.del(model, m.objectId).then(function (data) {
                $scope.msg.show(data);
                if($scope.isHandleSuccess(data)){
                    $scope.getDetail();
                }
            });
        };

        $scope.editObject = function(arg_o){
            $scope.editOj = {};
            if(arg_o)  $scope.editOj =  angular.copy(arg_o);
        };


        $scope.validation = function(editOj){
            if(!editOj.objectId){
                editOj.password = "123456";
            }
            return {success:true};
        };


        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');
            var validation = $scope.validation($scope.editOj);
            if(!validation.success) return $scope.msg.show(validation.msg);
            httpService.save(model, $scope.editOj).then(function (data) {
                $('#myModal').modal('hide');
                $scope.msg.show(data);
                $scope.getDetail();
            });
        };



        $scope.getDetail();



    }

    return _controller;
});


