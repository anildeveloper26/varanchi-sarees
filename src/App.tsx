import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TicketDetail } from './components/TicketDetail'
import { TicketForm } from './components/TicketForm'
import { TicketList } from './components/TicketList'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TicketList />} />
        <Route path="tickets/new" element={<TicketForm />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
