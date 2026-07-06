import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const SharedNotes = ({ notes, onAddNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote({ title: title.trim() || undefined, content: content.trim() });
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--color-heading)' }}>Shared Notes</h4>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <Plus size={16} aria-hidden="true" /> Add Note
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="note-title">Title (optional)</label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Note title"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              rows={3}
              placeholder="Write your note..."
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => { setIsAdding(false); setTitle(''); setContent(''); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Save Note
            </button>
          </div>
        </form>
      )}

      {notes && notes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notes.map((note, idx) => (
            <div key={idx} className="card" style={{ padding: '1rem 1.25rem' }}>
              {note.title && <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>{note.title}</h5>}
              <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-body)', marginTop: '0.75rem', opacity: 0.7 }}>
                {note.createdBy?.name || 'Unknown'} • {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)' }}>
          No notes yet. Be the first to add one!
        </div>
      )}
    </div>
  );
};

export default SharedNotes;
