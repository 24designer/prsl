'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:PromotionfinishCtrl
 * @description
 * # PromotionfinishCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  // TODO 可与ActivityfinishCtrl合并
  .controller('PromotionfinishCtrl', function ($scope, $location, $timeout, $localStorage, $routeParams) {
    $scope.template = 'views/promotionfinish.html';

    // 跳回基本信息
    if (!$localStorage.action) {
      $location.path('/promotion');
    }
    $scope.txt = $localStorage.action === 'add' ? '添加' : '修改';
    $scope.id = $routeParams.id;
    $scope.process = 3;
    $scope.navs = [
      {name: '限时促销', active: true},
      {name: '活动列表', href: '/promotion'},
      {name: '继续' + $scope.txt,
      href: $localStorage.action === 'add' ? '/promotion/base/0' : '/promotion/base/' + $scope.id},
      {name: $scope.txt + '完成', active: true}];

    $localStorage.$reset();

    var autoPromise = $timeout(function() {
      $location.path('/promotion');
    }, 3000);

    $scope.clearAutoRedirecting = function() {
      $timeout.cancel(autoPromise);
    }

  });
