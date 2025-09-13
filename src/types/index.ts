export interface Order {
  id: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  total: number;
  remaining: number;
  clientId: string;
  active: boolean;
  timestamp: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface Trade {
  id: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: number;
}

export interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface MockApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: number;
}

export interface WalletInfo {
  address: string;
  balance: number;
  connected: boolean;
}
