'use strict';

/**
 * @ngdoc directive
 * @name presellFrontendApp.directive:integer
 * @description
 * # integer
 */
angular.module('presellFrontendApp')
  .directive('integer', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        max: '=maxNumber',
        min: '=minNumber',
        model: '=ngModel'
      },
      link: function(scope, ele, attr, ctrl){
        ele.on('blur', function() {
          var value = ele[0].value, needRender = false;
          if (isNaN(value) || value === '') {
            scope.model = undefined;
            return;
          }

          if (scope.max) {
            var max = parseInt(scope.max, 10);
            if (max < value){
              needRender = true;
              scope.model = max;
            }
          }
          if (scope.min) {
            var min = parseInt(scope.min, 10);
            if (min > value) {
              needRender = true;
              scope.model = min;
            }
          }

          if (needRender) {
            ctrl.$setViewValue(scope.model);
            ctrl.$render();
          }
        });

        ctrl.$parsers.push(function(viewValue){
          if (typeof viewValue === 'number') return viewValue;

          if (viewValue === undefined || viewValue === '-') return '';

          var transformedInput = (viewValue).replace(/[^0-9]/g, '');

          var needRender = transformedInput !== viewValue;

          var transformedInput = parseInt(transformedInput, 10);

          if (needRender) {
            ctrl.$setViewValue(transformedInput);
            ctrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });
