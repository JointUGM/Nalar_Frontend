import type { AddLogUseCase } from '@/application/add-log-use-case'
import { Header } from '@/ui/components/header/Header'
import { LogList } from '@/ui/pages/home/components/LogList'
import { useHomeViewModel } from './useHomeViewModel'
import styles from './Home.module.css'

export interface HomeProps {
  addLog: Pick<AddLogUseCase, 'execute'>
}

export function Home({ addLog }: HomeProps) {
  const viewModel = useHomeViewModel(addLog)

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main} lang="en">
        <p className={styles.eyebrow}>A fresh foundation</p>
        <h1>Ready for what comes next.</h1>
        <p className={styles.intro}>
          Nalar runs on React, TypeScript, and Vite. Four focused layers keep
          business logic, integrations, and the interface easy to evolve.
        </p>
        <div className={styles.layers} aria-label="Architecture layers">
          {['Domain', 'Application', 'Infrastructure', 'UI'].map((layer) => (
            <span key={layer}>{layer}</span>
          ))}
        </div>
        <section className={styles.card} aria-labelledby="example-title">
          <h2 id="example-title">Try the example</h2>
          <p>A message travels from this view through a use case to an in-memory adapter.</p>
          <form onSubmit={(event) => {
            event.preventDefault()
            void viewModel.addMessage()
          }}>
            <label htmlFor="message">Message</label>
            <div className={styles.inputRow}>
              <input
                id="message"
                value={viewModel.message}
                onChange={(event) => viewModel.setMessage(event.target.value)}
                placeholder="Write your first message"
                disabled={viewModel.isSubmitting}
                aria-invalid={Boolean(viewModel.error)}
                aria-describedby={viewModel.error ? 'message-error' : undefined}
              />
              <button type="submit" disabled={viewModel.isSubmitting}>
                {viewModel.isSubmitting ? 'Saving…' : 'Add message'}
              </button>
            </div>
            {viewModel.error && (
              <p id="message-error" className={styles.error} role="alert">{viewModel.error}</p>
            )}
          </form>
          <div aria-live="polite">
            <LogList logs={viewModel.logs} />
          </div>
          <p className={styles.note}>Example only. Messages reset when you reload.</p>
        </section>
        <p className={styles.footer}>Architecture and agent conventions: <code>docs/project_structure.md</code></p>
      </main>
    </div>
  )
}
