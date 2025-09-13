import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { OrderBook as OrderBookType } from '../types';

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);

  const fetchOrderBook = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getOrderBook();
      if (response.success) {
        setOrderBook(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch order book:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatQuantity = (quantity: number) => quantity.toFixed(4);
  const formatTotal = (total: number) => total.toFixed(2);

  return (
    <div className="bg-dex-card rounded-lg border border-dex-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dex-text">Order Book</h2>
        <button
          onClick={fetchOrderBook}
          disabled={loading}
          className="p-2 text-dex-text-muted hover:text-dex-text transition-colors duration-200"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bids (Buy Orders) */}
        <div>
          <div className="text-sm font-medium text-dex-success mb-2">Bids</div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs text-dex-text-muted mb-2">
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>
            {orderBook.bids.map((bid, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-2 text-sm hover:bg-dex-success/10 hover:border-l-2 hover:border-dex-success rounded px-2 py-1 transition-all duration-200 cursor-pointer group"
              >
                <div className="text-dex-success font-mono group-hover:text-green-300">{formatPrice(bid.price)}</div>
                <div className="text-dex-text font-mono group-hover:text-dex-text">{formatQuantity(bid.quantity)}</div>
                <div className="text-dex-text-muted font-mono group-hover:text-dex-text">{formatTotal(bid.total)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Asks (Sell Orders) */}
        <div>
          <div className="text-sm font-medium text-dex-danger mb-2">Asks</div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs text-dex-text-muted mb-2">
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>
            {orderBook.asks.map((ask, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-2 text-sm hover:bg-dex-danger/10 hover:border-l-2 hover:border-dex-danger rounded px-2 py-1 transition-all duration-200 cursor-pointer group"
              >
                <div className="text-dex-danger font-mono group-hover:text-red-300">{formatPrice(ask.price)}</div>
                <div className="text-dex-text font-mono group-hover:text-dex-text">{formatQuantity(ask.quantity)}</div>
                <div className="text-dex-text-muted font-mono group-hover:text-dex-text">{formatTotal(ask.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
