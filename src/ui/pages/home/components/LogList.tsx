import type { Log } from '@/domain/model/Log'

export function LogList({ logs }: { logs: readonly Log[] }) {
  if (logs.length === 0) return <p>No messages yet.</p>

  return (
    <ul aria-label="Saved messages">
      {logs.map((log, index) => (
        <li key={index}>
          <span>{log.message}</span>
          <time dateTime={new Date(log.when).toISOString()}>
            {new Date(log.when).toLocaleTimeString()}
          </time>
        </li>
      ))}
    </ul>
  )
}
