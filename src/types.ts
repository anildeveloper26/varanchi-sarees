export type TicketStatus = 'open' | 'resolved'

export interface Comment {
  id: string
  author: string
  body: string
  createdAt: string // ISO timestamp
}

export interface Ticket {
  id: string
  title: string
  description: string
  customerName: string
  orderNumber: string
  phoneNumber: string
  status: TicketStatus
  createdAt: string // ISO timestamp
  resolvedAt?: string // ISO timestamp, only when status === 'resolved'
  comments: Comment[]
}

export type NewTicketInput = Pick<
  Ticket,
  'title' | 'description' | 'customerName' | 'orderNumber' | 'phoneNumber'
>

export type TicketFilter = 'all' | TicketStatus
