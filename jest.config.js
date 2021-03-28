module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  collectCoverageFrom : ['packages/**/*.ts'],
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  }
};
