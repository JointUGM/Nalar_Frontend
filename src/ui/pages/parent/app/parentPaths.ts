export const parentPaths = {
  home: '/parent/home',
  reflections: '/parent/reflections',
  reflection: (sessionId: string) => `/parent/reflections/${sessionId}`,
  settings: '/parent/settings',
} as const
