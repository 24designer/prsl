'use strict';

describe('Controller: PromotionfinishCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var PromotionfinishCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionfinishCtrl = $controller('PromotionfinishCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PromotionfinishCtrl.awesomeThings.length).toBe(3);
  });
});
