import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./DataContext";

const TABS = [
  "minecraft:custom",
  "minecraft:crafted",
  "minecraft:dropped",
  "minecraft:killed",
  "minecraft:killed_by",
  "minecraft:mined",
  "minecraft:picked_up",
  "minecraft:used",
];

const distanceStats = [
  "minecraft:boat_one_cm",
  "minecraft:aviate_one_cm",
  "minecraft:happy_ghast_one_cm",
  "minecraft:crouch_one_cm",
  "minecraft:climb_one_cm",
  "minecraft:minecart_one_cm",
  "minecraft:walk_one_cm",
  "minecraft:walk_under_water_one_cm",
  "minecraft:sprint_one_cm",
  "minecraft:fly_one_cm",
  "minecraft:walk_on_water_one_cm",
  "minecraft:swim_one_cm",
  "minecraft:fall_one_cm",
  "minecraft:horse_one_cm",
  "minecraft:pig_one_cm",
  "minecraft:walk_off_water_one_cm",
];

const SeeAllStats = () => {
  const context = useContext(DataContext);
  const player = context?.selectedPlayer;
  const [stats, setStats] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("minecraft:custom");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"high" | "low">("high");

  // tabs scroll handling
  const tabsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    if (!player) return;

    fetch(`/KrazyMinecraft2025/stats/${player.uuid}.json`)
      .then((res) => res.json())
      .then((data: any) => setStats(data))
      .catch((err) => {
        console.error("Failed to load stats:", err);
        setStats(null);
      });
  }, [player]);

  if (!player) return <p className="text-white mt-4">No player selected</p>;
  if (!stats) return <p className="text-white mt-4">Loading stats...</p>;

  const statCategory = stats.stats[activeTab] || {};
  const statsArray: [string, number | string][] = Object.entries(statCategory);

  const formatNumber = (num: number) => num.toLocaleString();

  // mouse drag scroll
  const onMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftRef.current = tabsRef.current.scrollLeft;
  };
  const onMouseUp = () => (isDraggingRef.current = false);
  const onMouseLeave = () => (isDraggingRef.current = false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !tabsRef.current) return;
    const x = e.pageX - tabsRef.current.offsetLeft;
    tabsRef.current.scrollLeft = scrollLeftRef.current - (x - startXRef.current);
  };

  // touch drag scroll
  const onTouchStart = (e: React.TouchEvent) => {
    if (!tabsRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX - tabsRef.current.offsetLeft;
    scrollLeftRef.current = tabsRef.current.scrollLeft;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !tabsRef.current) return;
    const x = e.touches[0].pageX - tabsRef.current.offsetLeft;
    tabsRef.current.scrollLeft = scrollLeftRef.current - (x - startXRef.current);
  };
  const onTouchEnd = () => (isDraggingRef.current = false);

  // filter
  const filteredStats = statsArray
    .filter(([key]) =>
      key.replace("minecraft:", "").replace(/_/g, " ").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(([_, a], [__, b]) => {
      const valA = typeof a === "number" ? a : parseFloat(a as string) || 0;
      const valB = typeof b === "number" ? b : parseFloat(b as string) || 0;
      return sortOrder === "high" ? valB - valA : valA - valB;
    });
   // console.log(stats);
    
  return (
    <div className="rounded-lg w-full max-w-4xl">
      <h2 className="text-lg font-bold mb-4 text-white">Stats for {player.name}</h2>

      {/* tabs */}
      <div
        ref={tabsRef}
        className="flex space-x-2 mb-4 overflow-x-auto cursor-grab category_scrollbar py-2"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2 rounded text-sm sm:text-base ${
              activeTab === tab
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {tab.replace("minecraft:", "")}
          </button>
        ))}
      </div>

      {/* search & sort */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stats..."
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "high" | "low")}
          className="w-full sm:w-40 p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none"
        >
          <option value="high">High → Low</option>
          <option value="low">Low → High</option>
        </select>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left">Stats</th>
              <th className="px-4 py-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredStats.map(([key, value]) => {
              let displayValue: string | number = value as any;

              if (key === "minecraft:play_time" || key === "minecraft:time_since_rest" || key === "minecraft:total_world_time" || key === "minecraft:sneak_time" || key === "") {
                displayValue = ((value as number) / 20 / 3600 / 24).toFixed(2) + " Days";
              } else if (distanceStats.includes(key)) {
                displayValue = ((value as number) / 100000).toFixed(2) + " km";
              } else if (typeof value === "number") {
                displayValue = formatNumber(value);
              }

              return (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-4 py-2 capitalize">
                    {key.replace("minecraft:", "").replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-2 text-right">{displayValue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeeAllStats;
