import { Link, useSearchParams } from 'react-router-dom'
import type { TicketFilter } from '../types'
import { filterTickets } from '../lib/tickets'
import { formatDateTime } from '../lib/format'
import { useTickets } from '../store/useTickets'
import { StatusBadge } from './StatusBadge'

const FILTERS: { value: TicketFilter; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'all', label: 'All' },
]

const DEFAULT_FILTER: TicketFilter = 'open'

function isFilter(value: string | null): value is TicketFilter {
  return FILTERS.some((f) => f.value === value)
}

export function TicketList() {
  const { tickets } = useTickets()
  // Filter lives in the URL (?status=resolved) so it survives refresh and can be shared.
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  const filter: TicketFilter = isFilter(statusParam) ? statusParam : DEFAULT_FILTER
  const visible = filterTickets(tickets, filter)

  return (
    <section>
      <div className="page-head">
        <h1>Tickets</h1>
        <Link to="/tickets/new" className="btn btn--primary">
          New ticket
        </Link>
      </div>

      <nav className="tabs" aria-label="Filter tickets">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            to={f.value === DEFAULT_FILTER ? '/' : `/?status=${f.value}`}
            aria-current={filter === f.value ? 'page' : undefined}
            className={`tab${filter === f.value ? ' tab--active' : ''}`}
          >
            {f.label} <span className="tab__count">{filterTickets(tickets, f.value).length}</span>
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="empty">
          No {filter === 'all' ? '' : filter} tickets yet.{' '}
          <Link to="/tickets/new">Create one</Link>.
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Customer</th>
              <th>Order #</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link to={`/tickets/${t.id}`} className="table__title">
                    {t.title}
                  </Link>
                  {t.comments.length > 0 && (
                    <span className="muted"> · {t.comments.length} comment{t.comments.length === 1 ? '' : 's'}</span>
                  )}
                </td>
                <td>{t.customerName}</td>
                <td className="mono">{t.orderNumber}</td>
                <td className="muted">{formatDateTime(t.createdAt)}</td>
                <td>
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
