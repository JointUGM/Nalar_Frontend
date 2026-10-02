// These role screens exist today as example-data review pages, so an authorized role path opens its review page.
// A role leaves this list when it gets real pages (parent, student and teacher have theirs under ui/pages/<role>/app).
const reviewDashboards: Readonly<Record<string, string>> = {
  platform: '/review/platform/schools',
  school: '/review/school/people',
}

export function devDashboardPath(rolePath: string): string | null {
  return reviewDashboards[rolePath.split('/')[1]] ?? null
}
