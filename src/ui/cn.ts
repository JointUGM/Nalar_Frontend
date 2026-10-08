import { extendTailwindMerge } from 'tailwind-merge'

// The custom tokens in index.css's @theme must be registered, or `text-meta text-ink` reads as two colors and one is dropped.
// In Tailwind v4 a font size never overrides `leading-*` (sizes read --tw-leading first), so a size must not remove an earlier leading.
const merge = extendTailwindMerge({
  override: {
    conflictingClassGroups: { 'font-size': [] },
  },
  extend: {
    theme: {
      text: ['meta', 'body', 'student', 'panel'],
      shadow: ['card', 'dialog', 'student'],
      font: ['ui', 'reading'],
      radius: ['button', 'input', 'card', 'student-input', 'student-card', 'pill'],
    },
  },
})

/** Joins class names, skipping falsy ones; when two Tailwind utilities conflict, the later one wins (`cn('p-4', 'p-2')` is `p-2`). */
export const cn = merge
