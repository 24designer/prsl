'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:BatchsetpriceCtrl
 * @description
 * # BatchsetpriceCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('BatchsetpriceCtrl', function ($scope, $modalInstance, promotion, channels) {
    $scope.type = promotion.reqParams.setType ? promotion.reqParams.setType + '' : '0';
    $scope.channels = channels;
    $scope.unitePrices = {
      unitePcPrice: promotion.reqParams.unitePcPrice ? promotion.reqParams.unitePcPrice : undefined,
      uniteAppPrice: promotion.reqParams.uniteAppPrice ? promotion.reqParams.uniteAppPrice : undefined,
      uniteH5Price: promotion.reqParams.uniteH5Price ? promotion.reqParams.uniteH5Price : undefined
    };
    $scope.maxNumber = 0.99;
    $scope.minNumber = 0.01;
    $scope.logic = '0';
    if ($scope.type === '2') {
      if (promotion.reqParams && promotion.reqParams.quota) {
        var quota = promotion.reqParams.quota;
        if (quota < 0) {
          $scope.quota0 = -quota;
        } else {
          $scope.quota1 = quota;
          $scope.logic = '1';
        }
      }
    }

    $scope.ok = function() {
      var result = {
        setType: parseInt($scope.type),
      };
      if (result.setType === 1) {
        result.unitePcPrice = $scope.unitePrices.unitePcPrice;
        result.uniteAppPrice = $scope.unitePrices.uniteAppPrice;
        result.uniteH5Price = $scope.unitePrices.uniteH5Price;
      } else if(result.setType === 2) {
        result.quota = $scope.logic === '0' ? -$scope.quota0 : $scope.quota1;
      }
      $modalInstance.close(result);
    }
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    }
  });
