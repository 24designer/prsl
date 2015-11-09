'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:ActivitybaseCtrl
 * @description 添加活动的基本信息
 * # ActivitybaseCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('ActivitybaseCtrl', function ($scope, $localStorage, $location, $routeParams, httpService, $filter, $timeout) {
    var editId = $routeParams.editId;
    // 模板
    $scope.template = 'views/activitybase.html';
    // 导航步骤
    $scope.process = 0;

    $scope.navs = [{name: '预售管理', active: true}, {name: '活动列表', href: '/'}];

    if (editId === '0') {
      $localStorage.$reset();
      // 初始化活动
      $scope.activity = {
        reqParams: { actType: 1, payType: 1}, enable: 'false', channel: []
      };
      $scope.navs.push({name: '添加活动', active: true});
    } else if(editId === 'c') {
      if ($localStorage.activity) {
        // 将毫秒转换成Date
        $scope.activity = angular.copy($localStorage.activity);
        if ($scope.activity.reqParams.deliveryTime) {
          $scope.activity.reqParams.deliveryTime = new Date($scope.activity.reqParams.deliveryTime);
        }
        // if($scope.activity.reqParams.releaseTime) $scope.activity.reqParams.releaseTime = new Date($scope.activity.reqParams.releaseTime);
        $scope.activity.enable += '';
      } else {
        // 初始化活动
        $scope.activity = {
          reqParams: { actType: 1, payType: 1}, enable: 'false', channel: []
        };
      }
      $scope.navs.push({name: $scope.activity.id ? '编辑活动' : '添加活动', active: true});
    } else {
      $localStorage.$reset();
      httpService.request('aa/get', {activityId: editId})
        .then(function(response){
          if (!response) {
            $timeout(function(){
              $location.path('/activity/base/0');
            }, 2000);
          }
          response.reqParams = response.params;
          delete response.params;
          if (!response.reqParams.payType) response.reqParams.payType = 1;

          response.startTime = $filter('date')(new Date(response.startTime), 'yyyy-MM-dd HH:mm:ss');
          response.endTime = $filter('date')(new Date(response.endTime), 'yyyy-MM-dd HH:mm:ss');
          $scope.activity = angular.copy(response);
          $scope.activity.enable += '';
        });
      $scope.navs.push({name: '编辑活动', active: true});
    }

    // 初始化日期控件
    $scope.minDate = new Date();
    $scope.maxDate = new Date();
    $scope.maxDate.setFullYear(parseInt($scope.maxDate.getFullYear()) + 1);
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
      edt: false,
      // 活动发布日期
      pdt: false
    };

    // 选择渠道
    $scope.toggleActivityWay = function(item) {
      var idx = $scope.activity.channel.indexOf(item);
      if (idx > -1) {
        $scope.activity.channel.splice(idx, 1);
      } else {
        $scope.activity.channel.push(item);
      }
      $scope.activity.channel = $filter('orderBy')($scope.activity.channel);
    }

    $scope.onsetTime = function (newT, oldT, n) {
      if (n === 'endTime') {
        newT.setSeconds(59);
      }
      $scope.activity[n] = $filter('date')(newT, 'yyyy-MM-dd HH:mm:ss');
    }

    $scope.nextStep = function(form) {
      $scope.invalidChannel  = false;
      $scope.invalidTimeInterval = false;
      $scope.invalidDeliveryTime = false;
      var startTime,endTime;
      // 表单验证
      if (form.$invalid) {
        form.name.$dirty = true;
        form.startTime.$dirty = true;
        form.endTime.$dirty = true;
        form.deliveryTime.$dirty = true;
        return;
      } else {
        var _reTimeReg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
        if (!_reTimeReg.test($scope.activity.startTime)) {
          form.startTime.$invalid = true;
          form.startTime.$dirty = true;
          return;
        }
        if (!_reTimeReg.test($scope.activity.endTime)) {
          form.endTime.$invalid = true;
          form.endTime.$dirty = true;
          return;
        }
        startTime = new Date($scope.activity.startTime).getTime();
        endTime = new Date($scope.activity.endTime).getTime();
        if (startTime >= endTime) {
          form.startTime.$invalid = true;
          form.endTime.$invalid = true;
          $scope.invalidTimeInterval = true;
          return;
        }

        // 渠道验证
        if ($scope.activity.channel.length === 0) {
          $scope.invalidChannel = true;
          return;
        }
      }
      // 将Date转化成毫秒
      // var fomart = 'yyyy-MM-dd HH:mm:ss';
      var formartWidthouttime = 'yyyy-MM-dd';
      // $scope.activity.startTime = $filter('date')($scope.activity.startTime, fomart);
      // $scope.activity.endTime = $filter('date')($scope.activity.endTime, fomart);
      if (parseInt($scope.activity.reqParams.actType) === 1) {
        delete $scope.activity.reqParams.deliveryTime;
      } else {
        if (new Date($scope.activity.reqParams.deliveryTime).getTime() <= endTime) {
          $scope.invalidDeliveryTime = true;
          form.deliveryTime.$invalid = true;
          return;
        }
        $scope.activity.reqParams.deliveryTime = $filter('date')($scope.activity.reqParams.deliveryTime, formartWidthouttime);
      }
      // 服务端验证
      $scope.activity.toolId = 12000;
      $scope.activity.step = 1;
      var avt = angular.copy($scope.activity);
      delete avt.reqParams.items;
      delete avt.createTime;
      delete avt.lastModify;
      httpService.post('aa/validateByStep', avt)
        .then(function(res) {
          if (res) {
            $scope.activity.enable = $scope.activity.enable === 'true' ? true : false;
            $scope.activity.reqParams.actType = parseInt($scope.activity.reqParams.actType);
            $scope.activity.reqParams.payType = parseInt($scope.activity.reqParams.payType);
            // 储存到本地
            $localStorage.activity = $scope.activity;
            // 跳转到选择货物
            $location.path('/activity/goods');
          }
        });

    }
  });
