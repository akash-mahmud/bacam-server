module.exports = {
    displayName: "unit",
    testMatch: ["**/__tests__/**/unit/**/*"],
    setupFiles: ["dotenv/config", "./jest.setup.js"],
    "moduleNameMapper": {
        '^@/(.*)$': '<rootDir>/src/$1'
    },

    preset: "ts-jest",
    testEnvironment: "node",
    clearMocks: true,

};