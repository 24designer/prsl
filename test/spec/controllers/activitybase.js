'use strict';

describe('Controller: ActivitybaseCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var ActivitybaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivitybaseCtrl = $controller('ActivitybaseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivitybaseCtrl.awesomeThings.length).toBe(3);
  });
});
