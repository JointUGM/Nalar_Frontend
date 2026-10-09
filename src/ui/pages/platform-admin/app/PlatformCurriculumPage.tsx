import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/platform-admin/Platform.styles'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty } from '@/ui/components/nala/NalaState'

import { Nala } from '@/ui/components/nala/Nala'

const day = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })
export function PlatformCurriculumPage({ service }: { service: PlatformAdminUseCases }) {
  const read = useCallback((signal: AbortSignal) => service.curriculumVersions(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [params] = useSearchParams()
  const [chosen, setChosen] = useState(params.get('v') ?? '')
  const versionId = chosen || data?.find((item) => item.is_current)?.id || data?.[0]?.id || ''

  return <div className={styles.content}>
    <div className={styles.welcome}>
      <div className={styles.welcomeCopy}>
        <h1>Capaian Pembelajaran nasional</h1>
        <p>Versi baru tidak mengubah pemetaan CP sekolah yang sudah ada. Kelola standar fase dan capaian belajar siswa.</p>
        <div className={styles.welcomeActions}>
          <Link to="/platform/references?upload=curriculum" className={styles.linkButton}>
            <Icon name="upload" size={16} />
            <span>Unggah PDF CP resmi</span>
          </Link>
        </div>
      </div>
      <div className={styles.nalaWelcome}>
        <p className={styles.speech}>Kurikulum terbaru siap diselaraskan dengan capaian pembelajaran! 📚</p>
        <div className={styles.mascot}><Nala mood="read" size={120} animate /></div>
      </div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat Capaian Pembelajaran…" />}
    {data && <div className={styles.curriculumGrid}>
      <section className={styles.versions} aria-label="Versi Capaian Pembelajaran">
        <div className={styles.panelHeading}>
          <div className={styles.panelTitleRow}>
            <h2>Daftar versi</h2>
            <span className={styles.versionCountBadge}>{data.length} versi</span>
          </div>
          <p>Pilih versi untuk membaca capaiannya.</p>
        </div>
        <div className={styles.versionList}>
          {data.length ? data.map((version) => (
            <button
              type="button"
              className={styles.versionLink}
              key={version.id}
              aria-pressed={version.id === versionId}
              onClick={() => setChosen(version.id)}
            >
              <div className={styles.versionTop}>
                <span className={styles.versionName}>{version.name}</span>
                <span className={[styles.badge, version.is_current ? styles.active : styles.archived].join(' ')}>
                  {version.is_current ? 'Berlaku' : version.status === 'draft' ? 'Draf' : 'Arsip'}
                </span>
              </div>
              <div className={styles.versionMeta}>
                <span>{version.decree_code}</span>
                <span className={styles.metaDot}>·</span>
                <span>berlaku {day.format(new Date(`${version.effective_on}T00:00:00`))}</span>
              </div>
              <div className={styles.versionBottom}>
                <span className={styles.versionSchools}>
                  <Icon name="school" size={15} />
                  <span>Dipakai {version.school_count} sekolah</span>
                </span>
                <span className={styles.versionArrow}><Icon name="chevronRight" size={16} /></span>
              </div>
            </button>
          )) : (
            <NalaEmpty mood="read" title="Belum ada versi Capaian Pembelajaran.">
              Unggah keputusan CP resmi untuk menyiapkan versi pertama.
            </NalaEmpty>
          )}
        </div>
      </section>
      {versionId && <VersionDetail key={versionId} service={service} versionId={versionId} />}
    </div>}
  </div>
}

function VersionDetail({ service, versionId }: { service: PlatformAdminUseCases; versionId: string }) {
  const read = useCallback((signal: AbortSignal) => service.curriculumVersion(versionId, signal), [service, versionId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <section className={styles.outcomes} aria-label="Isi Capaian Pembelajaran">
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat isi versi…" />}
    {data && (
      <>
        <div className={styles.outcomesHeader}>
          <div className={styles.outcomesTitleRow}>
            <h2>{data.name}</h2>
            <span className={[styles.badge, data.is_current ? styles.active : styles.archived].join(' ')}>
              {data.is_current ? 'Berlaku' : data.status === 'draft' ? 'Draf' : 'Arsip'}
            </span>
          </div>
          <div className={styles.outcomesMetaRow}>
            <span className={styles.metaChip}>
              <Icon name="book" size={14} />
              <span>{data.subjects.length} mata pelajaran</span>
            </span>
            <span className={styles.metaChip}>
              <Icon name="file" size={14} />
              <span>{data.decree_code}</span>
            </span>
            {data.effective_on && (
              <span className={styles.metaChip}>
                <Icon name="calendar" size={14} />
                <span>Berlaku {day.format(new Date(`${data.effective_on}T00:00:00`))}</span>
              </span>
            )}
          </div>
        </div>

        {data.subjects.length ? (
          <div className={styles.subjectList}>
            {data.subjects.map((subject) => (
              <details key={`${subject.name}-${subject.phase}`} className={styles.subjectDetails} open>
                <summary className={styles.subjectSummary}>
                  <div className={styles.subjectIconBox}>
                    <Icon name="book" size={18} />
                  </div>
                  <div className={styles.subjectSummaryInfo}>
                    <span className={styles.subjectSummaryName}>{subject.name}</span>
                    <div className={styles.subjectBadges}>
                      <span className={styles.phaseBadge}>Fase {subject.phase}</span>
                      <span className={styles.outcomesCountBadge}>{subject.learning_outcomes.length} capaian</span>
                    </div>
                  </div>
                  <span className={styles.accordionChevron}><Icon name="chevronDown" size={18} /></span>
                </summary>
                <div className={styles.outcomesContent}>
                  <ul className={styles.outcomeList}>
                    {subject.learning_outcomes.map((outcome, index) => (
                      <li key={index} className={styles.outcomeCard}>
                        <div className={styles.outcomeHeader}>
                          {outcome.element ? (
                            <span className={styles.elementTag}>
                              <Icon name="sparkle" size={12} />
                              <span>{outcome.element}</span>
                            </span>
                          ) : (
                            <span className={styles.generalTag}>Capaian umum</span>
                          )}
                          <span className={styles.outcomeIndex}>#{index + 1}</span>
                        </div>
                        <p className={styles.outcomeDescription}>{outcome.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <NalaEmpty mood="read" title="Belum ada mata pelajaran">
            Versi ini belum memuat rincian capaian pembelajaran.
          </NalaEmpty>
        )}
      </>
    )}
  </section>
}
