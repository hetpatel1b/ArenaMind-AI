import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    files: ["src/lib/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["@/lib/repositories/*", "@/lib/services/*", "@/app/*", "@prisma/client"], message: "Domain layer cannot depend on external layers or ORMs." }]
      }]
    }
  },
  {
    files: ["src/lib/repositories/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["@/lib/services/*", "@/app/*"], message: "Repository layer cannot depend on Service or App layers." }]
      }]
    }
  },
  {
    files: ["src/lib/services/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["@/app/*", "next/*", "react"], message: "Service layer cannot depend on UI or Route frameworks." }]
      }]
    }
  }
]);

export default eslintConfig;
