'use strict';

describe('Controller: PromotionbaseCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var PromotionbaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionbaseCtrl = $controller('PromotionbaseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PromotionbaseCtrl.awesomeThings.length).toBe(3);
  });
});
