import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./DataContext";
import * as htmlToImage from "html-to-image";

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

const Summary = () => {
  const context = useContext(DataContext);
  const player = context?.selectedPlayer;

  const [stats, setStats] = useState<any | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [headLoaded, setHeadLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!player) return;

    setHeadLoaded(false);

    fetch(`/KrazyMinecraft2025/stats/${player.uuid}.json`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to load stats:", err);
        setStats(null);
      });
  }, [player]);

  if (!player || !stats) return null;

  const customStats = stats.stats["minecraft:custom"] || {};
  const killedStats = stats.stats["minecraft:killed"] || {};
  const craftedStats = stats.stats["minecraft:crafted"] || {};
  const minedStats = stats.stats["minecraft:mined"] || {};
  const pickedUpStats = stats.stats["minecraft:picked_up"] || {};
  const usedStats = stats.stats["minecraft:used"] || {};

  const totalPlayedTime = (
    (customStats["minecraft:play_time"] || 0) / 20 / 3600 / 24
  ).toFixed(2);

  const totalTravelled = Object.entries(customStats)
    .filter(([k]) => distanceStats.includes(k))
    .reduce((sum, [, v]) => sum + (v as number), 0);

  const totalTravelledKm = (totalTravelled / 100000).toFixed(2);

  const totalKilledMobs = Object.values(killedStats)
    .reduce((a: number, b) => a + (b as number), 0);

  const totalCrafted = Object.values(craftedStats)
    .reduce((a: number, b) => a + (b as number), 0);

  const totalMined = Object.values(minedStats)
    .reduce((a: number, b) => a + (b as number), 0);

  const totalPickedUp = Object.values(pickedUpStats)
    .reduce((a: number, b) => a + (b as number), 0);

  const mostUsedItem =
    Object.entries(usedStats).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] ||
    "-";

  const handleDownload = async () => {
    if (!summaryRef.current || !headLoaded) return;

    setIsDownloading(true);

    await document.fonts.ready;
    await new Promise((res) => setTimeout(res, 30));

    try {
      const dataUrl = await htmlToImage.toPng(summaryRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${player.name}_summary.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Image generation failed:", err);
    }

    setIsDownloading(false);
  };

  return (
    <>
      <div className="mt-5">
        <div
          ref={summaryRef}
          className="w-[660px] h-[260px] p-4 rounded-xl flex relative overflow-hidden text-white shadow-2xl backdrop-blur-lg justify-center items-center
          "
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 -z-10"
            style={{ backgroundImage: "url('/KrazyMinecraft2025/assets/minecraft-bg.png')" }}
          />

          {/* Player Head */}
          <img
            src={player.head || "https://i.imgur.com/VuqXXBV.png"}
            crossOrigin="anonymous"
            alt="player head"
            onLoad={() => setHeadLoaded(true)}
            className="h-56 w-56 rounded-lg mr-4 z-10"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Text Section */}
          <div className="flex flex-col justify-center z-10 w-full h-[230px]">
            <p
              className="text-3xl font-bold mb-1"
              style={{
                lineHeight: "1.1",
                textRendering: "geometricPrecision",
                fontKerning: "none",
              }}
            >
              {player.name}
            </p>

            {/* STATS GRID */}
            <div
              className="grid grid-cols-2 gap-y-1 gap-x-3 text-lg justify-center items-center"
              style={{
                lineHeight: "1.1",
                textRendering: "geometricPrecision",
                fontKerning: "none",
              }}
            >
              <p>Played Time:</p><p className="text-right">{totalPlayedTime} days</p>
              <p>Traveled:</p><p className="text-right">{totalTravelledKm} km</p>
              <p>Mobs Killed:</p><p className="text-right">{totalKilledMobs}</p>
              <p>Items Crafted:</p><p className="text-right">{totalCrafted}</p>
              <p>Blocks Mined:</p><p className="text-right">{totalMined}</p>
              <p>Items Picked Up:</p><p className="text-right">{totalPickedUp}</p>
              <p>Most Used Item:</p>
              <p className="text-right">
                {mostUsedItem.replace("minecraft:", "").replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!headLoaded || isDownloading}
        className={`
          mt-4 px-4 py-2 rounded-lg font-semibold text-white
          ${
            !headLoaded || isDownloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
          }
        `}
      >
        {isDownloading ? "Downloading..." : headLoaded ? "Download Summary" : "Loading..."}
      </button>
    </>
  );
};

export default Summary;
