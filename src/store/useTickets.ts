import { useContext } from 'react'
import { TicketsContext } from './context'
import type { TicketsContextValue } from './context'

export function useTickets(): TicketsContextValue {
  const ctx = useContext(TicketsContext)
  if (!ctx) throw new Error('useTickets must be used inside <TicketsProvider>')
  return ctx
}
