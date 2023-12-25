/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'rollup-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverageFrom: [
        'packages/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/node_modules/**',
        '!src/**/vendor/**',
    ],
    "transform": {
        "\\.ts$": [
            "rollup-jest",
            {
                "configFile": "./rollup.config.ts",
                "configPlugin": "@rollup/plugin-typescript"
            },
            "--resolveJsonModule"
        ],
        "\\.tsx$": [
            "rollup-jest",
            {
                "configPlugin": "@rollup/plugin-typescript",
                "configFile": "./rollup.config.ts",
            },
            "--resolveJsonModule",
            "--jsx"
        ]
    },
};
