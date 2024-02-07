/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'rollup-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverage: false,
    "transform": {
        "\\.ts$": [
            "rollup-jest",
            {
                "configFile": "./rollup.config.ts",
                "configPlugin": "typescript={target: \"es2022\", module: \"esnext\", moduleResolution: \"bundler\", isolatedModules: true, noEmit: true}"
            },
            "--resolveJsonModule"
        ],
        "\\.tsx$": [
            "rollup-jest",
            {
                "configPlugin": "typescript={target: \"es2022\", module: \"esnext\", moduleResolution: \"bundler\", isolatedModules: true, noEmit: true}",
                "configFile": "./rollup.config.ts"
            },
            "--resolveJsonModule",
            "--jsx"
        ]
    },
};