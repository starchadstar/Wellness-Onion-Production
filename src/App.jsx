import { useState, useCallback } from 'react';
import Board from './components/Board';
import { loadData, saveData } from './utils/storage';
import './App.css';

export default function App() {
  const [data, setData] = useState(() => loadData());

  const handleDataChange = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, []);

  return <Board data={data} onDataChange={handleDataChange} />;
}
