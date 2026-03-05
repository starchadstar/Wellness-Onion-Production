import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import { loadData, saveData } from './utils/storage';
import './App.css';

function ComingSoon({ title, icon }) {
  return (
    <div className="coming-soon">
      <div className="coming-soon__icon">{icon}</div>
      <h2 className="coming-soon__title">{title}</h2>
      <p className="coming-soon__text">This section is coming soon.</p>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [data, setData] = useState(() => loadData());

  const handleDataChange = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="app-main">
        {activeView === 'dashboard'    && <Dashboard onNavigate={setActiveView} />}
        {activeView === 'calendar'     && <Board data={data} onDataChange={handleDataChange} />}
        {activeView === 'storyboards'  && <ComingSoon title="Story Boards" icon="🎬" />}
        {activeView === 'topics'       && <ComingSoon title="Topics" icon="📋" />}
      </main>
    </div>
  );
}
