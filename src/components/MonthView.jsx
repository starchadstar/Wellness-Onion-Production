import { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, getDayData, updateDayData, getMonthStats } from '../utils/storage';
import DayView from './DayView';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function hasDayContent(dayData) {
  return (
    (dayData.todos && dayData.todos.length > 0) ||
    (dayData.scripts && dayData.scripts.length > 0) ||
    (dayData.notes && dayData.notes.trim().length > 0)
  );
}

export default function MonthView({ month, data, onDataChange, onClose }) {
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedDays, setExpandedDays] = useState(new Set());

  const days = getDaysInMonth(month.id);
  const firstDow = getFirstDayOfMonth(month.id);
  const stats = getMonthStats(data, month.id);

  function handleDayUpdate(dayId, dayData) {
    onDataChange(updateDayData(data, month.id, dayId, dayData));
  }

  function toggleExpand(dayId, e) {
    e.stopPropagation();
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(dayId) ? next.delete(dayId) : next.add(dayId);
      return next;
    });
  }

  function toggleTodoInline(dayId, todoId) {
    const dayData = getDayData(data, month.id, dayId);
    const updated = {
      ...dayData,
      todos: dayData.todos.map(t => t.id === todoId ? { ...t, checked: !t.checked } : t),
    };
    handleDayUpdate(dayId, updated);
  }

  return (
    <div className="monthview-overlay" onClick={onClose}>
      <div
        className="monthview"
        style={{ '--month-color': month.color, '--month-shadow': month.shadow, '--month-accent': month.accent }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="monthview__header" style={{ background: `linear-gradient(135deg, ${month.color}, ${month.shadow})` }}>
          <div className="monthview__header-left">
            <button className="monthview__back" onClick={onClose}>← Back to Board</button>
            <h2 className="monthview__title">{month.name} {month.year}</h2>
            {stats.totalTodos > 0 && (
              <span className="monthview__stats">
                {stats.completedTodos} of {stats.totalTodos} tasks complete
              </span>
            )}
          </div>
          <div className="monthview__controls">
            <button
              className={`monthview__toggle ${viewMode === 'calendar' ? 'monthview__toggle--active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >⊞ Calendar</button>
            <button
              className={`monthview__toggle ${viewMode === 'list' ? 'monthview__toggle--active' : ''}`}
              onClick={() => setViewMode('list')}
            >☰ List</button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="monthview__calendar">
            <div className="cal__dow-row">
              {DOW.map(d => <div key={d} className="cal__dow">{d}</div>)}
            </div>
            <div className="cal__grid">
              {Array.from({ length: firstDow }).map((_, i) => (
                <div key={`blank-${i}`} className="cal__blank" />
              ))}
              {days.map(dayId => {
                const dayData = getDayData(data, month.id, dayId);
                const dayNum = parseInt(dayId.split('-')[2], 10);
                const dow = new Date(dayId).getDay();
                const hasContent = hasDayContent(dayData);
                const allDone = dayData.todos?.length > 0 && dayData.todos.every(t => t.checked);

                return (
                  <div
                    key={dayId}
                    className={`cal__day ${hasContent ? 'cal__day--has-content' : ''} ${allDone ? 'cal__day--done' : ''}`}
                    onClick={() => setSelectedDay(dayId)}
                  >
                    <span className="cal__day-num">{dayNum}</span>
                    <span className="cal__day-dow">{DOW[dow]}</span>
                    {hasContent && (
                      <div className="cal__day-dots">
                        {dayData.todos?.length > 0 && <span className="cal__dot cal__dot--todo" />}
                        {dayData.scripts?.length > 0 && <span className="cal__dot cal__dot--script" />}
                        {dayData.notes?.trim() && <span className="cal__dot cal__dot--note" />}
                      </div>
                    )}
                    {allDone && <span className="cal__check">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="monthview__list">
            {days.map(dayId => {
              const dayData = getDayData(data, month.id, dayId);
              const dayNum = parseInt(dayId.split('-')[2], 10);
              const dow = new Date(dayId).getDay();
              const hasContent = hasDayContent(dayData);
              const todos = dayData.todos || [];
              const scripts = dayData.scripts || [];
              const notes = dayData.notes || '';
              const completedTodos = todos.filter(t => t.checked).length;
              const isExpanded = expandedDays.has(dayId);

              return (
                <div key={dayId} className={`list__day ${hasContent ? 'list__day--active' : ''}`}>
                  {/* Day header row */}
                  <div className="list__day-header">
                    {/* Expand toggle */}
                    <button
                      className={`list__expand-btn ${isExpanded ? 'list__expand-btn--open' : ''}`}
                      onClick={e => toggleExpand(dayId, e)}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      ▶
                    </button>

                    {/* Day info */}
                    <div className="list__day-info" onClick={e => toggleExpand(dayId, e)} style={{ cursor: 'pointer', flex: 1 }}>
                      <span className="list__dow">{FULL_DOW[dow]}</span>
                      <span className="list__date">{month.name} {dayNum}</span>
                    </div>

                    {/* Badges + open button */}
                    <div className="list__day-meta">
                      {todos.length > 0 && (
                        <span className={`list__task-count ${completedTodos === todos.length ? 'list__task-count--done' : ''}`}>
                          {completedTodos === todos.length ? '✓' : `${completedTodos}/${todos.length}`} tasks
                        </span>
                      )}
                      {scripts.length > 0 && (
                        <span className="list__badge list__badge--script">{scripts.length} script{scripts.length > 1 ? 's' : ''}</span>
                      )}
                      {notes.trim() && (
                        <span className="list__badge list__badge--note">notes</span>
                      )}
                      <button
                        className="list__open-btn"
                        onClick={e => { e.stopPropagation(); setSelectedDay(dayId); }}
                        title="Open day"
                      >✎</button>
                    </div>
                  </div>

                  {/* Inline dropdown items */}
                  {isExpanded && (
                    <div className="list__dropdown">
                      {todos.length === 0 && scripts.length === 0 && !notes.trim() && (
                        <p className="list__dropdown-empty">No items yet —
                          <button className="list__dropdown-add" onClick={() => setSelectedDay(dayId)}>add some</button>
                        </p>
                      )}

                      {todos.length > 0 && (
                        <div className="list__dropdown-section">
                          <span className="list__dropdown-label">To-Do</span>
                          {todos.map(t => (
                            <label key={t.id} className={`list__dropdown-item list__dropdown-item--todo ${t.checked ? 'list__dropdown-item--checked' : ''}`}>
                              <input
                                type="checkbox"
                                checked={t.checked}
                                onChange={() => toggleTodoInline(dayId, t.id)}
                                className="list__dropdown-checkbox"
                              />
                              <span className="list__dropdown-check-box">{t.checked ? '✓' : ''}</span>
                              <span className="list__dropdown-text">{t.text}</span>
                              {t.assignee && <span className={`assignee-badge assignee-badge--${t.assignee}`}>{t.assignee}</span>}
                            </label>
                          ))}
                        </div>
                      )}

                      {scripts.length > 0 && (
                        <div className="list__dropdown-section">
                          <span className="list__dropdown-label">Scripts</span>
                          {scripts.map(s => (
                            <div key={s.id} className="list__dropdown-item list__dropdown-item--script">
                              <span className="list__dropdown-icon">📄</span>
                              <span className="list__dropdown-text">{s.title}</span>
                              {s.assignee && <span className={`assignee-badge assignee-badge--${s.assignee}`}>{s.assignee}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {notes.trim() && (
                        <div className="list__dropdown-section">
                          <span className="list__dropdown-label">Notes</span>
                          <div className="list__dropdown-item list__dropdown-item--note">
                            <span className="list__dropdown-icon">📝</span>
                            <span className="list__dropdown-text list__dropdown-text--notes">
                              {notes.length > 120 ? notes.slice(0, 120) + '…' : notes}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDay && (
        <DayView
          dayId={selectedDay}
          dayData={getDayData(data, month.id, selectedDay)}
          onUpdate={(dayData) => handleDayUpdate(selectedDay, dayData)}
          onClose={() => setSelectedDay(null)}
          monthColor={month.color}
          monthAccent={month.accent}
        />
      )}
    </div>
  );
}
