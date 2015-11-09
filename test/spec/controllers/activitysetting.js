'use strict';

describe('Controller: ActivitysettingCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var ActivitysettingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivitysettingCtrl = $controller('ActivitysettingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivitysettingCtrl.awesomeThings.length).toBe(3);
  });
});
