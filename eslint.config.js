import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] }, // Ignore the 'dist' folder
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended], // Extend recommended rules
    files: ["**/*.{ts,tsx}"], // Apply only to TypeScript files
    languageOptions: {
      ecmaVersion: 2020, // Use modern ECMAScript version
      globals: globals.browser, // Use browser-specific globals if necessary
    },
    rules: {
      "no-unused-vars": ["warn"], // Warn for unused variables
      "no-console": ["warn"], // Warn for console statements
      "@typescript-eslint/no-unused-vars": ["error"], // Error for unused vars in TypeScript
      "@typescript-eslint/no-explicit-any": ["warn"], // Warn for 'any' type usage
      "@typescript-eslint/explicit-function-return-type": ["warn"], // Warn if function return types are not defined
    },
  }
);
