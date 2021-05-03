module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['node_modules'],
    setupFilesAfterEnv: ['jest-extended'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
}
