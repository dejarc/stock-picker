export type PriceQuery = {
  date: string;
  dateNumeric: number;
  close: number;
};


export type PriceQueryResponse = {
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
  results: PriceQueryResponse[];
}