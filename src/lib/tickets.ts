import type { Comment, NewTicketInput, Ticket, TicketFilter } from '../types'
import { newId } from './id'

// Pure, framework-free ticket logic. Every function returns a new object
// and never mutates its input, so React state updates stay predictable.

export function createTicket(input: NewTicketInput, now = new Date()): Ticket {
  return {
    id: newId(),
    title: input.title.trim(),
    description: input.description.trim(),
    customerName: input.customerName.trim(),
    orderNumber: input.orderNumber.trim(),
    phoneNumber: input.phoneNumber.trim(),
    status: 'open',
    createdAt: now.toISOString(),
    comments: [],
  }
}

export function addComment(
  ticket: Ticket,
  author: string,
  body: string,
  now = new Date(),
): Ticket {
  const comment: Comment = {
    id: newId(),
    author: author.trim(),
    body: body.trim(),
    createdAt: now.toISOString(),
  }
  return { ...ticket, comments: [...ticket.comments, comment] }
}

export function resolveTicket(ticket: Ticket, now = new Date()): Ticket {
  return { ...ticket, status: 'resolved', resolvedAt: now.toISOString() }
}

export function reopenTicket(ticket: Ticket): Ticket {
  const { resolvedAt: _resolvedAt, ...rest } = ticket
  return { ...rest, status: 'open' }
}

export function filterTickets(tickets: Ticket[], filter: TicketFilter): Ticket[] {
  const matching =
    filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)
  // Open tickets first, then newest first within each group.
  return [...matching].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'open' ? -1 : 1
    return b.createdAt.localeCompare(a.createdAt)
  })
}
