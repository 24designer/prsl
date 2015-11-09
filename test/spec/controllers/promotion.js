'use strict';

describe('Controller: PromotionCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var PromotionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionCtrl = $controller('PromotionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PromotionCtrl.awesomeThings.length).toBe(3);
  });
});
