'use strict';

describe('Service: publicOutCom', function () {

  // load the service's module
  beforeEach(module('anvil2App'));

  // instantiate service
  var publicOutCom;
  beforeEach(inject(function (_publicOutCom_) {
    publicOutCom = _publicOutCom_;
  }));

  it('should do something', function () {
    expect(!!publicOutCom).toBe(true);
  });

});
