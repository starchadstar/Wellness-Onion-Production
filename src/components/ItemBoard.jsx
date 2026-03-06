import { useState } from 'react';

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

// Earth tone palette (mirrors MONTH_TEMPLATE colors)
const COLOR_PALETTE = [
  { color: '#D4B896', shadow: '#B89A7A', accent: '#8B6F5A' },
  { color: '#C17F5E', shadow: '#A06445', accent: '#7A4A30' },
  { color: '#8B9E7E', shadow: '#6E8162', accent: '#4F6349' },
  { color: '#C9A87C', shadow: '#AE8D60', accent: '#8A6D44' },
  { color: '#B5A36B', shadow: '#9A8850', accent: '#776735' },
  { color: '#A67B5B', shadow: '#8C6140', accent: '#6A4525' },
  { color: '#CC8B65', shadow: '#B07049', accent: '#8B5232' },
  { color: '#7A9E7E', shadow: '#5D8161', accent: '#3E6345' },
  { color: '#B56B5E', shadow: '#9A5044', accent: '#7A3328' },
  { color: '#9E7A5A', shadow: '#835F3F', accent: '#634424' },
  { color: '#C4A882', shadow: '#A98D66', accent: '#856C4A' },
  { color: '#6B8E7A', shadow: '#4E7160', accent: '#315345' },
];

function getColor(idx) {
  return COLOR_PALETTE[Math.abs(idx) % COLOR_PALETTE.length];
}

// ─── Main Board ────────────────────────────────────────────────────────────
export default function ItemBoard({ title, subtitle, icon, items, onItemsChange }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [dragId,      setDragId]      = useState(null);
  const [dragOverId,  setDragOverId]  = useState(null);

  // Derive next card color from current count
  const nextColor = getColor(items.length);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  function handleAdd(formData) {
    const newItem = { id: genId(), colorIdx: items.length, ...formData };
    onItemsChange([...items, newItem]);
    setShowAddForm(false);
  }

  function handleUpdate(formData) {
    onItemsChange(items.map(item =>
      item.id === editItem.id ? { ...item, ...formData } : item
    ));
    setEditItem(null);
  }

  function handleDelete(id) {
    onItemsChange(items.filter(item => item.id !== id));
    setEditItem(null);
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  function handleDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    // ghost image is the card itself — browser default looks fine
  }

  function handleDragOver(e, id) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragOverId) setDragOverId(id);
  }

  function handleDrop(e, targetId) {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const next = [...items];
    const fromIdx = next.findIndex(c => c.id === dragId);
    const toIdx   = next.findIndex(c => c.id === targetId);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onItemsChange(next);
    setDragId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDragId(null);
    setDragOverId(null);
  }

  // Singular label for modal title / add hint
  const singular = title.endsWith('s') ? title.slice(0, -1) : title;

  return (
    <div className="board-wrap">
      <div className="board">

        {/* ── Header ── */}
        <div className="board__header">
          <div className="board__title-wrap">
            <div className="board__marker-line" />
            <h1 className="board__title">{title}</h1>
            <div className="board__subtitle">{subtitle}</div>
            <div className="board__marker-line" />
          </div>
          <div className="board__tray">
            <div className="board__marker board__marker--brown" />
            <div className="board__marker board__marker--green" />
            <div className="board__marker board__marker--red" />
            <div className="board__eraser" />
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="board__postits">
          {items.map((item) => {
            const clr      = getColor(item.colorIdx ?? 0);
            const isDragging  = dragId      === item.id;
            const isDragOver  = dragOverId  === item.id && dragId !== item.id;

            return (
              <div
                key={item.id}
                className={`item-card${isDragging ? ' item-card--dragging' : ''}${isDragOver ? ' item-card--drag-over' : ''}`}
                style={{
                  '--postit-color':  clr.color,
                  '--postit-shadow': clr.shadow,
                  '--postit-accent': clr.accent,
                }}
                draggable
                onDragStart={e => handleDragStart(e, item.id)}
                onDragOver={e  => handleDragOver(e,  item.id)}
                onDrop={e      => handleDrop(e,      item.id)}
                onDragEnd={handleDragEnd}
                onClick={() => setEditItem(item)}
              >
                <div className="item-card__tape" />
                <div className="item-card__body">
                  <div className="item-card__title">{item.title}</div>
                  {item.description && (
                    <div className="item-card__desc">{item.description}</div>
                  )}
                </div>
                <div className="item-card__drag-handle" title="Drag to reorder">⠿</div>
              </div>
            );
          })}

          {/* Add new tile */}
          <button
            className="postit-add"
            onClick={() => setShowAddForm(true)}
            title={`Add new ${singular}`}
            style={{ '--add-color': nextColor.color, '--add-accent': nextColor.accent }}
          >
            <div className="postit-add__tape" />
            <span className="postit-add__plus">+</span>
            <span className="postit-add__label">Add New</span>
            <span className="postit-add__hint">New {singular}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="board__footer">
          <span className="board__brand">{icon} {title}</span>
        </div>
      </div>

      {/* Add modal */}
      {showAddForm && (
        <ItemFormModal
          heading={`New ${singular}`}
          onSave={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Edit modal */}
      {editItem && (
        <ItemFormModal
          heading={`Edit ${singular}`}
          initial={editItem}
          onSave={handleUpdate}
          onDelete={() => handleDelete(editItem.id)}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
}

// ─── Add / Edit Modal ──────────────────────────────────────────────────────
function ItemFormModal({ heading, initial, onSave, onDelete, onClose }) {
  const [titleVal, setTitleVal] = useState(initial?.title       || '');
  const [descVal,  setDescVal]  = useState(initial?.description || '');

  function handleSubmit() {
    if (!titleVal.trim()) return;
    onSave({ title: titleVal.trim(), description: descVal.trim() });
  }

  return (
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal" onClick={e => e.stopPropagation()}>

        <div className="item-modal__header">
          <h2 className="item-modal__heading">{heading}</h2>
          <button className="item-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="item-modal__body">
          <label className="item-modal__label">Title</label>
          <input
            className="item-modal__input"
            placeholder="Enter a title…"
            value={titleVal}
            onChange={e => setTitleVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          <label className="item-modal__label">Description</label>
          <textarea
            className="item-modal__textarea"
            placeholder="Add a description…"
            value={descVal}
            onChange={e => setDescVal(e.target.value)}
            rows={4}
          />
        </div>

        <div className="item-modal__footer">
          {onDelete && (
            <button className="item-modal__delete" onClick={onDelete}>Delete</button>
          )}
          <div className="item-modal__actions">
            <button className="item-modal__cancel" onClick={onClose}>Cancel</button>
            <button className="item-modal__save"   onClick={handleSubmit}>
              {initial ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
