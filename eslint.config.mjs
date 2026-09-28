import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/features/**/domain/**/*.ts",
      "src/features/**/application/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react",
                "react/*",
                "next",
                "next/*",
                "@supabase/*",
                "**/infrastructure/*",
                "**/presentation/*",
                "@/composition/*",
              ],
              message:
                "Inner layers depend on domain models and repository ports only.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/presentation/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/*", "@supabase/*"],
              message:
                "Use application services supplied by the composition root.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react",
                "react/*",
                "next",
                "next/*",
                "@supabase/*",
                "**/application/*",
                "**/infrastructure/*",
                "**/presentation/*",
                "@/composition/*",
                "@/shared/ui/*",
                "@/shared/auth/*",
                "@/shared/http/*",
              ],
              message:
                "Domain models may depend only on pure code and schema validation.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
