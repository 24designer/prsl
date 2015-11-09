'use strict';

describe('Directive: smartFloat', function () {

  // load the directive's module
  beforeEach(module('presellFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<smart-float></smart-float>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the smartFloat directive');
  }));
});
