'use strict';

describe('Controller: BatchsetpriceCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var BatchsetpriceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BatchsetpriceCtrl = $controller('BatchsetpriceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BatchsetpriceCtrl.awesomeThings.length).toBe(3);
  });
});
