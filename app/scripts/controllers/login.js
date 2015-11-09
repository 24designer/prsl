'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:LoginCtrl
 * @description 登陆 Controller
 * # LoginCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('LoginCtrl', function ($scope, httpService) {
    $scope.login = function(form) {
      if (form.userName.$invalid) {
        form.userName.$dirty = true;
        $scope.message = '登陆名不能为空';
        return;
      }

      if (form.pwd.$invalid) {
        form.pwd.$dirty = true;
        $scope.message = '密码不能为空';
        return;
      }
      $scope.message = '';
      httpService.post('login', {userName: $scope.userName, pwd: $scope.pwd})
        .then(function(response) {
          if (!response) {
            $scope.message = '用户名或者密码错误';
          }
        });
    }
  });
