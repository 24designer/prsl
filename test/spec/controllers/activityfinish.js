'use strict';

describe('Controller: ActivityfinishCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var ActivityfinishCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityfinishCtrl = $controller('ActivityfinishCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivityfinishCtrl.awesomeThings.length).toBe(3);
  });
});
