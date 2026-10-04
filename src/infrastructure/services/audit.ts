import type { AuditPage } from '@/domain/model/Audit'
import { count, instant, list, nullable, record, text } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']

// The platform and the school audit pages share one shape.
export function auditPage(data: unknown): AuditPage {
  const value = record(data)
  return {
    next_cursor: nullable(value.next_cursor, count),
    items: list(value.items).map((entry) => {
      const item = record(entry)
      return { id: count(item.id), school_id: nullable(item.school_id, text), actor_id: nullable(item.actor_id, text), action: text(item.action), entity_table: text(item.entity_table), entity_id: nullable(item.entity_id, text), created_at: instant(item.created_at) } satisfies Schemas['AuditItemOut']
    }),
  }
}
