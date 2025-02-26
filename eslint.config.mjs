import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "next/core-web-vitals",
      "next/typescript",
      "prettier",
      "plugin:n/recommended",
      "plugin:tailwindcss/recommended",
    ],
    plugins: ["tailwindcss"],
    rules: {
      quotes: ["error", "double"],
      "max-len": ["error", { code: 88 }],
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "n/no-missing-import": "off",
      "n/no-extraneous-import": "off",
      "n/no-process-env": "error",
      "n/no-unsupported-features/node-builtins": "off",
    },
    ignorePatterns: [".next/", "node_modules/"],
  }),
]

export default eslintConfig
