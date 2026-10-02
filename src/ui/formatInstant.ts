// The backend sends instants with an offset; every screen shows them in WIB.
const day = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
const dayTime = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })

export const formatDay = (iso: string) => day.format(new Date(iso))
export const formatDayTime = (iso: string) => `${dayTime.format(new Date(iso))} WIB`
