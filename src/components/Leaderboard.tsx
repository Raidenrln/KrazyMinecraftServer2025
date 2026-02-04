import { useContext, useEffect, useState } from "react";
import { DataContext } from "./DataContext";

const TABS = [
  "Played Time",
  "Mobs Killed",
  "Player Kills",
  "Deaths",
  "Blocks Mined",
  "Blocks Placed",
  "Items Crafted",
  "Items Broken",
  "Damage",
  "Distance",
];

interface PlayerStat {
  uuid: string;
  name: string;
  value: number;
  extra?: Record<string, number>; 
}

const Leaderboard = () => {
  const context = useContext(DataContext);
  const [statsData, setStatsData] = useState<PlayerStat[]>([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);

  if (!context) return null;
  const { data } = context;

  useEffect(() => {
    if (!data.length) return;

    const loadStats = async () => {
      const results: PlayerStat[] = [];

      for (const player of data) {
        try {
          const res = await fetch(`/KrazyMinecraft2025/stats/${player.uuid}.json`);
          if (!res.ok) throw new Error("Stats file not found");
          const json = await res.json();

          const stats = json.stats;
          const playedTime = stats["minecraft:custom"]?.["minecraft:play_time"] || 0;
          const mobsKilled = stats["minecraft:killed"] || {};
          const playerKills = stats["minecraft:custom"]?.["minecraft:player_kills"] || 0;
          const deaths = stats["minecraft:killed_by"] || {};
          const blocksMined = stats["minecraft:mined"] || {};
          const blocksPlaced = stats["minecraft:used"] || {};
          const itemsCrafted = stats["minecraft:crafted"] || {};
          const itemsBroken = stats["minecraft:broken"] || {};
          const damageDealt = stats["minecraft:custom"]?.["minecraft:damage_dealt"] || 0;
          const damageTaken = stats["minecraft:custom"]?.["minecraft:damage_taken"] || 0;
          const distanceTravelled = Object.entries(stats["minecraft:custom"] || {})
            .filter(([k]) =>
              [
                "minecraft:walk_one_cm",
                "minecraft:walk_under_water_one_cm",
                "minecraft:sprint_one_cm",
                "minecraft:swim_one_cm",
                "minecraft:fall_one_cm",
                "minecraft:fly_one_cm",
                "minecraft:climb_one_cm",
              ].includes(k)
            )
            .reduce((sum, [_, v]) => sum + (v as number), 0);

          results.push({
            uuid: player.uuid,
            name: player.name,
            value: 0,
            extra: {
              playedTime,
              mobsKilledTotal: Object.values(mobsKilled).reduce((a: number, b) => a + (b as number), 0),
              playerKills,
              deathsTotal: Object.values(deaths).reduce((a: number, b) => a + (b as number), 0),
              blocksMinedTotal: Object.values(blocksMined).reduce((a: number, b) => a + (b as number), 0),
              blocksPlacedTotal: Object.values(blocksPlaced).reduce((a: number, b) => a + (b as number), 0),
              itemsCraftedTotal: Object.values(itemsCrafted).reduce((a: number, b) => a + (b as number), 0),
              itemsBrokenTotal: Object.values(itemsBroken).reduce((a: number, b) => a + (b as number), 0),
              damageDealt,
              damageTaken,
              distanceTravelled,
              mobsKilled,
              deaths,
              blocksMined,
            },
          });
        } catch (err) {
          console.warn(`Stats missing for ${player.name}`);
          results.push({
            uuid: player.uuid,
            name: player.name,
            value: 0,
          });
        }
      }

      setStatsData(results);
      setLoading(false);
    };

    loadStats();
  }, [data]);

  if (loading) return <p className="text-white mt-4">Loading leaderboard...</p>;

  const tabSorted = statsData.map((p) => {
    if (!p.extra) return p;
    const e = p.extra;
    switch (activeTab) {
      case "Played Time":
        return { ...p, value: e.playedTime || 0 };
      case "Mobs Killed":
        return { ...p, value: e.mobsKilledTotal || 0 };
      case "Player Kills":
        return { ...p, value: e.playerKills || 0 };
      case "Deaths":
        return { ...p, value: e.deathsTotal || 0 };
      case "Blocks Mined":
        return { ...p, value: e.blocksMinedTotal || 0 };
      case "Blocks Placed":
        return { ...p, value: e.blocksPlacedTotal || 0 };
      case "Items Crafted":
        return { ...p, value: e.itemsCraftedTotal || 0 };
      case "Items Broken":
        return { ...p, value: e.itemsBrokenTotal || 0 };
      case "Damage":
        return { ...p, value: e.damageDealt || 0 };
      case "Distance":
        return { ...p, value: e.distanceTravelled || 0 };
      default:
        return p;
    }
  });

  const sorted = [...tabSorted].sort((a, b) => b.value - a.value).slice(0, 10);
  const formatNumber = (num: number) => num.toLocaleString();
  const formatDistance = (ticks: number) => (ticks / 100000).toFixed(2);
  const formatPlayTime = (ticks: number) => (ticks / 20 / 3600 / 24).toFixed(2);

  return (
    <div className="w-full flex flex-col py-4 items-center">
      <div className="w-full max-w-4xl mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="px-4 py-2 rounded bg-gray-300 text-black"
        >
          {TABS.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>

      {/* leaderboard table */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-center text-white">Rank</th>
              <th className="px-4 py-2 text-center text-white">Player</th>
              <th className="px-4 py-2 text-center text-white">{activeTab}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, uuid) => {
              let displayValue: string | number = p.value;
              if (activeTab === "Distance") displayValue = formatDistance(p.value);
              if (activeTab === "Played Time") displayValue = formatPlayTime(p.value);

              return (
                <tr
                  key={p.uuid}
                  className="border-t bg-gray-700"
                >
                  <td className="px-4 py-2 text-center text-white">{uuid + 1}</td>
                  <td className="px-4 py-2 text-center text-white">{p.name}</td>
                  <td className="px-4 py-2 text-center text-white">
                    {activeTab === "Distance"
                      ? `${displayValue} km`
                      : activeTab === "Played Time"
                      ? `${displayValue} Days`
                      : typeof displayValue === "number"
                      ? formatNumber(displayValue)
                      : displayValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
