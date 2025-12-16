import { useContext, useEffect, useState } from "react";
import { DataContext } from "./DataContext";

interface ServerStats {
  totalPlaytime: number;
  mobsKilled: Record<string, number>;
  playerKills: number;
  deaths: Record<string, number>;
  blocksMined: Record<string, number>;
  blocksPlaced: Record<string, number>;
  itemsCrafted: Record<string, number>;
  itemsBroken: Record<string, number>;
  damageDealt: number;
  damageTaken: number;
  distanceTravelled: number;
}

const ServerStatsOverview = () => {
  const context = useContext(DataContext);
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [loading, setLoading] = useState(true);

  if (!context) return null;
  const { data } = context;

  useEffect(() => {
    if (!data.length) return;

    const loadStats = async () => {
      const statsAggregate: ServerStats = {
        totalPlaytime: 0,
        mobsKilled: {},
        playerKills: 0,
        deaths: {},
        blocksMined: {},
        blocksPlaced: {},
        itemsCrafted: {},
        itemsBroken: {},
        damageDealt: 0,
        damageTaken: 0,
        distanceTravelled: 0,
      };

      for (const player of data) {
        try {
          const res = await fetch(`/KrazyMinecraftServer2025/stats/${player.uuid}.json`);
          if (!res.ok) continue;

          const json = await res.json();
          const stats = json.stats;

          const custom = stats["minecraft:custom"] || {};

          // Playtime
          statsAggregate.totalPlaytime += custom["minecraft:play_time"] || 0;

          // Player kills (PvP)
          statsAggregate.playerKills += custom["minecraft:player_kills"] || 0;

          // Damage dealt/taken
          statsAggregate.damageDealt += custom["minecraft:damage_dealt"] || 0;
          statsAggregate.damageTaken += custom["minecraft:damage_taken"] || 0;

          // Distance travelled
          const distanceKeys = [
            "minecraft:walk_one_cm",
            "minecraft:walk_under_water_one_cm",
            "minecraft:sprint_one_cm",
            "minecraft:swim_one_cm",
            "minecraft:fall_one_cm",
            "minecraft:fly_one_cm",
            "minecraft:climb_one_cm",
          ];
          distanceKeys.forEach((k) => {
            statsAggregate.distanceTravelled += custom[k] || 0;
          });

          // Mobs killed
          const mobs = stats["minecraft:killed"] || {};
          Object.entries(mobs).forEach(([mob, count]) => {
            statsAggregate.mobsKilled[mob] = (statsAggregate.mobsKilled[mob] || 0) + (count as number);
          });

          // Deaths
          const deaths = stats["minecraft:killed_by"] || {};
          Object.entries(deaths).forEach(([cause, count]) => {
            statsAggregate.deaths[cause] = (statsAggregate.deaths[cause] || 0) + (count as number);
          });

          // Blocks mined
          const mined = stats["minecraft:mined"] || {};
          Object.entries(mined).forEach(([block, count]) => {
            statsAggregate.blocksMined[block] = (statsAggregate.blocksMined[block] || 0) + (count as number);
          });

          // Blocks placed
          const placed = stats["minecraft:used"] || {};
          Object.entries(placed).forEach(([block, count]) => {
            statsAggregate.blocksPlaced[block] = (statsAggregate.blocksPlaced[block] || 0) + (count as number);
          });

          // Items crafted
          const crafted = stats["minecraft:crafted"] || {};
          Object.entries(crafted).forEach(([item, count]) => {
            statsAggregate.itemsCrafted[item] = (statsAggregate.itemsCrafted[item] || 0) + (count as number);
          });

          // Items broken
          const broken = stats["minecraft:broken"] || {};
          Object.entries(broken).forEach(([item, count]) => {
            statsAggregate.itemsBroken[item] = (statsAggregate.itemsBroken[item] || 0) + (count as number);
          });

        } catch (err) {
          console.warn(`Failed to load stats for ${player.name}`);
        }
      }

      setServerStats(statsAggregate);
      setLoading(false);
    };

    loadStats();
  }, [data]);

  if (loading) return <p className="text-white mt-4">Loading server stats...</p>;
  if (!serverStats) return null;

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDays = (ticks: number) => (ticks / 20 / 3600 / 24).toFixed(2);
  const formatDistance = (cm: number) => (cm / 100000).toFixed(2);

  return (
    <div className="flex w-[500px] bg-gray-900 p-0.5 items-center rounded-lg shadow-gray-900 shadow-md">
      <div className="flex flex-col bg-gray-700 p-4 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Server Stats Overview</h2>
          <ul className="text-white space-y-2">
            <li className="flex justify-between">
              <span>Total Playtime</span>
              <span>{formatDays(serverStats.totalPlaytime)} days</span>
            </li>
            <li className="flex justify-between">
              <span>Total Player Kills</span>
              <span>{formatNumber(serverStats.playerKills)}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Deaths</span>
              <span>{formatNumber(Object.values(serverStats.deaths).reduce((a, b) => a + b, 0))}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Mobs Killed</span>
              <span>{formatNumber(Object.values(serverStats.mobsKilled).reduce((a, b) => a + b, 0))}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Blocks Mined</span>
              <span>{formatNumber(Object.values(serverStats.blocksMined).reduce((a, b) => a + b, 0))}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Blocks Placed</span>
              <span>{formatNumber(Object.values(serverStats.blocksPlaced).reduce((a, b) => a + b, 0))}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Items Crafted</span>
              <span>{formatNumber(Object.values(serverStats.itemsCrafted).reduce((a, b) => a + b, 0))}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Items Broken</span>
              <span>{formatNumber(Object.values(serverStats.itemsBroken).reduce((a, b) => a + b, 0))}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Damage Dealt</span>
              <span>{formatNumber(serverStats.damageDealt)}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Damage Taken</span>
              <span>{formatNumber(serverStats.damageTaken)}</span>
            </li>
            <li className="flex justify-between">
              <span>Total Distance Travelled</span>
              <span>{formatDistance(serverStats.distanceTravelled)} km</span>
            </li>
          </ul>
      </div>
    </div>
  );
};
export default ServerStatsOverview;
