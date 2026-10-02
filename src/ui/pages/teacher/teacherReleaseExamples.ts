import { studentNames } from './teacherSessionExamples'

// Supplied "Rilis ke orang tua" sample: the first twelve students of the shared roster. Fictional; it holds no parent names or contacts.
export const releaseExample = {
  closed: 'ditutup 21 Sep',
  students: studentNames.slice(0, 12),
  // Indexes into `students` that have not finished, so they have no summary to release.
  unfinished: [4, 9] as readonly number[],
}

/** Fixed example wording for what a parent sees: two templates, alternating by student. No score, flag or comparison. */
export function releaseSummary(name: string, index: number): { text: string; home: string } {
  const first = name.split(' ')[0]
  return index % 2
    ? { text: `${first} awalnya berpikir dorongan bisa habis, lalu mengubah pendapatnya sendiri setelah memikirkan contoh pesawat luar angkasa. Ia sudah bisa menyebut gaya yang melawan gerak benda.`, home: `Gelindingkan bola di lantai dan di karpet. Minta ${first} menjelaskan bedanya.` }
    : { text: `Dalam misi ini, ${first} menjelaskan dengan jelas bahwa gesekan membuat benda melambat. Ia masih mengembangkan pemahaman tentang kelembaman.`, home: 'Dorong troli belanja lalu lepaskan. Tanyakan kenapa troli itu masih bergerak sebentar.' }
}
