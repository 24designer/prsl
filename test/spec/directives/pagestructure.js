'use strict';

describe('Directive: pageStructure', function () {

  // load the directive's module
  beforeEach(module('presellFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<page-structure></page-structure>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the pageStructure directive');
  }));
});
