import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Comment } from '../types'
import { formatDateTime } from '../lib/format'
import { useTickets } from '../store/useTickets'

interface Props {
  ticketId: string
  comments: Comment[]
}

export function CommentThread({ ticketId, comments }: Props) {
  const { comment, agentName } = useTickets()
  const [body, setBody] = useState('')
  const canPost = agentName.trim().length > 0 && body.trim().length > 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canPost) return
    comment(ticketId, body)
    setBody('')
  }

  return (
    <section className="thread">
      <h2>
        Thread <span className="muted">({comments.length})</span>
      </h2>

      {comments.length === 0 ? (
        <p className="empty">No notes yet. Start the thread below.</p>
      ) : (
        <ol className="thread__list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div className="comment__meta">
                <strong>{c.author}</strong>
                <time dateTime={c.createdAt} className="muted">
                  {formatDateTime(c.createdAt)}
                </time>
              </div>
              <p className="comment__body">{c.body}</p>
            </li>
          ))}
        </ol>
      )}

      <form className="thread__form" onSubmit={handleSubmit}>
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={agentName.trim() ? `Add a note as ${agentName.trim()}…` : 'Add a note…'}
        />
        <div className="thread__actions">
          {!agentName.trim() && (
            <span className="hint">Set your name in the header to post a note.</span>
          )}
          <button type="submit" className="btn btn--primary" disabled={!canPost}>
            Add note
          </button>
        </div>
      </form>
    </section>
  )
}
