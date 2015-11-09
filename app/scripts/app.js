'use strict';

/**
 * @ngdoc overview
 * @name presellFrontendApp
 * @description
 * # presellFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('presellFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'http-auth-interceptor',
    'ui.bootstrap',
    'ng-sortable',
    'ngStorage',
    'ngFileUpload',
    'angularSpinner',
    'ui.bootstrap.datetimepicker'
  ])
  .config(function ($locationProvider, $httpProvider) {
    // url html5 hash处理
    $locationProvider.html5Mode(true);
    // 跨域
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .run(function($rootScope) {
    // 跳转页面的同时广播事件，用于隐藏异常信息.
    $rootScope.$on('$routeChangeStart', function($location) {
      $rootScope.$broadcast('event:route-changed');
    })
  });
