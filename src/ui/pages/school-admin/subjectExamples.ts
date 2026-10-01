export interface SubjectExample { id: string; name: string; cp: string | null; kbOwner: string | null }

export const unmappedLabel = 'Belum dipetakan'
const cpLabel = (name: string) => `${name} · CP BSKAP 046/2025 · Fase D`

export const cpOptions = ['IPA', 'Matematika', 'Bahasa Indonesia', 'IPS', 'Informatika'].map(cpLabel)

export const subjectExamples: readonly SubjectExample[] = [
  { id: 'ipa', name: 'IPA', cp: cpLabel('IPA'), kbOwner: 'Sari Wulandari' },
  { id: 'matematika', name: 'Matematika', cp: cpLabel('Matematika'), kbOwner: null },
  { id: 'bahasa-indonesia', name: 'Bahasa Indonesia', cp: cpLabel('Bahasa Indonesia'), kbOwner: null },
  { id: 'ips', name: 'IPS', cp: cpLabel('IPS'), kbOwner: 'Hari Purnomo' },
  { id: 'informatika', name: 'Informatika', cp: null, kbOwner: null },
]

export function knowledgeBaseLabel(subject: SubjectExample): string { return subject.kbOwner ?? (subject.cp ? 'Belum ada' : '—') }
