'use strict';

describe('Controller: ActivityCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var ActivityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityCtrl = $controller('ActivityCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivityCtrl.awesomeThings.length).toBe(3);
  });
});
