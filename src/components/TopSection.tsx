import { useState } from 'react';
import DropDownList from './DropDownList';
import type { Dispatch, SetStateAction } from 'react';

interface TopSectionProps {
  setActivePage: Dispatch<SetStateAction<string>>;
}

const TopSection = ({ setActivePage }: TopSectionProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full h-16 flex justify-between items-center px-4 relative bg-gray-900 shadow-md">
      <h1 className="text-white text-2xl">Krazy Server</h1>

      {/* Toggle button */}
      <button
        className="text-white p-2 rounded"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <img
          src={
            menuOpen
              ? '/KrazyMinecraft2025/assets/close.png'
              : '/KrazyMinecraft2025/assets/menu.png'
          }
          alt="Menu Icon"
          className="w-8 h-8"
        />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <DropDownList
          setActivePage={setActivePage}
          setMenuOpen={setMenuOpen}
        />
      )}
    </div>
  );
};

export default TopSection;
