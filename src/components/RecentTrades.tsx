import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Trade } from '../types';

const RecentTrades: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getRecentTrades();
      if (response.success) {
        setTrades(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatQuantity = (quantity: number) => quantity.toFixed(4);
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-dex-card rounded-lg border border-dex-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dex-text">Recent Trades</h2>
        <button
          onClick={fetchTrades}
          disabled={loading}
          className="p-2 text-dex-text-muted hover:text-dex-text transition-colors duration-200"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-4 gap-2 text-xs text-dex-text-muted mb-2 sticky top-0 bg-dex-card py-2">
          <div>Time</div>
          <div>Side</div>
          <div>Price</div>
          <div>Quantity</div>
        </div>
        {trades.map((trade, index) => (
          <div
            key={trade.id}
            className={`grid grid-cols-4 gap-2 text-sm hover:bg-dex-border/50 rounded px-2 py-1 transition-all duration-200 cursor-pointer group animate-fade-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="text-dex-text-muted font-mono text-xs group-hover:text-dex-text">
              {formatTime(trade.timestamp)}
            </div>
            <div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  trade.side === 'BUY'
                    ? 'bg-dex-success/20 text-dex-success group-hover:bg-dex-success/30 group-hover:text-green-300'
                    : 'bg-dex-danger/20 text-dex-danger group-hover:bg-dex-danger/30 group-hover:text-red-300'
                }`}
              >
                {trade.side}
              </span>
            </div>
            <div className="text-dex-text font-mono group-hover:text-dex-accent">
              {formatPrice(trade.price)}
            </div>
            <div className="text-dex-text-muted font-mono group-hover:text-dex-text">
              {formatQuantity(trade.quantity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;
