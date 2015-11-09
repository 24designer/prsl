'use strict';

describe('Service: HttpService', function () {

  // load the service's module
  beforeEach(module('presellFrontendApp'));

  // instantiate service
  var HttpService;
  beforeEach(inject(function (_HttpService_) {
    HttpService = _HttpService_;
  }));

  it('should do something', function () {
    expect(!!HttpService).toBe(true);
  });

});
