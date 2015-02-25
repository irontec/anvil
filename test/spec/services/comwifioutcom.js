'use strict';

describe('Service: comwifioutcom', function () {

  // load the service's module
  beforeEach(module('anvil2App'));

  // instantiate service
  var comwifioutcom;
  beforeEach(inject(function (_comwifioutcom_) {
    comwifioutcom = _comwifioutcom_;
  }));

  it('should do something', function () {
    expect(!!comwifioutcom).toBe(true);
  });

});
