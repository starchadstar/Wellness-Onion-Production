import { getMonthStats } from '../utils/storage';

export default function PostIt({ month, data, onOpen, onToggleComplete }) {
  const stats = getMonthStats(data, month.id);
  const monthData = data.months[month.id] || {};
  const isCompleted = monthData.completed || false;

  function handleCheckbox(e) {
    e.stopPropagation();
    onToggleComplete(month.id, !isCompleted);
  }

  return (
    <div
      className={`postit ${isCompleted ? 'postit--completed' : ''}`}
      style={{ '--postit-color': month.color, '--postit-shadow': month.shadow, '--postit-accent': month.accent }}
      onClick={() => onOpen(month.id)}
    >
      <div className="postit__tape" />

      <div className="postit__header">
        <div className="postit__month-label">
          <span className="postit__short">{month.short}</span>
          <span className="postit__year">2026</span>
        </div>
        <label className="postit__check-wrap" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckbox}
            className="postit__checkbox"
          />
          <span className="postit__checkmark" title="Mark month complete">
            {isCompleted ? '✓' : ''}
          </span>
        </label>
      </div>

      <div className="postit__name">{month.name}</div>

      <div className="postit__footer">
        {stats.totalTodos > 0 ? (
          <span className="postit__stats">
            {stats.completedTodos}/{stats.totalTodos} tasks
          </span>
        ) : (
          <span className="postit__stats postit__stats--empty">No tasks yet</span>
        )}
        <span className="postit__open-hint">Click to open →</span>
      </div>

      {isCompleted && <div className="postit__done-stamp">DONE</div>}
    </div>
  );
}
