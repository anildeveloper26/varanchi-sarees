import { describe, expect, it } from 'vitest'
import {
  addComment,
  createTicket,
  filterTickets,
  reopenTicket,
  resolveTicket,
} from './tickets'

const input = {
  title: '  Broken zipper ',
  description: ' Zipper came off after one use ',
  customerName: ' Priya ',
  orderNumber: ' VR-1001 ',
  phoneNumber: ' +91 98765 43210 ',
}

describe('createTicket', () => {
  it('trims fields and sets defaults', () => {
    const now = new Date('2026-09-21T10:00:00Z')
    const t = createTicket(input, now)
    expect(t.title).toBe('Broken zipper')
    expect(t.customerName).toBe('Priya')
    expect(t.orderNumber).toBe('VR-1001')
    expect(t.phoneNumber).toBe('+91 98765 43210')
    expect(t.status).toBe('open')
    expect(t.createdAt).toBe(now.toISOString())
    expect(t.comments).toEqual([])
    expect(t.id).toBeTruthy()
  })
})

describe('addComment', () => {
  it('appends a comment with author and time without mutating the input', () => {
    const t = createTicket(input)
    const now = new Date('2026-09-21T11:00:00Z')
    const updated = addComment(t, ' Anil ', ' Contacted customer ', now)
    expect(t.comments).toHaveLength(0)
    expect(updated.comments).toHaveLength(1)
    expect(updated.comments[0]).toMatchObject({
      author: 'Anil',
      body: 'Contacted customer',
      createdAt: now.toISOString(),
    })
  })
})

describe('resolve / reopen', () => {
  it('sets resolvedAt on resolve and clears it on reopen', () => {
    const t = createTicket(input)
    const now = new Date('2026-09-21T12:00:00Z')
    const resolved = resolveTicket(t, now)
    expect(resolved.status).toBe('resolved')
    expect(resolved.resolvedAt).toBe(now.toISOString())

    const reopened = reopenTicket(resolved)
    expect(reopened.status).toBe('open')
    expect(reopened.resolvedAt).toBeUndefined()
  })
})

describe('filterTickets', () => {
  const older = createTicket({ ...input, title: 'older' }, new Date('2026-09-01'))
  const newer = createTicket({ ...input, title: 'newer' }, new Date('2026-09-02'))
  const done = resolveTicket(createTicket({ ...input, title: 'done' }, new Date('2026-09-03')))
  const all = [older, done, newer]

  it('filters by status', () => {
    expect(filterTickets(all, 'open').map((t) => t.title)).toEqual(['newer', 'older'])
    expect(filterTickets(all, 'resolved').map((t) => t.title)).toEqual(['done'])
  })

  it('shows open before resolved, newest first, for "all"', () => {
    expect(filterTickets(all, 'all').map((t) => t.title)).toEqual(['newer', 'older', 'done'])
  })
})
