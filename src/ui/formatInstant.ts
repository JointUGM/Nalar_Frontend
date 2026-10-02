// The backend sends instants with an offset; every screen shows them in WIB.
const day = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
const dayTime = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })

export const formatDay = (iso: string) => day.format(new Date(iso))
export const formatDayTime = (iso: string) => `${dayTime.format(new Date(iso))} WIB`

const time = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Jakarta' })
export const formatTime = (iso: string) => `${time.format(new Date(iso))} WIB`
export const formatToday = () => today.format(new Date())
