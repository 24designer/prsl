'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:PromotionCtrl
 * @description
 * # PromotionCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('PromotionCtrl', function ($scope, httpService, $filter) {
    // 导航
    $scope.navs = [{name: '限时促销', active: true},{name: '活动列表', href: '/promotion/'}];
    // 搜索条件
    $scope.promotion = {pageIndex: 1, pageSize: 10, shopId: 1, toolId: 2000, channel: '[1,2]'};

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

    var search = $scope.search = function() {
      var a = angular.copy($scope.promotion);
      if (a.status) a.status = parseInt(a.status);
      if (a.id) a.id = parseInt(a.id);
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
          search();
        });
    }
  });
