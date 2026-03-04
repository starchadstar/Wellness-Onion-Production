import { useState } from 'react';
import PostIt from './PostIt';
import MonthView from './MonthView';
import { getMonthConfig, getNextMonthId, addMonthToData, updateMonthCompleted, DEFAULT_MONTH_LIST } from '../utils/storage';

export default function Board({ data, onDataChange }) {
  const [openMonth, setOpenMonth] = useState(null);

  const monthList = data.monthList || DEFAULT_MONTH_LIST;
  const months = monthList.map(getMonthConfig);
  const activeMonth = months.find(m => m.id === openMonth);

  function handleToggleComplete(monthId, completed) {
    onDataChange(updateMonthCompleted(data, monthId, completed));
  }

  function handleAddMonth() {
    onDataChange(addMonthToData(data));
  }

  const nextMonthConfig = getMonthConfig(getNextMonthId(monthList));

  return (
    <div className="board-wrap">
      <div className="board">
        {/* Board header */}
        <div className="board__header">
          <div className="board__title-wrap">
            <div className="board__marker-line" />
            <h1 className="board__title">Video Project Board</h1>
            <div className="board__subtitle">Production Schedule</div>
            <div className="board__marker-line" />
          </div>
          <div className="board__tray">
            <div className="board__marker board__marker--brown" />
            <div className="board__marker board__marker--green" />
            <div className="board__marker board__marker--red" />
            <div className="board__eraser" />
          </div>
        </div>

        {/* Post-its grid */}
        <div className="board__postits">
          {months.map((month) => (
            <PostIt
              key={month.id}
              month={month}
              data={data}
              onOpen={setOpenMonth}
              onToggleComplete={handleToggleComplete}
            />
          ))}

          {/* Add month tile */}
          <button
            className="postit-add"
            onClick={handleAddMonth}
            title={`Add ${nextMonthConfig.name} ${nextMonthConfig.year}`}
            style={{ '--add-color': nextMonthConfig.color, '--add-accent': nextMonthConfig.accent }}
          >
            <div className="postit-add__tape" />
            <span className="postit-add__plus">+</span>
            <span className="postit-add__label">
              {nextMonthConfig.short} {nextMonthConfig.year}
            </span>
            <span className="postit-add__hint">Add month</span>
          </button>
        </div>

        {/* Board footer */}
        <div className="board__footer">
          <span className="board__brand">📹 Video Project Board</span>
        </div>
      </div>

      {/* Month modal */}
      {openMonth && activeMonth && (
        <MonthView
          month={activeMonth}
          data={data}
          onDataChange={onDataChange}
          onClose={() => setOpenMonth(null)}
        />
      )}
    </div>
  );
}
