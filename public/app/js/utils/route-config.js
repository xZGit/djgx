/**
 * Created by xx on 15/9/6.
 */
define([
        'utils/lazy-directives',
        'utils/lazy-services',
        'utils/lazy-filters'
    ],


    function (lazyDirectives, lazyServices, lazyFilters) {


        var $controllerProvider;


        function setControllerProvider(value) {
            $controllerProvider = value;
        }


        function setCompileProvider(value) {
            lazyDirectives.setCompileProvider(value);
        }


        function setProvide(value) {
            lazyServices.setProvide(value);
        }


        function setFilterProvider(value) {
            lazyFilters.setFilterProvider(value);
        }


        /*


         $provide.value('a', 123);
         $provide.factory('a', function() { return 123; });
         $compileProvider.directive('directiveName', ...);
         $filterProvider.register('filterName', ...);
         */
        function config(templatePath, controllerPath, lazyResources) {

            templatePath =  "app/views/" + templatePath;
            controllerPath = "app/js/controllers/" + controllerPath;

            if (!$controllerProvider) {
                throw new Error("$controllerProvider is not set!");
            }


            var defer,
                html,
                routeDefinition = {};


            routeDefinition.templateUrl = function () {
                return templatePath;
            };

            routeDefinition.reloadOnSearch = false;


            routeDefinition.controller = controllerPath.substring(controllerPath.lastIndexOf("/") + 1);


            routeDefinition.resolve = {

                delay: function ($q, $rootScope) {


                    defer = $q.defer();


                    if (!html) {


                        var dependencies = [controllerPath];

                        if (lazyResources) {
                            if (angular.isDefined(lazyResources.directives)) dependencies = dependencies.concat(lazyResources.directives);
                            if (angular.isDefined(lazyResources.services))dependencies = dependencies.concat(lazyResources.services);
                            if (angular.isDefined(lazyResources.filters))dependencies = dependencies.concat(lazyResources.filters);
                        }

                        console.log(dependencies);
                        require(dependencies, function () {


                            var indicator = 0;


                            if (angular.isDefined(controllerPath)) {
                                $controllerProvider.register(controllerPath.substring(controllerPath.lastIndexOf("/") + 1), arguments[indicator]);
                                indicator++;
                            }

                            if (angular.isDefined(lazyResources)) {


                                if (angular.isDefined(lazyResources.directives)) {
                                    for (var i = 0; i < lazyResources.directives.length; i++) {
                                        lazyDirectives.register(arguments[indicator]);
                                        indicator++;
                                    }
                                }


                                if (angular.isDefined(lazyResources.services)) {
                                    for (var i = 0; i < lazyResources.services.length; i++) {
                                        lazyServices.register(arguments[indicator]);
                                        indicator++;
                                    }
                                }


                                if (angular.isDefined(lazyResources.filters)) {
                                    for (var i = 0; i < lazyResources.filters.length; i++) {
                                        lazyFilters.register(arguments[indicator]);
                                        indicator++;
                                    }
                                }
                            }


                            defer.resolve();
                            $rootScope.$apply();
                        })
                    }

                    else {
                        defer.resolve();
                    }

                    return defer.promise;
                }
            };

            return routeDefinition;
        }

        return {
            setControllerProvider: setControllerProvider,
            setCompileProvider: setCompileProvider,
            setProvide: setProvide,
            setFilterProvider: setFilterProvider,
            config: config
        };
    }
);