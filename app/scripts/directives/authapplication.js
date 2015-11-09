'use strict';

/**
 * @ngdoc directive
 * @name presellFrontendApp.directive:authApplication
 * @description 检测用户是否登陆. 设置导航栏选中项
 * # authApplication
 */
angular.module('presellFrontendApp')
  .directive('authApplication', function ($location) {
    return {
      restrict: 'C',
      link: function postLink(scope, element) {
        var login = element.find('.login-holder');
        var container = element.find('.container-fluid');
        var error = container.find('.system-error');
        var hasError = false;
        var navs = $('.navbar-nav li');

        scope.$on('event:auth-loginRequired', function(obj, data) {
          container.hide();
          login.slideDown('slow');
        });
        scope.$on('event:auth-loginConfirmed', function() {
          container.show();
          login.hide();
          if (!hasError) error.addClass('hidden');
          hasError = false;
        });

        scope.$on('event:system-error', function(obj, data) {
          hasError = true;
          error.html('系统出现异常......').removeClass('hidden');
          $("body").animate({ scrollTop: $('.navbar').offset().top }, 'fast');
        });

        scope.$on('event:params-error', function(obj, data) {
          hasError = true;
          error.html(data).removeClass('hidden');
          $("body").animate({ scrollTop: $('.navbar').offset().top }, 'fast');
        });

        scope.$on('event:route-changed', function() {
          // 当route发生改变时 自动改变导航栏的选中状态.
          if ($location.$$url === '/' || $location.$$url.indexOf('activity') !== -1) {
            $(navs[0]).addClass('active').next().removeClass('active');
          } else {
            $(navs[0]).removeClass('active').next().addClass('active');
          }
          // 移除错误信息.
          error.addClass('hidden');
        });
      }
    };
  });
