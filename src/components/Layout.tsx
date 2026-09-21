import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTickets } from '../store/useTickets'

export function Layout() {
  const { agentName, setAgentName } = useTickets()

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand">
            <span className="brand__mark">V</span>
            <span className="brand__text">
              Varanchi <em>Support</em>
            </span>
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              Tickets
            </NavLink>
            <NavLink to="/tickets/new">New ticket</NavLink>
          </nav>
          <label className="agent">
            <span>Your name</span>
            <input
              type="text"
              value={agentName}
              placeholder="e.g. Anil"
              onChange={(e) => setAgentName(e.target.value)}
            />
          </label>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
