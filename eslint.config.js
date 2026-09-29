import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const forbidImports = (layers) => ['error', {
  patterns: [
    { group: layers.flatMap((layer) => [`@/${layer}`, `@/${layer}/**`, `@/${layer}.*`]), message: 'Follow the layer boundaries in docs/project_structure.md.' },
    { group: ['../**'], message: 'Use @/ imports across folders so architecture rules can check them.' },
    { group: ['react', 'react/**', 'react-dom', 'react-dom/**', 'react-router', 'react-router/**', 'vite', 'vitest'], message: 'Keep framework dependencies outside the core layers (tests are exempt).' },
  ],
}]

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  { files: ['**/*.{js,mjs}'], languageOptions: { globals: globals.node } },
  {
    files: ['src/domain/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: { 'no-restricted-imports': forbidImports(['application', 'infrastructure', 'ui', 'di', 'review-di']) },
  },
  {
    files: ['src/application/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: { 'no-restricted-imports': forbidImports(['infrastructure', 'ui', 'di', 'review-di']) },
  },
  {
    files: ['src/{domain,application}/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: { 'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'sessionStorage', 'fetch'] },
  },
  {
    files: ['src/infrastructure/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@/ui', '@/ui/**', '@/di', '@/di.*', '@/review-di', '@/review-di.*', '../**'] }] },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.test.tsx'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@/infrastructure', '@/infrastructure/**', '@/di', '@/di.*', '@/review-di', '@/review-di.*', '../**'] }] },
  },
)
