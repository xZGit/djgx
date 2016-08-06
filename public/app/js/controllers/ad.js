/**
 * Created by shandianhaizan on 16/8/5.
 */



define([], function () {

    function _controller($scope, $location, httpService) {
        var attrs = {"handler":"操作人","way":"投放渠道", "master":"广告主名称", "mainUrl" :"广告主链接", "time":"投放时间", "addNum":"总添加人数", "subNum":"删除人数", "dealNum":"单日成交单数", totalDealNum:"总成交单数", money:"投入金额"};
        $scope.showAttrs = [];
        angular.forEach(attrs, function(v, k){
            $scope.showAttrs.push({"zhCn":v, "en": k });
        });

        $scope.showLoading();

        $scope.search = $location.search();
        $scope.search.pageSize = $scope.search.pageSize || 5;
        //$scope.search.sort =  $scope.search.sort || "seq";
        //$scope.search.sortype = $scope.search.sortype ||"descending";



        var model = "Ad";

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




        $scope.remove = function(m){
            httpService.del(model, m.objectId).then(function (data) {
                $scope.msg.show(data);
                if($scope.isHandleSuccess(data)){
                    $scope.getDetail();
                }
            });
        };

        $scope.getDetail();



    }

    return _controller;
});


