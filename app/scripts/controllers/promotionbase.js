'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:PromotionbaseCtrl
 * @description
 * # PromotionbaseCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('PromotionbaseCtrl', function ($scope, $localStorage, $location, $routeParams, httpService, $filter, $timeout) {

    var editId = $routeParams.editId;
    // 模板
    $scope.template = 'views/promotionbase.html';
    // 导航步骤
    $scope.process = 0;

    $scope.navs = [{name: '限时促销', active: true}, {name: '活动列表', href: '/'}];

    // 重新添加
    if (editId === '0') {
      $localStorage.$reset();
      // 初始化活动
      $scope.promotion = {
        reqParams: { setType: 0 }, enable: 'false', channel: []
      };
      $scope.navs.push({name: '添加限时促销', active: true});
    // 继续添加或者修改
    } else if(editId === 'c') {
      if ($localStorage.promotion) {
        // 将毫秒转换成Date
        $scope.promotion = angular.copy($localStorage.promotion);
        $scope.promotion.enable += '';
      } else {
        // 初始化活动
        $scope.promotion = {
          reqParams: { actType: 1, payType: 1}, enable: 'false', channel: []
        };
      }
      $scope.navs.push({name: $scope.promotion.id ? '编辑限时促销' : '添加限时促销', active: true});
    } else {
      $localStorage.$reset();
      httpService.request('aa/get', {activityId: editId})
        .then(function(response){
          if (!response) {
            $timeout(function(){
              $location.path('/promotion/base/0');
            }, 2000);
          }
          response.reqParams = response.params;
          delete response.params;

          response.startTime = $filter('date')(new Date(response.startTime), 'yyyy-MM-dd HH:mm:ss');
          response.endTime = $filter('date')(new Date(response.endTime), 'yyyy-MM-dd HH:mm:ss');
          $scope.promotion = angular.copy(response);
          $scope.promotion.enable += '';
        });
      $scope.navs.push({name: '编辑限时促销', active: true});
    }

    // 选择渠道
    $scope.togglePromotionWay = function(item) {
      var idx = $scope.promotion.channel.indexOf(item);
      if (idx > -1) {
        $scope.promotion.channel.splice(idx, 1);
      } else {
        $scope.promotion.channel.push(item);
      }
      $scope.promotion.channel = $filter('orderBy')($scope.promotion.channel);
    }

    // 设置时间
    $scope.onsetTime = function (newT, oldT, n) {
      if (n === 'endTime') {
        newT.setSeconds(59);
      }
      $scope.promotion[n] = $filter('date')(newT, 'yyyy-MM-dd HH:mm:ss');
    }


    // 下一步
    $scope.nextStep = function(form) {
      $scope.invalidChannel  = false;
      $scope.invalidTimeInterval = false;
      var startTime,endTime;
      // 表单验证
      if (form.$invalid) {
        form.name.$dirty = true;
        form.startTime.$dirty = true;
        form.endTime.$dirty = true;
        form.ad.$dirty = true;
        return;
      } else {
        var _reTimeReg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
        if (!_reTimeReg.test($scope.promotion.startTime)) {
          form.startTime.$invalid = true;
          form.startTime.$dirty = true;
          return;
        }
        if (!_reTimeReg.test($scope.promotion.endTime)) {
          form.endTime.$invalid = true;
          form.endTime.$dirty = true;
          return;
        }
        startTime = new Date($scope.promotion.startTime).getTime();
        endTime = new Date($scope.promotion.endTime).getTime();
        if (startTime >= endTime) {
          form.startTime.$invalid = true;
          form.endTime.$invalid = true;
          $scope.invalidTimeInterval = true;
          return;
        }

        // 渠道验证
        if ($scope.promotion.channel.length === 0) {
          $scope.invalidChannel = true;
          return;
        }
      }

      // $scope.promotion.enable = $scope.promotion.enable === 'true' ? true : false;
      //
      // // 储存到本地
      // $localStorage.promotion = $scope.promotion;
      // // 跳转到选择货物
      // $location.path('/promotion/goods');
      // 服务端验证
      $scope.promotion.toolId = 2000;
      $scope.promotion.step = 1;
      var pm = angular.copy($scope.promotion);
      delete pm.reqParams.items;
      delete pm.createTime;
      delete pm.lastModify;
      httpService.post('aa/validateByStep', pm)
        .then(function(res) {
          if (res) {
            $scope.promotion.enable = $scope.promotion.enable === 'true' ? true : false;

            // 储存到本地
            $localStorage.promotion = $scope.promotion;
            // 跳转到选择货物
            $location.path('/promotion/goods');
          }
        });
    }


  });
