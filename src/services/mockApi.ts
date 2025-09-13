import { Order, OrderBook, Trade, Market, OrderBookEntry, MockApiResponse } from '../types';

// Mock data generators
const generateOrderBookEntry = (price: number, quantity: number): OrderBookEntry => ({
  price,
  quantity,
  total: price * quantity,
});

const generateOrder = (side: 'BUY' | 'SELL', price: number, quantity: number): Order => ({
  id: Math.random().toString(36).substr(2, 9),
  side,
  price,
  quantity,
  total: price * quantity,
  remaining: quantity,
  clientId: Math.random().toString(36).substr(2, 6),
  active: true,
  timestamp: Date.now(),
});

const generateTrade = (side: 'BUY' | 'SELL', price: number, quantity: number): Trade => ({
  id: Math.random().toString(36).substr(2, 9),
  side,
  price,
  quantity,
  timestamp: Date.now(),
});

// Mock order book data
const generateOrderBook = (): OrderBook => {
  const basePrice = 100 + Math.random() * 20; // Random base price around 100-120
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  // Generate bids (buy orders) - decreasing prices
  for (let i = 0; i < 10; i++) {
    const price = basePrice - (i * 0.1) - Math.random() * 0.05;
    const quantity = Math.random() * 100 + 10;
    bids.push(generateOrderBookEntry(price, quantity));
  }

  // Generate asks (sell orders) - increasing prices
  for (let i = 0; i < 10; i++) {
    const price = basePrice + (i * 0.1) + Math.random() * 0.05;
    const quantity = Math.random() * 100 + 10;
    asks.push(generateOrderBookEntry(price, quantity));
  }

  return { bids, asks };
};

// Mock markets data
const generateMarkets = (): Market[] => [
  {
    symbol: 'SOL/USDC',
    baseAsset: 'SOL',
    quoteAsset: 'USDC',
    price: 23.45,
    change24h: 2.34,
    volume24h: 1234567.89,
  },
  {
    symbol: 'BTC/USDC',
    baseAsset: 'BTC',
    quoteAsset: 'USDC',
    price: 43210.50,
    change24h: -1.23,
    volume24h: 9876543.21,
  },
  {
    symbol: 'ETH/USDC',
    baseAsset: 'ETH',
    quoteAsset: 'USDC',
    price: 2650.75,
    change24h: 0.87,
    volume24h: 5432109.87,
  },
  {
    symbol: 'RAY/USDC',
    baseAsset: 'RAY',
    quoteAsset: 'USDC',
    price: 1.23,
    change24h: 5.67,
    volume24h: 234567.89,
  },
];

// Mock API class
class MockApi {
  private orderBook: OrderBook;
  private orders: Order[] = [];
  private trades: Trade[] = [];
  private markets: Market[];

  constructor() {
    this.orderBook = generateOrderBook();
    this.markets = generateMarkets();
    this.startTradeSimulation();
  }

  private startTradeSimulation() {
    // Simulate random trades every 2-5 seconds
    setInterval(() => {
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const price = 100 + Math.random() * 20;
      const quantity = Math.random() * 50 + 5;
      const trade = generateTrade(side, price, quantity);
      
      this.trades.unshift(trade);
      if (this.trades.length > 50) {
        this.trades = this.trades.slice(0, 50);
      }
    }, 2000 + Math.random() * 3000);
  }

  async getOrderBook(): Promise<MockApiResponse<OrderBook>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Occasionally update order book
    if (Math.random() < 0.3) {
      this.orderBook = generateOrderBook();
    }

    return {
      data: this.orderBook,
      success: true,
      timestamp: Date.now(),
    };
  }

  async getRecentTrades(): Promise<MockApiResponse<Trade[]>> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      data: this.trades.slice(0, 20),
      success: true,
      timestamp: Date.now(),
    };
  }

  async getMarkets(): Promise<MockApiResponse<Market[]>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update market prices slightly
    this.markets = this.markets.map(market => ({
      ...market,
      price: market.price * (1 + (Math.random() - 0.5) * 0.01),
      change24h: market.change24h + (Math.random() - 0.5) * 0.1,
    }));

    return {
      data: this.markets,
      success: true,
      timestamp: Date.now(),
    };
  }

  async getMyOrders(): Promise<MockApiResponse<Order[]>> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      data: this.orders.filter(order => order.active),
      success: true,
      timestamp: Date.now(),
    };
  }

  async placeOrder(side: 'BUY' | 'SELL', price: number, quantity: number): Promise<MockApiResponse<Order>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = generateOrder(side, price, quantity);
    this.orders.push(order);
    
    return {
      data: order,
      success: true,
      timestamp: Date.now(),
    };
  }

  async cancelOrder(orderId: string): Promise<MockApiResponse<boolean>> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].active = false;
      return {
        data: true,
        success: true,
        timestamp: Date.now(),
      };
    }
    
    return {
      data: false,
      success: false,
      timestamp: Date.now(),
    };
  }
}

export const mockApi = new MockApi();
