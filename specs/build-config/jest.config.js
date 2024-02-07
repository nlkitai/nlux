/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'rollup-jest',
    testEnvironment: 'jsdom',

    // Since this is meant to run from dist/specs, the path is relative to that location
    // where a jest.setup.js file will be found.
    setupFilesAfterEnv: ['./jest.setup.js'],

    collectCoverage: false,

    // No transformations are needed since the dist/specs directory already
    // contains the transpiled files.
    transform: {},
};
