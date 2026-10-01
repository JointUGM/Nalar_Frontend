export const nextYear = '2027/2028'

const copyRanges = [{ grade: 7, last: 'G' }, { grade: 8, last: 'G' }, { grade: 9, last: 'F' }]

export const copyClassCount = copyRanges.reduce((total, range) => total + range.last.charCodeAt(0) - 64, 0)
export const copyRangeLabel = copyRanges.map((range) => `${range.grade}A–${range.grade}${range.last}`).join(', ')
