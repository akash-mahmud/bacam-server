import type { Config } from 'jest';
const config: Config = {
  projects: [
    "<rootDir>/jest.unit.config.js",
    "<rootDir>/jest.integration.config.js",
  ],

  setupFiles: ["dotenv/config", "./jest.setup.js"],

  "moduleNameMapper": {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

};
module.exports = config;
