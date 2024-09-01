module.exports = {
    displayName: "integration",
    testMatch: ["**/__tests__/**/integration/**/*"],
    setupFiles: ["dotenv/config", "./jest.setup.js"],
    "moduleNameMapper": {
        '^@/(.*)$': '<rootDir>/src/$1'
    },

    preset: "ts-jest",
    testEnvironment: "node",
    clearMocks: true,

};
