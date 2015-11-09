'use strict';

/**
 * @ngdoc directive
 * @name presellFrontendApp.directive:tableSorter
 * @description table排序
 * # tableSorter
 */
angular.module('presellFrontendApp')
  .directive('tableSorter', function () {
    return {
      templateUrl: 'views/tablesorter.html',
      restrict: 'E',
      replace: true,
      scope: {
        sortBy: '&',
        sorts: '=',
        sort: '=',
      },
      link: function postLink(scope, iAttr) {
        scope.goSort = function(s) {
          if (s.value === scope.sort) s.desc = !s.desc;
          scope.sortBy({sort: s});
        }
      }
    };
  });
