import { useState } from 'react'
import { Link } from 'react-router-dom'
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

export function TicketList() {
  const { tickets } = useTickets()
  const [filter, setFilter] = useState<TicketFilter>('open')
  const visible = filterTickets(tickets, filter)

  return (
    <section>
      <div className="page-head">
        <h1>Tickets</h1>
        <Link to="/tickets/new" className="btn btn--primary">
          New ticket
        </Link>
      </div>

      <div className="tabs" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            className={`tab${filter === f.value ? ' tab--active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label} <span className="tab__count">{filterTickets(tickets, f.value).length}</span>
          </button>
        ))}
      </div>

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
