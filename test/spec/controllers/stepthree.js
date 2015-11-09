'use strict';

describe('Controller: StepthreeCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var StepthreeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StepthreeCtrl = $controller('StepthreeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StepthreeCtrl.awesomeThings.length).toBe(3);
  });
});
