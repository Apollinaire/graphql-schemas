export interface Query {
  hits: number;
  url: string;
  requestBody: any;
  responseBody: any;
}

export type QueryStore = Record<number, Query>;
export type OnSyncFunction = (modifiedQueries: QueryStore) => void;
