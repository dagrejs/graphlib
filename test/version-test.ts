import {version} from '../lib';

describe('version', () => {
    it('should match the version from package', async () => {
        const packageJson = await import('../package.json', {assert: {type: 'json'}});
        const packageVersion = packageJson.default.version;
        expect(version).toBe(packageVersion);
    });
});
