import { useState } from 'react';
import TopSection from './components/TopSection';
import ServerStats from './components/ServerStats';
import UserInput from './components/UserInput';
import Leaderboard from './components/Leaderboard';
import type { JSX } from 'react/jsx-runtime';

function App() {
  const [activePage, setActivePage] = useState('serverStats');

  const pages: Record<string, JSX.Element> = {
    serverStats: <ServerStats />,
    playerSearch: <UserInput />,
    leaderboard: <Leaderboard />,
  };

  return (
    <div className="w-full">
      <TopSection setActivePage={setActivePage} />
        <div className="flex justify-center items-center m-2">
          {pages[activePage]}
        </div>
    </div>
  );
}

export default App;
