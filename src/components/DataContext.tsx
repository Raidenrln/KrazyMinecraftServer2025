import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Player {
  stats: any;
  uuid: string;
  name: string;
  skin?: string;
  head?: string
}

interface DataContextType {
  data: Player[];
  setData: (players: Player[]) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetch("/KrazyMinecraftServer2025/usercache.json")
      .then((res) => res.json())
      .then((players: Player[]) => setData(players))
      .catch((err) => console.error("Failed to load usercache.json:", err));
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, selectedPlayer, setSelectedPlayer }}>
      {children}
    </DataContext.Provider>
  );
};
