'use strict';

describe('Service: inCom', function () {

  // load the service's module
  beforeEach(module('anvil2App'));

  // instantiate service
  var inCom;
  beforeEach(inject(function (_inCom_) {
    inCom = _inCom_;
  }));

  it('should do something', function () {
    expect(!!inCom).toBe(true);
  });

});
