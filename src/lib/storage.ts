import type { Ticket } from '../types'

const TICKETS_KEY = 'supportdesk.tickets'
const AGENT_NAME_KEY = 'supportdesk.agentName'

// localStorage can throw (private mode, quota) or hold garbage from an older
// version of the app, so every read is guarded and falls back to a safe default.

export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(TICKETS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Ticket[]) : []
  } catch {
    return []
  }
}

export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
  } catch {
    // Persistence is best-effort; the in-memory state still works.
  }
}

export function loadAgentName(): string {
  try {
    return localStorage.getItem(AGENT_NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveAgentName(name: string): void {
  try {
    localStorage.setItem(AGENT_NAME_KEY, name)
  } catch {
    // best-effort
  }
}
