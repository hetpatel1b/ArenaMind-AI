import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

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
      ...jsxA11y.flatConfigs.recommended.rules,
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/mouse-events-have-key-events": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/aria-role": "off",
      "jsx-a11y/interactive-supports-focus": "off",
      "no-console": "error",
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error"
    }
  },
  {
    files: ["scripts/**/*.js", "scripts/**/*.ts", "load-tests/**/*.js", "prisma/**/*.ts", "*.js"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
      "import/no-anonymous-default-export": "off"
    }
  },
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "prefer-const": "off",
      "@typescript-eslint/ban-ts-comment": "off"
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
