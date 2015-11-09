'use strict';

/**
 * @ngdoc directive
 * @name presellFrontendApp.directive:imageUploader
 * @description
 * # imageUploader
 */
angular.module('presellFrontendApp')
  .directive('imageUploader', function ($filter) {
    return {
      templateUrl: 'views/imageuploader.html',
      restrict: 'E',
      scope: {
        methods: '=', //活动的渠道
        modal: '&',  //打开modal
        index: '=', //当前预售商品的位置
        presell: '=' //当前各个渠道的图片数组
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        ////默认选择第一种渠道
        scope.mindex = 0;
        scope.cpicture = scope.methods[0];
        scope.lcpicture = $filter('lowercase')(scope.cpicture);
        //切换当前选择的类型
        scope.setPicture = function(m, index) {
          scope.cpicture = m;
          scope.lcpicture = $filter('lowercase')(m);
        }
        // 打开图片上传
        scope.open = function(method) {
          scope.modal({method: method, index: scope.index});
        }
      }
    };
  });
