const NAV_ITEMS = [
  { id: 'calendar',    label: 'Video Project Calendar', icon: '📹' },
  { id: 'storyboards', label: 'Story Boards',           icon: '🎬' },
  { id: 'topics',      label: 'Topics',                 icon: '📋' },
];

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <button className="sidebar__brand" onClick={() => onNavigate('dashboard')}>
        <span className="sidebar__brand-icon">🧅</span>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">Wellness</span>
          <span className="sidebar__brand-name sidebar__brand-name--accent">Onion</span>
        </div>
      </button>

      {/* Nav */}
      <nav className="sidebar__nav">
        <div className="sidebar__nav-label">Menu</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar__nav-item ${activeView === item.id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            <span className="sidebar__nav-text">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span>2026 Production</span>
      </div>
    </aside>
  );
}
