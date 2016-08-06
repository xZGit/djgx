define([
        'angular',
        'utils/route-config',
        'angularRoute',
        'ngFileUpload',
        'ngSortable',
        'ngCkeditor',
        'ngUiTree',
        'ngDate',
    ],

    function (angular, routeConfig) {

        return angular.module('myApp', ['ngRoute', 'ngFileUpload', 'ng-sortable', 'ckeditor', 'ui.tree', 'datetimepicker'], function ($provide, $compileProvider, $controllerProvider, $filterProvider) {

            routeConfig.setProvide($provide); //for services
            routeConfig.setCompileProvider($compileProvider);  //for directives
            routeConfig.setControllerProvider($controllerProvider); //for controllers
            routeConfig.setFilterProvider($filterProvider); //for filters
        }).controller('menu', ['$scope', '$location', '$http', '$timeout', function ($scope, $location, $http, $timeout) {
            // putting $location as a $scope instance variable
            // so that we could set "active" class based on current $location.path
            $scope.location = $location;
            //$http({
            //    method: "GET",
            //    url: "/login/auth"
            //}).then(function (data) {
            //    if (data && data.data && data.data.code == 0 && data.data.user) {
            //        $scope.user = data.data.user;
            //        $scope.$broadcast('auth', $scope.user);
            //    } else {
            //        setTimeout(function () {
            //            window.location = "/login";
            //        }, 0);
            //    }
            //
            //});
            $scope.user = {username:""};
            $scope.savePwd = function(pwd){
                if(!pwd || !pwd.new || !pwd.old || !pwd.new1) return $scope.msg.show("填写不完整");
                if(pwd.new !== pwd.new1) return $scope.msg.show("两次密码不一致");
                $http({
                    method:"POST",
                    url: "/login/changePwd",
                    data:pwd
                }).then(function(data){
                    $scope.msg.show(data.data);
                });
            };

            $(function () {
                $(window).bind("load resize", function () {
                    var topOffset = 50,
                        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                    if (width < 768) {
                        $('div.navbar-collapse').addClass('collapse');
                        topOffset = 100; // 2-row-menu
                    } else {
                        $('div.navbar-collapse').removeClass('collapse');
                    }

                    var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
                    height = height - topOffset;
                    if (height < 1) height = 1;
                    if (height > topOffset) {
                        $("#page-wrapper").css("min-height", (height) + "px");
                    }
                });

            });

            $scope.location = $location;
            $scope.paths = [
                {
                    url: "/production",
                    name: "仓库管理"
                },
                {
                    url: "/user",
                    name: "人员管理"
                },
                {
                    url: "/ad",
                    name: "投产参数"
                },
                {
                    url: "/phrase",
                    name:"快捷短语"
                },
                {
                    url: "/order",
                    name:"订单管理"
                }
            ];

            if ($location.path() === "/") {
                $location.path('/order');
            }


            $scope.showLoading = function () {
                document.getElementById("loading").style.display = "block";
            };

            $scope.hideLoading = function () {
                document.getElementById("loading").style.display = "none";
            };

            $scope.isHandleSuccess = function (data) {
                return data.hasOwnProperty("code") && data.code === 0;
            };

            $scope.msg = {
                msg: null,
                show: function (data) {
                    var ctx = this;

                    var showMsg = function (msg, millsec, level) {
                        ctx.msg = msg;
                        ctx.level = level || "info";
                        $timeout(function () {
                            ctx.msg = null;
                        }, millsec);

                    };
                    if (typeof data == "string") {
                        showMsg(data, 5000, "warning");
                        return;
                    }
                    if ($scope.isHandleSuccess(data)) {
                        showMsg("操作成功", 2000);
                    } else {
                        var msg = data.error || "操作失败";
                        showMsg(msg, 5000, "warning");

                    }
                }
            };

        }]);

    }
);