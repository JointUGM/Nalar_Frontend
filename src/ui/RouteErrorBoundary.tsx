import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import styles from './RouteBoundary.styles'

type Report = (code: string, pathname: string) => void
interface Props { resetKey: string; report?: Report; children: ReactNode }

// A render error would otherwise leave a white screen in the middle of a lesson. The boundary resets when the route changes.
// A reload also fixes the usual cause after a deploy: a page chunk the old build points to no longer exists.
class Boundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidUpdate(before: Props) { if (this.state.failed && before.resetKey !== this.props.resetKey) this.setState({ failed: false }) }
  // Only a code and the path go out; the message and stack stay in the console.
  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Halaman gagal ditampilkan', error, info.componentStack)
    const chunk = error instanceof Error && /dynamically imported module|Importing a module script failed/.test(error.message)
    this.props.report?.(chunk ? 'route.chunk_load' : 'route.render', this.props.resetKey)
  }
  render() {
    if (!this.state.failed) return this.props.children
    return <main className={styles.page} role="alert">
      <h1>Halaman ini tidak bisa ditampilkan</h1>
      <p>Ada yang salah di sisi kami. Data yang sudah terkirim tetap tersimpan. Muat ulang halaman, atau kembali ke beranda.</p>
      <p><Button onClick={() => window.location.reload()}>Muat ulang halaman</Button> <a href="/">Kembali ke NALAR</a></p>
    </main>
  }
}

export function RouteErrorBoundary({ report, children }: { report?: Report; children: ReactNode }) {
  return <Boundary resetKey={useLocation().pathname} report={report}>{children}</Boundary>
}
