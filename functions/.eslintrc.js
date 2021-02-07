module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
  ],
  rules: {
    "import/prefer-default-export": "off",
    "prop-type": "off",
    quotes: ["warn", "double"],
    "no-use-before-define": "off",
    "comma-dangle": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-unused-vars": "warn",
    "object-curly-newline": "off",
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "warn",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
};
