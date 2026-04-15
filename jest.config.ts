import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/*.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // for your alias "@/..."
  },

  clearMocks: true,

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],    

  coverageDirectory: "coverage",

  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.test.ts",
    "!src/**/*.d.ts",
  ],
};

export default config;