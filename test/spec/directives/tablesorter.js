'use strict';

describe('Directive: tableSorter', function () {

  // load the directive's module
  beforeEach(module('presellFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<table-sorter></table-sorter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tableSorter directive');
  }));
});
