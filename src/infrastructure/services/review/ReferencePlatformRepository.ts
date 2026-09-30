import type { PlatformRepository } from '@/domain/services/PlatformRepository'
import type { PlatformOverview } from '@/domain/model/platform/School'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'

export class ReferencePlatformRepository implements PlatformRepository {
  async getOverview(query: string, cursor: string | null): Promise<PlatformOverview> {
    const schools = [
      { id: 'yogyakarta', name: 'SMPN 5 Yogyakarta', city: 'Kota Yogyakarta', npsn: '20403211', admin: 'Hendra Santoso', users: 1183, status: 'active' as const },
      { id: 'sleman', name: 'SMP Muhammadiyah 2', city: 'Kab. Sleman', npsn: '20401877', admin: 'Nur Azizah', users: 846, status: 'active' as const },
      { id: 'bantul', name: 'SMPN 3 Bantul', city: 'Kab. Bantul', npsn: '20400932', admin: 'Andi Setiawan', users: 1383, status: 'active' as const },
      { id: 'semarang', name: 'SMPN 12 Semarang', city: 'Kota Semarang', npsn: '20328914', admin: 'operator@smpn12smg…', users: 0, status: 'invited' as const },
    ]
    const term = query.toLocaleLowerCase('id-ID')
    const matching = schools.filter((school) => `${school.name} ${school.city} ${school.npsn}`.toLocaleLowerCase('id-ID').includes(term))
    const parsed = cursor?.match(/^review:(\d+)$/)
    const offset = parsed ? Number(parsed[1]) : 0
    const start = Number.isSafeInteger(offset) && offset >= 0 ? offset : 0
    const page = matching.slice(start, start + 2)
    return {
      summary: { activeSchools: 3, users: 3412, curriculum: '046/2025' },
      schools: page,
      nextCursor: start + page.length < matching.length ? `review:${start + page.length}` : null,
    }
  }

  async getCurriculum(): Promise<CurriculumCatalog> {
    return {
      versions: [
        { id: '2025', name: 'BSKAP 046/2025', published: '2 Jan 2026', schools: 3, current: true },
        { id: '2024', name: 'BSKAP 032/2024', published: '15 Jul 2024', schools: 0, current: false },
      ],
      reference: { title: 'IPA · Fase D · BSKAP 046/2025', outcomes: [
        { concept: 'Gaya', statement: 'Mengidentifikasi dan menjelaskan pengaruh gaya pada gerak benda dalam kehidupan sehari-hari.' },
        { concept: 'Tekanan zat', statement: 'Menjelaskan tekanan pada zat padat, cair, dan gas serta penerapannya.' },
        { concept: 'Getaran', statement: 'Mendeskripsikan getaran dan gelombang serta sifat-sifatnya.' },
        { concept: 'Usaha dan energi', statement: 'Menghubungkan usaha, energi, dan daya dalam sistem sederhana.' },
      ] },
    }
  }
}
