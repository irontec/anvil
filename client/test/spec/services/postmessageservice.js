'use strict';

describe('Service: postMessageService', function () {

  // load the service's module
  beforeEach(module('anvil2App'));

  // instantiate service
  var postMessageService;
  beforeEach(inject(function (_postMessageService_) {
    postMessageService = _postMessageService_;
  }));

  it('should do something', function () {
    expect(!!postMessageService).toBe(true);
  });

});
