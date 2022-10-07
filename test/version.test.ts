import { version } from "../lib/version";

describe('version', function() {
  it('should match the version from package.json', function() {
    var packageVersion = require('../package').version;
    expect(version).toEqual(packageVersion);
  });
});
