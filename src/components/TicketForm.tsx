import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { NewTicketInput } from '../types'
import { useTickets } from '../store/useTickets'

const EMPTY: NewTicketInput = {
  title: '',
  description: '',
  customerName: '',
  orderNumber: '',
  phoneNumber: '',
}

export function TicketForm() {
  const { create } = useTickets()
  const navigate = useNavigate()
  const [form, setForm] = useState<NewTicketInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof NewTicketInput) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const required: (keyof NewTicketInput)[] = ['title', 'customerName', 'orderNumber', 'phoneNumber']
    if (required.some((f) => !form[f].trim())) {
      setError('Please fill in title, customer name, order number and phone number.')
      return
    }
    const ticket = create(form)
    navigate(`/tickets/${ticket.id}`)
  }

  return (
    <section className="narrow">
      <div className="page-head">
        <h1>New ticket</h1>
        <Link to="/" className="btn btn--ghost">
          Cancel
        </Link>
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Title <span className="req">*</span></span>
          <input value={form.title} onChange={set('title')} placeholder="Short summary of the issue" autoFocus />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={4}
            placeholder="What did the customer report?"
          />
        </label>

        <fieldset className="form__group">
          <legend>Customer identification</legend>
          <label>
            <span>Customer name <span className="req">*</span></span>
            <input value={form.customerName} onChange={set('customerName')} />
          </label>
          <div className="form__row">
            <label>
              <span>Order number <span className="req">*</span></span>
              <input value={form.orderNumber} onChange={set('orderNumber')} placeholder="e.g. VR-1042" />
            </label>
            <label>
              <span>Phone number <span className="req">*</span></span>
              <input type="tel" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+91 …" />
            </label>
          </div>
        </fieldset>

        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}

        <div className="form__actions">
          <button type="submit" className="btn btn--primary">
            Create ticket
          </button>
        </div>
      </form>
    </section>
  )
}
