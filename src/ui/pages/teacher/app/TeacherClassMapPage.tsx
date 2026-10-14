import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Tabs } from '@base-ui/react/tabs'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link, useLocation, useParams, useSearchParams } from 'react-router'
import { orderByPrerequisites } from '@/domain/model/Teacher'
import type { ClassMapConcept, TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { cn } from '@/ui/cn'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import { CsvDownload } from '@/ui/components/csv-download/CsvDownload'
import styles from '@/ui/pages/teacher/TeacherClassMap.styles'
import kbStyles from '@/ui/pages/teacher/TeacherKbReview.styles'
import { Loading } from '@/ui/components/loading/Loading'
import strategyStyles from '@/ui/pages/teacher/StrategyCard.styles'
import { KbConceptMap } from './KbConceptMap'
import { MgmpPackage } from './MgmpPackage'
import { MisconceptionTrailCard } from './MisconceptionTrailCard'
import { StrategyCard } from './StrategyCard'
import { NextLessonPlan } from './NextLessonPlan'

// Evaluations and the saved insight arrive after the sessions end, so the map refreshes on its own.
const mapPollMs = () => 15_000
// As on the knowledge base page, one view at a time; `?tab=` opens a view directly.
const views = ['map', 'misconceptions', 'plan'] as const
type View = typeof views[number]
const studentsIn = (concept: ClassMapConcept) => concept.mastered_count + concept.developing_count + concept.not_observed_count
const masteredShare = (concept: ClassMapConcept) => studentsIn(concept) > 0 ? Math.round(concept.mastered_count / studentsIn(concept) * 100) : 0
const holders = (concept: ClassMapConcept) => concept.misconceptions.reduce((sum, item) => sum + item.count, 0)
const shownNames = 8

function Bar({ concept, className }: { concept: ClassMapConcept; className: string }) {
  return <span className={className} aria-hidden="true"><span style={{ flexGrow: concept.mastered_count }} /><span style={{ flexGrow: concept.developing_count }} /><span style={{ flexGrow: concept.not_observed_count }} /></span>
}

// A long list of names would bury the numbers, so the first few show and the rest open on request.
function Names({ students, to }: { students: readonly { session_id: string; name: string }[]; to: (sessionId: string) => string }) {
  if (students.length === 0) return null
  const chip = (holder: { session_id: string; name: string }) => <li key={holder.session_id}><Link to={to(holder.session_id)}>{holder.name}</Link></li>
  return <>
    <ul className={styles.chips} aria-label="Siswa yang memegangnya">{students.slice(0, shownNames).map(chip)}</ul>
    {students.length > shownNames && <details className={styles.more}><summary>Lihat semua {students.length} nama</summary><ul className={styles.chips}>{students.slice(shownNames).map(chip)}</ul></details>}
  </>
}

// The first sentence is the takeaway; every number is marked so the counts can be read at a glance.
function Reading({ text }: { text: string }) {
  const [lead, ...rest] = text.split(/(?<=[.!?])\s+/)
  const marked = (part: string) => part.split(/(\d+(?:[.,]\d+)?%?)/).map((piece, index) => index % 2 ? <b key={index} className={styles.figure}>{piece}</b> : piece)
  return <>
    <p className={styles.lead}>{marked(lead)}</p>
    {rest.length > 0 && <p className={styles.story}>{marked(rest.join(' '))}</p>}
  </>
}

export function TeacherClassMapPage({ service, base }: { service: TeacherService; base: string }) {
  const { publicationId = '' } = useParams()
  const location = useLocation()
  const [params] = useSearchParams()
  const known = location.state?.publication as TeacherPublication | undefined
  const subtitle = known?.id === publicationId ? `${known.class_name} · ${known.mission_title}` : 'Hasil kelas'
  const read = useCallback((signal: AbortSignal) => service.classMap(publicationId, signal), [service, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, mapPollMs)
  const readTrail = useCallback((signal: AbortSignal) => service.misconceptionTrail(publicationId, signal), [service, publicationId])
  const trail = useLiveResource(readTrail, mapPollMs)
  const [view, setView] = useState<View>(() => views.find((name) => name === params.get('tab')) ?? 'map')
  const [selectedId, setSelectedId] = useState('')
  const [openCard, setOpenCard] = useState<string | null>(null)
  const focusCard = useRef<string | null>(null)
  const rows = data?.concepts.flatMap((concept) => concept.misconceptions.map((item) => ({ ...item, concept: concept.name }))).filter((item) => item.count > 0) ?? []
  // Prerequisites come first. The map needs stable arrays: it measures its arrows again whenever they change.
  const ordered = useMemo(() => data ? orderByPrerequisites(data.concepts, data.prerequisites) : [], [data])
  const nodes = useMemo(() => ordered.map((concept) => ({ ...concept, id: concept.concept_id })), [ordered])
  const links = useMemo(() => (data?.prerequisites ?? []).map((edge) => ({ concept_id: edge.concept_id, prerequisite_concept_id: edge.prerequisite_id })), [data])
  // The inspector opens on the concept where most students hold a misconception, the one a teacher looks for first.
  const selected = ordered.find((concept) => concept.concept_id === selectedId) ?? ordered.reduce<ClassMapConcept | undefined>((best, concept) => !best || holders(concept) > holders(best) ? concept : best, undefined)
  const sessionPath = (sessionId: string) => `${base}/publications/${publicationId}/sessions/${sessionId}`
  const nameOf = (id: string) => ordered.find((concept) => concept.concept_id === id)?.name ?? ''
  const found = selected?.misconceptions.filter((item) => item.count > 0).sort((a, b) => b.count - a.count) ?? []

  // The strategy card lives in the misconception list, so opening it from the map or the plan switches the view and moves focus to it.
  useEffect(() => {
    if (!focusCard.current) return
    document.querySelector<HTMLElement>(`[aria-controls="strategy-${focusCard.current}"]`)?.focus()
    focusCard.current = null
  }, [view, openCard])
  function showStrategy(id: string) { focusCard.current = id; setOpenCard(id); setView('misconceptions') }

  const actions = <div className={styles.actions}><CsvDownload label="Unduh nilai (CSV)" filename="nalar-nilai-kelas.csv" read={(signal) => service.exportPublication(publicationId, signal)} /><MgmpPackage service={service} publicationId={publicationId} /></div>

  // The root holds every state of the page, so the download actions keep one place in the tree and an open MGMP dialog survives the first load.
  return <Tabs.Root value={view} onValueChange={(value) => setView(value as View)} className={styles.content}>
    <TeacherPageHead crumb={<><Link to={`${base}/sessions`}>Sesi dan hasil</Link><Icon name="chevronRight" size={14} /></>} title="Peta kelas" subtitle={<>{subtitle}{data ? ` · ${data.denominator} siswa dihitung` : ''}{data && data.incomplete_count > 0 ? ` · ${data.incomplete_count} belum selesai` : ''}</>} />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat peta kelas…" />}
    {data && data.denominator === 0 && <Feedback title="Belum ada hasil untuk dipetakan" announce>Peta muncul setelah ada sesi yang selesai dan dinilai.{data.incomplete_count > 0 ? ` ${data.incomplete_count} siswa belum selesai atau belum dinilai.` : ''}</Feedback>}
    {data && data.denominator > 0 && <section className={styles.nala} aria-labelledby="happening-title">
        <span className={styles.nalaFace}><Nala mood="search" size={48} head animate /></span>
        <div className="min-w-0">
          <h2 id="happening-title" className={styles.nalaLabel}>Penjelasan Nala</h2>
          {data.insight ? <Reading text={data.insight.narrative} /> : <p className={styles.lead}>Penjelasan ditulis setelah semua sesi selesai dan dinilai.</p>}
          <p className={styles.footnote}>Angka dihitung langsung dari data sesi. Nala hanya menjelaskan polanya.</p>
        </div>
        {data.insight && <button type="button" className={styles.nalaAction} onClick={() => setView('plan')}>Lihat rencana berikutnya<Icon name="chevronRight" size={16} /></button>}
      </section>}

    {/* With results, the downloads share the row of the view switch instead of taking a row of their own. */}
    <div className={styles.header}>
      {data && data.denominator > 0 && <Tabs.List aria-label="Tampilan peta kelas" className={kbStyles.tabList}>
        <Tabs.Tab value="map" className={kbStyles.tab}>Peta konsep<span className={kbStyles.tabCount}>{ordered.length}</span></Tabs.Tab>
        <Tabs.Tab value="misconceptions" className={kbStyles.tab}>Miskonsepsi<span className={kbStyles.tabCount}>{rows.length}</span></Tabs.Tab>
        <Tabs.Tab value="plan" className={kbStyles.tab}>Rencana berikutnya</Tabs.Tab>
      </Tabs.List>}
      {actions}
    </div>
    {data && data.denominator > 0 && <>

        <Tabs.Panel value="map" keepMounted className={kbStyles.tabPanel}>
          <div className={styles.workspace}>
            <section className={styles.mapCard} aria-labelledby="map-title">
              <div className={styles.sectionHead}><h2 id="map-title">Peta konsep</h2><span>Panah: dipelajari lebih dulu · pilih konsep untuk melihat rinciannya</span></div>
              {/* The map measures its arrows, so it renders only while its view is showing. */}
              <div className={styles.map}>{view === 'map' && <KbConceptMap concepts={nodes} prerequisites={links} selectedId={selected?.concept_id ?? ''} count={(id) => nodes.find((concept) => concept.id === id)?.misconceptions.filter((item) => item.count > 0).length ?? 0} onSelect={setSelectedId} nodeClass={styles.node}
                content={(concept) => <><span className={styles.nodeTop}><strong>{concept.name}</strong><span className={styles.nodeShare}>{masteredShare(concept)}% paham</span></span><Bar concept={concept} className={styles.barSmall} /></>} />}</div>
              <p className={styles.legend}><span>Paham</span><span>Berkembang</span><span>Belum teramati</span><span>Jumlah miskonsepsi</span></p>
            </section>
            {selected && <section className={styles.inspector} aria-labelledby="concept-title">
              <h3 id="concept-title">{selected.name}</h3>
              <div className={styles.share}>
                <p className={styles.shareFigure}><b>{masteredShare(selected)}%</b>paham dari {studentsIn(selected)} siswa</p>
                <Bar concept={selected} className={styles.bar} />
                <p>{selected.mastered_count} paham · {selected.developing_count} berkembang · {selected.not_observed_count} belum teramati</p>
              </div>
              <dl className={styles.relations}>
                <div><dt>Dipelajari lebih dulu</dt><dd>{data.prerequisites.filter((edge) => edge.concept_id === selected.concept_id).map((edge) => nameOf(edge.prerequisite_id)).join(', ') || 'Tidak ada prasyarat tercatat'}</dd></div>
                <div><dt>Dilanjutkan ke</dt><dd>{data.prerequisites.filter((edge) => edge.prerequisite_id === selected.concept_id).map((edge) => nameOf(edge.concept_id)).join(', ') || 'Tidak ada lanjutan tercatat'}</dd></div>
              </dl>
              <div className="grid gap-3">
                <h4>Miskonsepsi di konsep ini<span className={styles.count}>{found.length}</span></h4>
                {found.length === 0 ? <p className={styles.quiet}>Tidak ada miskonsepsi yang teramati pada konsep ini.</p> : <ul className={styles.misList}>{found.map((item) => <li key={item.misconception_id} className={styles.mis}>
                  <q>{item.statement}</q>
                  <div className={styles.misMeta}><span><b>{item.count}</b> dari {data.denominator} siswa</span><span className={styles.progress}><span aria-hidden="true"><i style={{ inlineSize: `${item.resolved_count / item.count * 100}%` }} /></span>{item.resolved_count} berubah pikiran</span></div>
                  <Names students={item.students} to={sessionPath} />
                  <button type="button" className={cn(strategyStyles.toggle, 'mt-0 justify-self-start')} onClick={() => showStrategy(item.misconception_id)}>Lihat kartu strategi</button>
                </li>)}</ul>}
              </div>
            </section>}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="misconceptions" keepMounted className={kbStyles.tabPanel}>
          <div className="grid gap-4">
            <section className={styles.table} aria-labelledby="mis-title">
              <h2 id="mis-title">Miskonsepsi <span>{rows.length}</span></h2>
              {rows.length === 0 ? <p>Tidak ada miskonsepsi yang teramati pada sesi yang dihitung.</p> : <div className={styles.tableRegion} role="region" aria-labelledby="mis-title" tabIndex={0}>
                <table>
                  <caption>Miskonsepsi di kelas, jumlah siswa, dan yang berubah selama sesi</caption>
                  <thead><tr><th scope="col">Miskonsepsi</th><th scope="col">Siswa</th><th scope="col">Berubah pikiran</th></tr></thead>
                  <tbody>{rows.map((row) => <Fragment key={row.misconception_id}>
                    <tr>
                      <th scope="row">“{row.statement}”<span className={styles.conceptTag}>{row.concept}</span><button type="button" className={strategyStyles.toggle} aria-expanded={openCard === row.misconception_id} aria-controls={`strategy-${row.misconception_id}`} onClick={() => setOpenCard(openCard === row.misconception_id ? null : row.misconception_id)}>{openCard === row.misconception_id ? 'Tutup kartu strategi' : 'Lihat kartu strategi'}</button></th>
                      <td><p className={styles.figureCell}><strong>{row.count}</strong> dari {data.denominator} siswa</p><Names students={row.students} to={sessionPath} /></td>
                      <td><span className={styles.progress}><span aria-hidden="true"><i style={{ inlineSize: `${row.resolved_count / row.count * 100}%` }} /></span>{row.resolved_count} dari {row.count}</span></td>
                    </tr>
                    {openCard === row.misconception_id && <tr><td colSpan={3}><StrategyCard id={`strategy-${row.misconception_id}`} item={row} suggestions={data.insight?.suggestions ?? []} /></td></tr>}
                  </Fragment>)}</tbody>
                </table>
              </div>}
            </section>
            <MisconceptionTrailCard data={trail.data} error={trail.error} base={base} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="plan" keepMounted className={kbStyles.tabPanel}>
          <NextLessonPlan key={publicationId} data={data} trail={trail.error ? null : trail.data} publicationId={publicationId} base={base} offline={!online || !!error} service={service} refresh={refresh} openStrategy={showStrategy} />
        </Tabs.Panel>
    </>}
  </Tabs.Root>
}
