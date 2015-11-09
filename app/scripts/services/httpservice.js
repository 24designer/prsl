'use strict';

/**
 * @ngdoc service
 * @name presellFrontendApp.HttpService
 * @description
 * # HttpService
 * Service in the presellFrontendApp.
 */
angular.module('presellFrontendApp')
  .service('httpService', function ($http, $q, authService, $rootScope, usSpinnerService) {
    // var baseUrl = 'http://121.40.211.233:8867/ump/';
    // var baseUrl = 'http://114.215.197.33:8867/ump/';
    // var baseUrl = 'http://10.37.116.228:8080/hitao-ump-center/';
    var baseUrl =  'http://ump.hitao.top/ump/'
    this.post = function(method, params) {
      var url = baseUrl + method;
      var d = $q.defer();
      usSpinnerService.spin('spinner-1');
      console.log('-------------请求参数-----------');
      console.log(params);
      $http({
       url: url,
       method: 'POST',
       params: params,
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
      }).success(
        function(response) {
          usSpinnerService.stop('spinner-1');
          console.log('-------------无异常返回结果-----------');
          console.log(response);
          d.resolve(response);
        }
      ).error(
        function() {
          usSpinnerService.stop('spinner-1');
          d.resolve(false);
        }
      );
      return d.promise;
    }

    this.request = function(method, params) {
      var url = baseUrl + method;
      var d = $q.defer();
      usSpinnerService.spin('spinner-1');
      console.log('-------------请求参数-----------');
      console.log(params);
      $http({
       url: url,
       method: 'GET',
       params: params,
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
      }).success(
        function(response) {
          usSpinnerService.stop('spinner-1');
          console.log('-------------无异常返回结果-----------');
          console.log(response);
          d.resolve(response);
        }
      ).error(
        function() {
          usSpinnerService.stop('spinner-1');
          d.resolve(false);
        }
      );
      return d.promise;
    };

  });
