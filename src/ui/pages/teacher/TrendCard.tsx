import { Icon } from '@/ui/components/icon/Icon'
import { trendPoint, trendSeries, trendWeeks } from './teacherHomeExamples'
import styles from './HomeSections.module.css'

const gridLines = [10, 50, 90, 130]
const axisLabels = [{ y: 14, text: '60%' }, { y: 54, text: '40%' }, { y: 94, text: '20%' }, { y: 134, text: '0%' }]

export function TrendCard() {
  return <section className={styles.card} aria-labelledby="home-trend">
    <div className={styles.head}>
      <h2 id="home-trend" className={styles.title}><Icon name="graph" size={16} />Tren pemahaman</h2>
      <span className={styles.range}>4 minggu terakhir</span>
    </div>
    <ul className={styles.legend}>{trendSeries.map((series) => <li key={series.id}>
      <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true"><line x1="1" y1="4" x2="21" y2="4" className={styles[series.id]} /></svg>{series.label}
    </li>)}</ul>
    <svg viewBox="0 0 320 150" role="img" aria-label="Grafik garis persentase siswa per minggu untuk paham, berkembang, dan miskonsepsi. Data lengkap ada pada tabel di bawah." className={styles.chart}>
      <g className={styles.axis}>
        {axisLabels.map((label) => <text key={label.text} x="0" y={label.y}>{label.text}</text>)}
        {trendWeeks.map((week, index) => <text key={week} x={trendPoint(index, 0).x} y="148">{week}</text>)}
      </g>
      <path d={gridLines.map((y) => `M28 ${y}H320`).join('')} className={styles.grid} />
      {trendSeries.map((series) => <g key={series.id} className={styles[series.id]}>
        <polyline points={series.values.map((value, index) => { const point = trendPoint(index, value); return `${point.x},${point.y}` }).join(' ')} />
        {series.values.map((value, index) => { const point = trendPoint(index, value); return <circle key={index} cx={point.x} cy={point.y} r="2.5" /> })}
      </g>)}
    </svg>
    <details className={styles.table}>
      <summary>Lihat data tren sebagai tabel</summary>
      <table>
        <caption>Persentase siswa per minggu (contoh)</caption>
        <thead><tr><th scope="col">Minggu</th>{trendSeries.map((series) => <th key={series.id} scope="col">{series.label}</th>)}</tr></thead>
        <tbody>{trendWeeks.map((week, index) => <tr key={week}><th scope="row">{week}</th>{trendSeries.map((series) => <td key={series.id}>{series.values[index]}%</td>)}</tr>)}</tbody>
      </table>
    </details>
  </section>
}
