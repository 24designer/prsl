'use strict';

describe('Controller: AddCtrl', function () {

  // load the controller's module
  beforeEach(module('presellFrontendApp'));

  var AddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddCtrl = $controller('AddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddCtrl.awesomeThings.length).toBe(3);
  });
});
