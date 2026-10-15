// The backend sends instants with an offset; every screen shows them in WIB.
const day = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
const dayTime = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })

export const formatDay = (iso: string) => day.format(new Date(iso))
export const formatDayTime = (iso: string) => `${dayTime.format(new Date(iso))} WIB`

const time = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Jakarta' })
export const formatTime = (iso: string) => `${time.format(new Date(iso))} WIB`
export const formatToday = () => today.format(new Date())

const relative = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' })
// "dalam 20 menit", "dalam 5 jam", "besok", "dalam 3 hari", "2 hari yang lalu".
export const formatRelative = (iso: string, now = Date.now()) => {
  const hours = (new Date(iso).getTime() - now) / 36e5
  if (Math.abs(hours) < 1) return relative.format(Math.round(hours * 60), 'minute')
  return Math.abs(hours) < 24 ? relative.format(Math.round(hours), 'hour') : relative.format(Math.round(hours / 24), 'day')
}

const dayNumber = new Intl.DateTimeFormat('id-ID', { day: 'numeric', timeZone: 'Asia/Jakarta' })
const monthShort = new Intl.DateTimeFormat('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' })
export const formatDateBlock = (iso: string) => ({ day: dayNumber.format(new Date(iso)), month: monthShort.format(new Date(iso)) })
