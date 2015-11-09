'use strict';

describe('Controller: PromotiongoodsCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var PromotiongoodsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotiongoodsCtrl = $controller('PromotiongoodsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PromotiongoodsCtrl.awesomeThings.length).toBe(3);
  });
});
