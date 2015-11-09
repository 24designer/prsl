'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl @TODO 建议改名成presell.
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('MainCtrl', function ($scope, httpService, $filter) {
    // 导航
    $scope.navs = [{name: '预售管理', active: true}, {name: '活动列表', href: '/urltoMainPage'}];
    // 搜索栏Collapse
    $scope.isCollapsed = true;
    // 搜索条件
    $scope.activity = {pageIndex: 1, pageSize: 10, shopId: 1, toolId: 12000, channel: '[1,2]'};
    // 初始化日期控件
    $scope.minDate = $scope.minDate ? null : new Date(2015, 7, 30);
    $scope.maxDate = new Date(2020, 5, 22);
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.open = function(type) {
      $scope.status[type] = true;
    }
    $scope.status = {
      // 送货日期
      sdt: false,
      // 活动开始日期
      bdt: false,
      // 活动结束日期
      edt: false
    };

    // 搜索
    var search = $scope.search = function() {
      var a = angular.copy($scope.activity);
      if (a.status) a.status = parseInt(a.status);
      if (a.activityType)  a.activityType = parseInt(a.activityType);
      if (a.id) a.id = parseInt(a.id);
      if (a.productId) a.productId = parseInt(a.productId);
      if (a.startDate) a.startDate = $filter('date')(a.startDate, 'yyyy-MM-dd');
      if (a.endDate) a.endDate = $filter('date')(a.endDate, 'yyyy-MM-dd');
      httpService.request('aa/query/page', a)
        .then(function(result) {
          if (result) {
              $scope.searchResult = result;
          }
        });
    }

    search();

    // 应用活动
    $scope.apply = function(index) {
      var ap = $scope.searchResult.list[index];
      if (confirm('确认应用ID为' + ap.id + '的活动?')) {
        httpService.post('aa/apply', {activityId: ap.id})
          .then(function() {
            search();
          });
      }
    }

    $scope.delete = function(index) {
      var ap = $scope.searchResult.list[index];
      httpService.request('aa/del', {activityId: ap.id})
        .then(function() {
          $scope.searchResult.list.splice(index, 1);
        });
    }
  });
