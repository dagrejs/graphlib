module.exports = {
  // Use jsdom for any browser-like behavior (optional, may not be needed)
  // testEnvironment: 'jsdom', 

  // Look for test files ending in .test.js or .spec.js inside the test directory
  testMatch: [
    "**/test/**/*.js"
  ],

  // Collect coverage from files in the lib/ directory
  collectCoverageFrom: [
    "lib/**/*.js"
  ],
  
  // Ignore specific files/directories from coverage
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/"
  ],

  testPathIgnorePatterns: ["/test/alg/utils/"],

  // Setup to handle module resolution if needed (for cjs tests)
  moduleFileExtensions: ['js', 'json', 'node'],
};