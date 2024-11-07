export type PriceQuery = {
  date: string;
  dateNumeric: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  label: string;
  changeOverTime: number;
};

export type PriceQueryResponse = {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  uOpen: number;
  uClose: number;
  uHigh: number;
  uLow: number;
  uVolume: number;
  change: number;
  changePercent: number;
  label: string;
  changeOverTime: number;
};
export type ProductsRequest = {
  startDate: string;
  endDate: string;
  symbol: string;
};
export type PolygonPriceQueryResponse = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  otc: boolean;
  t: number;
  v: number;
  vw: number;
};

export type PolygonQueryResponse = {
  adjusted: true;
  nextUrl: string;
  queryCount: number;
  request_id: string;
  results: PolygonPriceQueryResponse[];
}