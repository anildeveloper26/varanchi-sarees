import { Link, useParams } from 'react-router-dom'
import { formatDateTime } from '../lib/format'
import { useTickets } from '../store/useTickets'
import { CommentThread } from './CommentThread'
import { StatusBadge } from './StatusBadge'

export function TicketDetail() {
  const { id = '' } = useParams()
  const { getTicket, resolve, reopen } = useTickets()
  const ticket = getTicket(id)

  if (!ticket) {
    return (
      <section className="narrow">
        <h1>Ticket not found</h1>
        <p className="muted">It may have been created in a different browser, or the link is wrong.</p>
        <Link to="/" className="btn btn--ghost">
          Back to tickets
        </Link>
      </section>
    )
  }

  const isOpen = ticket.status === 'open'

  return (
    <section className="narrow">
      <Link to="/" className="back">
        ← All tickets
      </Link>

      <div className="page-head">
        <div>
          <h1>{ticket.title}</h1>
          <p className="muted">
            <StatusBadge status={ticket.status} /> · Created {formatDateTime(ticket.createdAt)}
            {ticket.resolvedAt && <> · Resolved {formatDateTime(ticket.resolvedAt)}</>}
          </p>
        </div>
        {isOpen ? (
          <button className="btn btn--primary" onClick={() => resolve(ticket.id)}>
            Mark resolved
          </button>
        ) : (
          <button className="btn btn--ghost" onClick={() => reopen(ticket.id)}>
            Reopen
          </button>
        )}
      </div>

      <dl className="facts">
        <div>
          <dt>Customer</dt>
          <dd>{ticket.customerName}</dd>
        </div>
        <div>
          <dt>Order number</dt>
          <dd className="mono">{ticket.orderNumber}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${ticket.phoneNumber}`}>{ticket.phoneNumber}</a>
          </dd>
        </div>
      </dl>

      {ticket.description && (
        <div className="description">
          <h2>Description</h2>
          <p>{ticket.description}</p>
        </div>
      )}

      <CommentThread ticketId={ticket.id} comments={ticket.comments} />
    </section>
  )
}
