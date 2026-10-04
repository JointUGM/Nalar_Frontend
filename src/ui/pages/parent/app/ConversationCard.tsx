import { Nala } from '@/ui/components/nala/Nala'
import styles from '@/ui/pages/parent/ParentConversation.module.css'

// Specific questions start better home conversations than praise alone; the first one names a concept the teacher released as still developing.
export function ConversationCard({ growing }: { growing?: string }) {
  const prompts = [
    ...(growing ? [`Coba jelaskan “${growing}” dengan kata-katamu.`] : []),
    'Apa yang membuatmu berpikir begitu?',
    'Ada contoh dari rumah yang mirip?',
    ...(growing ? [] : ['Adakah yang kamu pikirkan ulang setelah mengerjakan misi?']),
  ]
  return <section className={styles.card} aria-labelledby="talk-title">
    <div className={styles.head}>
      <span className={styles.avatar}><Nala mood="ask" head size={44} /></span>
      <div><h2 id="talk-title">Ngobrol di rumah</h2><p>Tidak perlu tahu jawabannya, cukup tanyakan alasannya.</p></div>
    </div>
    <ul className={styles.bubbles} aria-label="Pertanyaan untuk dicoba">{prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
  </section>
}
