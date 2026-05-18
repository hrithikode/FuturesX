export type Order = {
  id: string;
  symbol: string;
  side: "long" | "short";
  leverage: number;
  qty: number;
  status: "open" | "closed";
  pnl?: number | null;
  margin: number;
  finalSettlement?: number | null;
  openingPrice: number;
  closedAt?: string | null;
};
