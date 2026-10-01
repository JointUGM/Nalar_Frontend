const paths = {
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  link: <><path d="m10 13 4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 9l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" /></>,
  layers: <path d="m12 3 10 5-10 5L2 8zm-10 9 10 5 10-5M2 16l10 5 10-5" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 11h18" /></>,
  school: <path d="M3 20.5h18M5 20.5V10l7-5 7 5v10.5M10 20.5v-5h4v5" />,
  book: <><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z" /><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  bell: <><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  logout: <><path d="M14 4h5.5v16H14" /><path d="M9.5 8 5.5 12l4 4M5.5 12H16" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  upload: <><path d="M12 15.5V4M7 8.5l5-4.5 5 4.5" /><path d="M4 15v4.5h16V15" /></>,
  more: <><circle cx="5.5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="18.5" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
  swap: <path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5" />,
  pause: <path d="M9 6v12M15 6v12" />,
  home: <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-5h4v5" />,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  graph: <path d="M4 4v16h16M8 16v-5M12 16V8M16 16v-3" />,
  alert: <><path d="M12 4 21 19H3z" /><path d="M12 10v4M12 16.5v.5" /></>,
  key: <><circle cx="8" cy="15" r="3.5" /><path d="m10.5 12.5 9-9M16 7l3 3" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  play: <path d="M7 5v14l12-7z" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  idea: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
}

export type IconName = keyof typeof paths

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>{paths[name]}</svg>
}
