'use strict';

describe('Controller: PresellCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var PresellCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PresellCtrl = $controller('PresellCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PresellCtrl.awesomeThings.length).toBe(3);
  });
});
