const DASHBOARD_ITEMS = [
  {
    id: 'calendar',
    num: '01',
    icon: '📹',
    title: 'Video Project Calendar',
    description: 'Plan and schedule your 2026 video production. Track tasks, scripts, and notes by month and day.',
    color: '#C17F5E',
    shadow: '#A06445',
    bg: '#F5E6D8',
  },
  {
    id: 'storyboards',
    num: '02',
    icon: '🎬',
    title: 'Story Boards',
    description: 'Visualize your scenes and sequences. Organize shots, angles, and narrative flow for each production.',
    color: '#8B9E7E',
    shadow: '#5D8161',
    bg: '#E6EFE3',
  },
  {
    id: 'topics',
    num: '03',
    icon: '📋',
    title: 'Topics',
    description: 'Brainstorm and manage video topics. Build a library of ideas, themes, and content pillars.',
    color: '#B5A36B',
    shadow: '#9A8850',
    bg: '#F0EBD5',
  },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__welcome">Welcome back</div>
        <h1 className="dashboard__title">Wellness Onion</h1>
        <p className="dashboard__subtitle">Your 2026 video production hub</p>
      </div>

      <div className="dashboard__grid">
        {DASHBOARD_ITEMS.map(item => (
          <button
            key={item.id}
            className="dash-card"
            style={{
              '--card-color': item.color,
              '--card-shadow': item.shadow,
              '--card-bg': item.bg,
            }}
            onClick={() => onNavigate(item.id)}
          >
            <div className="dash-card__top">
              <span className="dash-card__num">{item.num}</span>
              <span className="dash-card__icon">{item.icon}</span>
            </div>
            <div className="dash-card__accent-bar" />
            <h2 className="dash-card__title">{item.title}</h2>
            <p className="dash-card__desc">{item.description}</p>
            <div className="dash-card__arrow">Open →</div>
          </button>
        ))}
      </div>
    </div>
  );
}
