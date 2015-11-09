'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:ActivityfinishCtrl
 * @description
 * # ActivityfinishCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('ActivityfinishCtrl', function ($scope, $localStorage, $location, $routeParams, $timeout) {
    $scope.template = 'views/activityfinish.html';

    // 跳回基本信息
    if (!$localStorage.action) {
      $location.path('/');
    }
    $scope.txt = $localStorage.action === 'add' ? '添加' : '修改';
    $scope.id = $routeParams.id;
    $scope.process = 3;
    $scope.navs = [
      {name: '预售管理', active: true},
      {name: '活动列表', href: '/'},
      {name: '继续' + $scope.txt,
      href: $localStorage.action === 'add' ? '/activity/base/0' : '/activity/base/' + $scope.id},
      {name: $scope.txt + '完成', active: true}];
    $localStorage.$reset();

    var autoPromise = $timeout(function() {
      $location.path('/');
    }, 3000);

    $scope.clearAutoRedirecting = function() {
      $timeout.cancel(autoPromise);
    }
  });
