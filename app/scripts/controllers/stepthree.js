'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:StepthreeCtrl
 * @description
 * # StepthreeCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('StepthreeCtrl', function ($scope, httpService, $location, $routeParams, $localStorage, $q, $filter) {
    var defer = $q.defer();
    var stepType = $routeParams.type;// 类型
    // 直接跳转到第三步,储存前两步的东西。
    httpService.request('aa/get', {activityId: $routeParams.id})
      .then(function(response){
        if (!response) {
          defer.resolve(false);
        }
        response.reqParams = response.params;
        delete response.params;
        // 单独处理预售
        if (stepType === 'activity') {
          if (!response.reqParams.payType) response.reqParams.payType = 1;
          response.reqParams.actType = parseInt(response.reqParams.actType);
          if (response.reqParams.deliveryTime) {
            response.reqParams.deliveryTime = $filter('date')(response.reqParams.deliveryTime, 'yyyy-MM-dd');
          }
        }
        // 预售和限时促销相同的地方..
        if (stepType === 'activity' || stepType === 'promotion') {
          response.startTime = $filter('date')(new Date(response.startTime), 'yyyy-MM-dd HH:mm:ss');
          response.endTime = $filter('date')(new Date(response.endTime), 'yyyy-MM-dd HH:mm:ss');
          var goodsid = [];
          for (var i = 0; i < response.reqParams.items.length; i++) {
            goodsid.push(response.reqParams.items[i].id);
          }
          httpService.request('aa/getGoodsByIds', {goodsIds: goodsid.join(',')})
            .then(function(res) {
              $localStorage.$reset({
                goods: res
              });
              if (stepType === 'activity') {
                $localStorage.activity = response;
              } else {
                $localStorage.promotion = response;
              }
              defer.resolve(true);
            });
        } else {
          defer.resolve(false);
        }
      });

    defer.promise.then(function(success) {
      if (success) {
        $location.path('/' + stepType + '/setting');
      } else {
        $location.path('/');
      }
    });
  });
