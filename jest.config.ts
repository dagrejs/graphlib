import type {Config} from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/test/**/*.ts"],
    collectCoverageFrom: ["lib/**/*.ts"],
    testPathIgnorePatterns: ["/test/alg/utils/"],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                strict: true,
                esModuleInterop: true,
                module: 'commonjs'
            },
            useESM: false
        }]
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node']
};

export default config;
