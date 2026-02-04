import type { Dispatch, SetStateAction } from 'react';

interface DropDownListProps {
  setActivePage: Dispatch<SetStateAction<string>>;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const DropDownList = ({ setActivePage, setMenuOpen }: DropDownListProps) => {
  const handleClick = (page: string) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <div className="flex w-36 flex-col rounded-lg shadow-lg absolute right-5 top-15 mt-2 bg-gray-800">
      <div className="flex flex-col p-2 gap-4">
        <button
          className="bg-gray-600 rounded-xs text-white h-10"
          onClick={() => handleClick('serverStats')}
        >
          Home
        </button>

        <button
          className="bg-gray-600 rounded-xs text-white h-10"
          onClick={() => handleClick('playerSearch')}
        >
          Search Player
        </button>

        <button
          className="bg-gray-600 rounded-xs text-white h-10"
          onClick={() => handleClick('leaderboard')}
        >
          Leaderboard
        </button>

        <button
          className="bg-gray-600 rounded-xs text-white h-10"
          onClick={() => handleClick('settings')}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default DropDownList;
