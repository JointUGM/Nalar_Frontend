const dayKey = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Jakarta' })
const weekdayDay = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })

// Days are counted on the Jakarta calendar, whatever the computer's clock says.
export function dayLabel(iso: string, now = new Date()) {
  const gap = Math.round((Date.parse(dayKey.format(new Date(iso))) - Date.parse(dayKey.format(now))) / 86_400_000)
  return gap === 0 ? 'Hari ini' : gap === 1 ? 'Besok' : gap === -1 ? 'Kemarin' : weekdayDay.format(new Date(iso)).replace('.', '')
}
