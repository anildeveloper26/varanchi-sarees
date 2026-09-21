import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Ticket } from '../types'
import { addComment, createTicket, reopenTicket, resolveTicket } from '../lib/tickets'
import { loadAgentName, loadTickets, saveAgentName, saveTickets } from '../lib/storage'
import { TicketsContext } from './context'
import type { TicketsContextValue } from './context'

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets)
  const [agentName, setAgentNameState] = useState<string>(loadAgentName)

  useEffect(() => saveTickets(tickets), [tickets])
  useEffect(() => saveAgentName(agentName), [agentName])

  const updateTicket = useCallback((id: string, fn: (t: Ticket) => Ticket) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? fn(t) : t)))
  }, [])

  const value = useMemo<TicketsContextValue>(
    () => ({
      tickets,
      getTicket: (id) => tickets.find((t) => t.id === id),
      create: (input) => {
        const ticket = createTicket(input)
        setTickets((prev) => [ticket, ...prev])
        return ticket
      },
      comment: (ticketId, body) => {
        if (!agentName.trim() || !body.trim()) return
        updateTicket(ticketId, (t) => addComment(t, agentName, body))
      },
      resolve: (ticketId) => updateTicket(ticketId, (t) => resolveTicket(t)),
      reopen: (ticketId) => updateTicket(ticketId, reopenTicket),
      agentName,
      setAgentName: setAgentNameState,
    }),
    [tickets, agentName, updateTicket],
  )

  return <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
}
