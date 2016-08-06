'use strict';

angular
  .module('datetimepicker', [])

  .provider('datetimepicker', function () {
    var default_options = {};

    this.setOptions = function (options) {
      default_options = options;
    };

    this.$get = function () {
      return {
        getOptions: function () {
          return {
            locale: 'zh-cn',
          };
        }
      };
    };
  })

  .directive('datetimepicker', [
    '$timeout',
    'datetimepicker',
    function ($timeout,
              datetimepicker) {

      var default_options = datetimepicker.getOptions();

      return {
        require : '?ngModel',
        restrict: 'AE',
        scope   : {
          datetimepickerOptions: '@'
        },
        link    : function ($scope, $element, $attrs, ngModelCtrl) {
          var passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
          var options = jQuery.extend({}, default_options, passed_in_options);
          $element = $("#"+ $attrs.id);
          $element
            .on('dp.change', function (e) {
              if (ngModelCtrl) {
                $timeout(function () {
                  ngModelCtrl.$setViewValue(e.date.format());
                });
              }
            })
            .datetimepicker(options);

          function setPickerValue() {
            var date = null;

            if (ngModelCtrl && ngModelCtrl.$viewValue) {
              date = ngModelCtrl.$viewValue;
              $element
              .data('DateTimePicker')
              .date(new Date(date.iso));
        }
      }

          if (ngModelCtrl) {
            ngModelCtrl.$render = function () {
              setPickerValue();
            };
          }

          setPickerValue();
        }
      };

    }
  ]);