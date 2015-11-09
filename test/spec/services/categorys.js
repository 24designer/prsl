'use strict';

describe('Service: Categorys', function () {

  // load the service's module
  beforeEach(module('presellFrontendApp'));

  // instantiate service
  var Categorys;
  beforeEach(inject(function (_Categorys_) {
    Categorys = _Categorys_;
  }));

  it('should do something', function () {
    expect(!!Categorys).toBe(true);
  });

});
