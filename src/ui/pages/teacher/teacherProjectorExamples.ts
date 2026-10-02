import { studentNames } from './teacherSessionExamples'

// Supplied projector sample. The code, address and arrivals are fictional and simulated; no session exists.
export const projectorExample = {
  joinCode: ['K', '7', 'Q', '2', 'M', 'W'],
  joinAddress: 'nalar.id/gabung',
  initialJoined: 3,
  joinStepMs: 1200,
  // First names only: the projector shows no surnames, answers, scores or notes.
  firstNames: studentNames.map((name) => name.split(' ')[0]),
}
