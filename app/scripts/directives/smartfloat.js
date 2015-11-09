'use strict';

/**
 * @ngdoc directive
 * @name presellFrontendApp.directive:smartFloat
 * @description
 * # smartFloat
 */
angular.module('presellFrontendApp')
  .directive('smartFloat', function ($filter) {
    var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; //Numbers like: 1.123,56
    var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; //Numbers like: 1,123.56
    var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; //Numbers like: 1123.56
    var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; //Numbers like: 1123,56

    return {
        require: 'ngModel',
        scope: {
          max: '=maxNumber',
          min: '=minNumber',
          model: '=ngModel'
        },
        link: function (scope, elm, attrs, ctrl) {
            // ctrl.$parsers.unshift(function (viewValue) {
            //   if (FLOAT_REGEXP_1.test(viewValue)) {
            //       ctrl.$setValidity('float', true);
            //       return parseFloat(viewValue.replace('.', '').replace(',', '.'));
            //   } else if (FLOAT_REGEXP_2.test(viewValue)) {
            //           ctrl.$setValidity('float', true);
            //           return parseFloat(viewValue.replace(',', ''));
            //   } else if (FLOAT_REGEXP_3.test(viewValue)) {
            //           ctrl.$setValidity('float', true);
            //           return parseFloat(viewValue);
            //   } else if (FLOAT_REGEXP_4.test(viewValue)) {
            //           ctrl.$setValidity('float', true);
            //           return parseFloat(viewValue.replace(',', '.'));
            //   }else {
            //       ctrl.$setValidity('float', false);
            //       return undefined;
            //   }
            // });

            elm.on('blur', function() {
               var v = elm[0].value;
               var isFloat = (parseFloat(v) + '').indexOf('.') === -1 ? false : true;

               if (FLOAT_REGEXP_2.test(v)) {
                 v = viewValue.replace(',', '');
               }

               if (isNaN(v) || v === '') {
                 scope.model = undefined;
                 return;
               }
               v = parseFloat(v);

               if (scope.max) {
                 var max = parseFloat(scope.max);
                 if (max < v){
                   v = max;
                 }
               }
               if (scope.min) {
                 var min = parseFloat(scope.min);
                 if (min > v) {
                   v = min;
                 }
               }
               if (isFloat) {
                  v = parseFloat($filter('number')(v, 2));
               }

               ctrl.$setViewValue(v);
               ctrl.$render();
               scope.model = parseFloat(v);
            });

            ctrl.$parsers.unshift(
               function (viewValue) {
                 if (typeof viewValue === 'number') return viewValue;

                 if (viewValue === undefined || viewValue === '-') return '';

                 var transformedInput = viewValue.replace(/[^0-9\.]+/g, '');

                 var needRender = transformedInput !== viewValue;

                 if (needRender) {
                   ctrl.$setViewValue(transformedInput);
                   ctrl.$render();
                 }
                 if (transformedInput === '') {
                   return '';
                 }
                 return parseFloat($filter('number')(transformedInput, 2));
               }
           );
        }
    };
  });
