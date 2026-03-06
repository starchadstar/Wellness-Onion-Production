import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import ItemBoard from './components/ItemBoard';
import { loadData, saveData } from './utils/storage';
import './App.css';

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
        {activeView === 'dashboard' && (
          <Dashboard onNavigate={setActiveView} />
        )}
        {activeView === 'calendar' && (
          <Board data={data} onDataChange={handleDataChange} />
        )}
        {activeView === 'storyboards' && (
          <ItemBoard
            title="Story Boards"
            subtitle="Scene Planning"
            icon="🎬"
            items={data.storyboards || []}
            onItemsChange={items => handleDataChange({ ...data, storyboards: items })}
          />
        )}
        {activeView === 'topics' && (
          <ItemBoard
            title="Topics"
            subtitle="Content Ideas"
            icon="📋"
            items={data.topics || []}
            onItemsChange={items => handleDataChange({ ...data, topics: items })}
          />
        )}
      </main>
    </div>
  );
}
