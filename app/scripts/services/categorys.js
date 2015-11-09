'use strict';

/**
 * @ngdoc service
 * @name presellFrontendApp.Categorys
 * @description
 * # Categorys
 * Service in the presellFrontendApp.
 */
angular.module('presellFrontendApp')
  .service('Categorys', function (httpService, $q) {
    var defer = $q.defer(), c;

    this.categorys = function() {
      if (c) {
        defer.resolve(c);
      } else {
        httpService.request('aa/getCat', {})
          .then(function(response) {
            c = response
            defer.resolve(c);
          });
      }
      return defer.promise;
    }
  });
