module.exports = {
  root: true,
  parser: "babel-eslint", // Use this for JavaScript
  extends: [
    "next",
    "next/core-web-vitals"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    // Add custom rules if needed
  }
};