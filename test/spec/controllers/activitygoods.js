'use strict';

describe('Controller: ActivitygoodsCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var ActivitygoodsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivitygoodsCtrl = $controller('ActivitygoodsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivitygoodsCtrl.awesomeThings.length).toBe(3);
  });
});
