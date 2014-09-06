'use strict';

describe('Service: outCom', function () {

  // load the service's module
  beforeEach(module('anvil2App'));

  // instantiate service
  var outCom;
  beforeEach(inject(function (_outCom_) {
    outCom = _outCom_;
  }));

  it('should do something', function () {
    expect(!!outCom).toBe(true);
  });

});
