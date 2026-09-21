import { createContext } from 'react'
import type { NewTicketInput, Ticket } from '../types'

export interface TicketsContextValue {
  tickets: Ticket[]
  getTicket: (id: string) => Ticket | undefined
  create: (input: NewTicketInput) => Ticket
  comment: (ticketId: string, body: string) => void
  resolve: (ticketId: string) => void
  reopen: (ticketId: string) => void
  agentName: string
  setAgentName: (name: string) => void
}

export const TicketsContext = createContext<TicketsContextValue | null>(null)
