import { useState } from 'react';
import { formatDate } from '../utils/storage';

const ASSIGNEES = ['chad', 'brie', 'bowie'];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function AssigneePicker({ value, onChange }) {
  return (
    <div className="assignee-picker">
      <span className="assignee-picker__label">Assign:</span>
      {ASSIGNEES.map(name => (
        <button
          key={name}
          className={`assignee-btn assignee-btn--${name} ${value === name ? 'assignee-btn--selected' : ''}`}
          onClick={() => onChange(value === name ? null : name)}
          type="button"
        >{name}</button>
      ))}
    </div>
  );
}

function AssigneeBadge({ name }) {
  if (!name) return null;
  return <span className={`assignee-badge assignee-badge--${name}`}>{name}</span>;
}

export default function DayView({ dayId, dayData, onUpdate, onClose, monthColor, monthAccent }) {
  const [activeTab, setActiveTab] = useState('todos');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoAssignee, setNewTodoAssignee] = useState(null);
  const [newScript, setNewScript] = useState({ title: '', content: '' });
  const [newScriptAssignee, setNewScriptAssignee] = useState(null);
  const [editingScript, setEditingScript] = useState(null);

  const todos = dayData.todos || [];
  const scripts = dayData.scripts || [];
  const notes = dayData.notes || '';

  function addTodo() {
    if (!newTodo.trim()) return;
    const updated = { ...dayData, todos: [...todos, { id: genId(), text: newTodo.trim(), checked: false, assignee: newTodoAssignee }] };
    onUpdate(updated);
    setNewTodo('');
    setNewTodoAssignee(null);
  }

  function toggleTodo(id) {
    const updated = { ...dayData, todos: todos.map(t => t.id === id ? { ...t, checked: !t.checked } : t) };
    onUpdate(updated);
  }

  function setTodoAssignee(id, assignee) {
    const updated = { ...dayData, todos: todos.map(t => t.id === id ? { ...t, assignee } : t) };
    onUpdate(updated);
  }

  function deleteTodo(id) {
    const updated = { ...dayData, todos: todos.filter(t => t.id !== id) };
    onUpdate(updated);
  }

  function addScript() {
    if (!newScript.title.trim()) return;
    const updated = { ...dayData, scripts: [...scripts, { id: genId(), title: newScript.title.trim(), content: newScript.content, assignee: newScriptAssignee }] };
    onUpdate(updated);
    setNewScript({ title: '', content: '' });
    setNewScriptAssignee(null);
  }

  function setScriptAssignee(id, assignee) {
    const updated = { ...dayData, scripts: scripts.map(s => s.id === id ? { ...s, assignee } : s) };
    onUpdate(updated);
  }

  function saveScript(id, title, content) {
    const updated = { ...dayData, scripts: scripts.map(s => s.id === id ? { ...s, title, content } : s) };
    onUpdate(updated);
    setEditingScript(null);
  }

  function deleteScript(id) {
    const updated = { ...dayData, scripts: scripts.filter(s => s.id !== id) };
    onUpdate(updated);
  }

  function updateNotes(val) {
    onUpdate({ ...dayData, notes: val });
  }

  const tabs = [
    { id: 'todos', label: '✓ To-Do List', count: todos.length },
    { id: 'scripts', label: '📄 Scripts', count: scripts.length },
    { id: 'notes', label: '📝 Notes', count: notes.length > 0 ? 1 : 0 },
  ];

  return (
    <div className="dayview-overlay" onClick={onClose}>
      <div
        className="dayview"
        style={{ '--day-color': monthColor, '--day-accent': monthAccent }}
        onClick={e => e.stopPropagation()}
      >
        <div className="dayview__header" style={{ background: monthColor }}>
          <div>
            <div className="dayview__date">{formatDate(dayId)}</div>
            <div className="dayview__year">2026</div>
          </div>
          <button className="dayview__close" onClick={onClose}>✕</button>
        </div>

        <div className="dayview__tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`dayview__tab ${activeTab === tab.id ? 'dayview__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count > 0 && <span className="dayview__tab-badge">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="dayview__body">
          {activeTab === 'todos' && (
            <div className="dayview__todos">
              <div className="dayview__add-row">
                <input
                  className="dayview__input"
                  placeholder="Add a task..."
                  value={newTodo}
                  onChange={e => setNewTodo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTodo()}
                />
                <button className="dayview__add-btn" onClick={addTodo}>Add</button>
              </div>
              <AssigneePicker value={newTodoAssignee} onChange={setNewTodoAssignee} />
              {todos.length === 0 && <p className="dayview__empty">No tasks yet. Add one above.</p>}
              <ul className="dayview__todo-list">
                {todos.map(todo => (
                  <li key={todo.id} className={`dayview__todo-item ${todo.checked ? 'dayview__todo-item--done' : ''}`}>
                    <label className="dayview__todo-label">
                      <input
                        type="checkbox"
                        checked={todo.checked}
                        onChange={() => toggleTodo(todo.id)}
                        className="dayview__todo-checkbox"
                      />
                      <span className="dayview__todo-check-box">
                        {todo.checked ? '✓' : ''}
                      </span>
                      <span className="dayview__todo-text">{todo.text}</span>
                    </label>
                    <div className="dayview__todo-right">
                      <AssigneePicker value={todo.assignee} onChange={v => setTodoAssignee(todo.id, v)} />
                      <button className="dayview__delete" onClick={() => deleteTodo(todo.id)}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'scripts' && (
            <div className="dayview__scripts">
              <div className="dayview__script-add">
                <input
                  className="dayview__input"
                  placeholder="Script title..."
                  value={newScript.title}
                  onChange={e => setNewScript({ ...newScript, title: e.target.value })}
                />
                <textarea
                  className="dayview__textarea dayview__textarea--sm"
                  placeholder="Script content..."
                  value={newScript.content}
                  onChange={e => setNewScript({ ...newScript, content: e.target.value })}
                  rows={3}
                />
                <AssigneePicker value={newScriptAssignee} onChange={setNewScriptAssignee} />
                <button className="dayview__add-btn" onClick={addScript}>Add Script</button>
              </div>
              {scripts.length === 0 && <p className="dayview__empty">No scripts yet.</p>}
              <div className="dayview__script-list">
                {scripts.map(script => (
                  <div key={script.id} className="dayview__script-card">
                    {editingScript === script.id ? (
                      <ScriptEditor script={script} onSave={saveScript} onCancel={() => setEditingScript(null)} />
                    ) : (
                      <>
                        <div className="dayview__script-header">
                          <div className="dayview__script-title">{script.title}</div>
                          <AssigneeBadge name={script.assignee} />
                        </div>
                        <div className="dayview__script-preview">{script.content || <em>No content</em>}</div>
                        <div className="dayview__script-actions">
                          <AssigneePicker value={script.assignee} onChange={v => setScriptAssignee(script.id, v)} />
                          <button className="dayview__action-btn" onClick={() => setEditingScript(script.id)}>Edit</button>
                          <button className="dayview__action-btn dayview__action-btn--del" onClick={() => deleteScript(script.id)}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="dayview__notes">
              <textarea
                className="dayview__textarea dayview__textarea--full"
                placeholder="Write your notes here..."
                value={notes}
                onChange={e => updateNotes(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScriptEditor({ script, onSave, onCancel }) {
  const [title, setTitle] = useState(script.title);
  const [content, setContent] = useState(script.content);

  return (
    <div className="script-editor">
      <input className="dayview__input" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="dayview__textarea" value={content} onChange={e => setContent(e.target.value)} rows={6} />
      <div className="dayview__script-actions">
        <button className="dayview__add-btn" onClick={() => onSave(script.id, title, content)}>Save</button>
        <button className="dayview__action-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
