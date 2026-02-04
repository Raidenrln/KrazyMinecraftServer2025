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
<<<<<<< HEAD
              ? '/KrazyMinecraft2025/assets/close.png'
              : '/KrazyMinecraft2025/assets/menu.png'
=======
              ? '/KrazyMinecraftServer2025/assets/close.png'
              : '/KrazyMinecraftServer2025/assets/menu.png'
>>>>>>> bf1c3f529fe991c4fa0ff275ccf572127882cf15
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
