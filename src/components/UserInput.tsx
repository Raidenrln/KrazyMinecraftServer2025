import { useState, useContext } from "react";
import { DataContext, type Player } from "./DataContext";
import SeeAllStats from "./SeeAllStats";
import Summary from "./Summary";

const UserInput = () => {
  const context = useContext(DataContext);
  if (!context) return null;

  const { data, setSelectedPlayer } = context;
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Player | null>(null);
  const [showStats, setShowStats] = useState(false); 
  const [showSummary, setShowSummary] = useState(false);

  const handleSearch = () => {
    if (data.length === 0) return;

    const trimmedInput = input.trim();
    const player = data.find((p) => p.name === trimmedInput);

    if (player) {
      setResult(player);
      setSelectedPlayer(player);
      setShowStats(false);
      setShowSummary(false);
    } else {
      setResult(null);
      setShowStats(false);
      setShowSummary(false);
    }
  };

  const handle2025Summary = () => {
    if (!result) return;
    setSelectedPlayer(result);
    setShowSummary((prev) => !prev);
    setShowStats(false);
  };

  const handleSeeAllStats = () => {
    if (!result) return;
    setSelectedPlayer(result);
    setShowStats((prev) => !prev);
    setShowSummary(false);
  };

  return (
    <div className="w-full flex flex-col p-4 max-w-[700px]">
      {/* search Bar */}
      <div className="w-full flex flex-col sm:flex-row gap-2 mb-4 text-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 border border-gray-700 rounded-lg p-2 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* player Card */}
      {result && (
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-6 p-4 bg-gray-100 rounded-lg border-4 border-gray-800 shadow-lg">

          {/* image */}
          <div className="flex flex-col items-center w-full sm:w-auto">
            <div className="w-48 h-48 relative transform hover:scale-110 transition-transform duration-300 cursor-pointer">
              <img
                src={result.skin || "https://imgur.com/JumKzX7.png"}
                alt="Minecraft Skin"
                className="absolute w-48 h-48 object-cover rounded image-rendering-pixelated border-2 border-gray-800"
              />
            </div>
          </div>

          {/* info */}
          <div className="flex flex-col justify-between gap-4 flex-1">
            <div>
              <h2 className="text-xl font-bold mb-2">Player Info:</h2>
              <p><strong>Name:</strong> {result.name}</p>
              <p><strong>UUID:</strong> {result.uuid}</p>
            </div>

            <hr className="hidden sm:block" />

            {/* buttons */}
            <div className="flex flex-row gap-3 w-full mt-2 sm:mt-0 sm:self-start">
              <div
                className="flex-1 flex justify-center relative cursor-pointer transform hover:scale-105 transition"
                onClick={handle2025Summary}
              >
                <img
                  src="/KrazyMinecraft2025/assets/background_btn.png"
                  alt="2025 Summary"
                  className="w-full h-12 block"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none">
                  {showSummary ? "Hide Summary" : "2025 Summary"}
                </span>
              </div>

              <div
                className="flex-1 flex justify-center relative cursor-pointer transform hover:scale-105 transition"
                onClick={handleSeeAllStats}
              >
                <img
                  src="/KrazyMinecraft2025/assets/background_btn.png"
                  alt="See All Stats"
                  className="w-full h-12 block"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none">
                  {showStats ? "Hide Stats" : "See All Stats"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* responsive SeeAllStats */}
      {showStats && (
        <div className="w-full max-w-3xl mt-6 sm:px-0">
          <SeeAllStats />
        </div>
      )}

      {/* responsive Summary */}
      {showSummary && (
        <div className="w-full max-w-3xl mt-6 px-2 sm:px-0 items-center flex flex-col justify-center">
          <Summary />
        </div>
      )}
    </div>
  );
};

export default UserInput;
