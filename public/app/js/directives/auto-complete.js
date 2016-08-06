/**
 * Created by xx on 16/2/26.
 */
define([], function () {

    return ['ngAutocomplete', function($timeout) {

        'use strict';

        var keys = {
            left	: 37,
            up		: 38,
            right	: 39,
            down	: 40,
            enter	: 13,
            esc		: 27
        };

        var setScopeValues = function (scope, attrs) {
            scope.showProperty = attrs.showProperty;
            scope.delay = parseInt(attrs.delay, 10) || 300;
            scope.placeholder = attrs.placeholder || '搜索 ...';
            scope.theme = attrs.theme || '';
            scope.maxResults = 10;
            scope.style = attrs.style;
            scope.showImg = attrs.showImg;

        };

        var delay = (function() {
            var timer = 0;
            return function (callback, ms) {
                $timeout.cancel(timer);
                timer = $timeout(callback, ms);
            };
        })();

        return {
            restrict: 'E',
            require: '?ngModel',
            scope: {
                getResult: '&getResult',
                initText: '=initText',
                handleResult : '&handleResult'
            },
            link: function(scope, element, attrs, ngModel) {
                setScopeValues(scope, attrs);

               if(attrs.initText){
                   $timeout(function(){
                       scope.keyword = scope.initText;
                   }, 1000);
               }

                scope.results = [];
                scope.currentIndex = null;
                scope.getResults = function () {

                    //if (parseInt(scope.keyword.length, 10) === 0) scope.results = [];
                    delay(function() {
                        if (scope.keyword.length <= 0) {
                            scope.results=[];
                            scope.showResults = false;
                            return;
                        }
                        scope.getResult({keyword: scope.keyword}).then(function (data) {
                            scope.results=data.data.data;
                            scope.showResults = true;
                        });

                    }, scope.delay);
                };

                scope.selectResult = function (r) {
                    scope.keyword = r[scope.showProperty];
                    ngModel.$setViewValue(r);
                    if(scope.handleResult) scope.handleResult({result:r});
                    scope.showResults = false;
                };

                scope.clearResults = function () {
                    scope.results = [];
                    scope.currentIndex = null;
                };

                scope.hoverResult = function (i) {
                    scope.currentIndex = i;
                };

                scope.keyupHandler = function (e) {


                    var key = e.which || e.keyCode;

                    if (key === keys.enter) {
                        scope.selectResult(scope.results[scope.currentIndex]);
                    }

                    if (key === keys.left || key === keys.up) {
                        if (scope.currentIndex > 0) {
                            scope.currentIndex -= 1;
                        }
                    }

                    if (key === keys.right || key === keys.down) {
                        if (scope.currentIndex < scope.maxResults - 1) {
                            scope.currentIndex += 1;
                        }
                    }
                    if (key === keys.esc) {
                        scope.keyword = '';
                        ngModel.$setViewValue('');
                        scope.clearResults();
                    }
                };


            },
            template:
            '<input type="text" ng-model="keyword" class="ng-autocomplete-input"  style = "{{style}}"placeholder="{{ placeholder }}" ng-change="getResults()" ng-keyup="keyupHandler($event)" ng-focus="currentIndex = 0" autocorrect="off" autocomplete="off">' +
                '<div class="ng-autocomplete-holder" ng-show="showResults" style="position: relative; z-index:1000"ng-class="{\'red\': theme === \'red\', \'green\': theme === \'green\', \'blue\': theme === \'blue\'}">' +
            '  <div class="ng-autocomplete-result ltw" ng-repeat="r in results " ng-click="selectResult(r)" ng-mouseover="hoverResult($index)" ng-class="{\'hover\': $index === currentIndex}">' +
            '    <img ng-if="showImg" class="ng-autocomplete-result-img" ng-src="{{r[showImg]}}">' +
            '    <span class="ng-autocomplete-result-title" ng-bind="r.{{showProperty}}"></span>' +
            '  </div>' +
            '</div>'
        };



    }]
});