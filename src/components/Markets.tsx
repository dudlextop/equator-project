import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Market } from '../types';

const Markets: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getMarkets();
      if (response.success) {
        setMarkets(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch markets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price > 1000) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (price > 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(6);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="bg-dex-card rounded-lg border border-dex-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dex-text">Markets</h2>
        <button
          onClick={fetchMarkets}
          disabled={loading}
          className="p-2 text-dex-text-muted hover:text-dex-text transition-colors duration-200"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-4 text-xs text-dex-text-muted mb-2">
          <div>Symbol</div>
          <div>Price</div>
          <div>24h Change</div>
          <div>24h Volume</div>
        </div>
        {markets.map((market) => (
          <div
            key={market.symbol}
            className="grid grid-cols-4 gap-4 py-4 px-4 hover:bg-dex-border/50 hover:border hover:border-dex-accent/30 rounded-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="text-dex-text font-semibold group-hover:text-dex-accent">
              {market.symbol}
            </div>
            <div className="text-dex-text font-mono group-hover:text-dex-accent">
              ${formatPrice(market.price)}
            </div>
            <div className={`flex items-center space-x-1 font-mono transition-colors duration-200 ${
              market.change24h >= 0 ? 'text-dex-success group-hover:text-green-300' : 'text-dex-danger group-hover:text-red-300'
            }`}>
              {market.change24h >= 0 ? (
                <TrendingUp size={14} className="group-hover:animate-bounce" />
              ) : (
                <TrendingDown size={14} className="group-hover:animate-bounce" />
              )}
              <span>{formatChange(market.change24h)}</span>
            </div>
            <div className="text-dex-text-muted font-mono group-hover:text-dex-text">
              ${formatVolume(market.volume24h)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Markets;
