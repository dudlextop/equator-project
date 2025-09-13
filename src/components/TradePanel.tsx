import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useWallet } from '../contexts/WalletContext';

interface TradePanelProps {
  onOrderPlaced: () => void;
}

const TradePanel: React.FC<TradePanelProps> = ({ onOrderPlaced }) => {
  const { wallet } = useWallet();
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(price);
    const quantityNum = parseFloat(quantity);
    
    if (isNaN(priceNum) || isNaN(quantityNum) || priceNum <= 0 || quantityNum <= 0) {
      alert('Please enter valid price and quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await mockApi.placeOrder(side, priceNum, quantityNum);
      if (response.success) {
        setPrice('');
        setQuantity('');
        onOrderPlaced();
        alert('Order placed successfully!');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dex-card rounded-lg border border-dex-border p-6">
      <h2 className="text-lg font-semibold text-dex-text mb-4">Place Order</h2>
      
      {!wallet.connected && (
        <div className="mb-4 p-3 bg-dex-warning/10 border border-dex-warning/30 rounded-lg flex items-center space-x-2 text-dex-warning">
          <AlertCircle size={16} />
          <span className="text-sm">Please connect your wallet to place orders</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Side Selection */}
        <div>
          <label className="block text-sm font-medium text-dex-text-muted mb-2">
            Side
          </label>
          <div className="flex rounded-lg overflow-hidden border border-dex-border bg-dex-card">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 transform ${
                side === 'BUY'
                  ? 'bg-dex-success text-white shadow-lg shadow-dex-success/25 scale-105'
                  : 'text-dex-text hover:bg-dex-border hover:text-dex-accent'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 transform ${
                side === 'SELL'
                  ? 'bg-dex-danger text-white shadow-lg shadow-dex-danger/25 scale-105'
                  : 'text-dex-text hover:bg-dex-border hover:text-dex-accent'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-dex-text-muted mb-2">
            Price (USDC)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-dex-bg border border-dex-border rounded-lg text-dex-text placeholder-dex-text-muted focus:outline-none focus:ring-2 focus:ring-dex-accent focus:border-transparent transition-all duration-200 hover:border-dex-accent/50"
            required
          />
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-dex-text-muted mb-2">
            Quantity
          </label>
          <input
            type="number"
            step="0.0001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.0000"
            className="w-full px-4 py-3 bg-dex-bg border border-dex-border rounded-lg text-dex-text placeholder-dex-text-muted focus:outline-none focus:ring-2 focus:ring-dex-accent focus:border-transparent transition-all duration-200 hover:border-dex-accent/50"
            required
          />
        </div>

        {/* Total Display */}
        {price && quantity && (
          <div className="p-4 bg-dex-bg rounded-lg border border-dex-border transition-all duration-200 hover:border-dex-accent/50">
            <div className="text-sm text-dex-text-muted mb-1">Total</div>
            <div className="text-xl font-mono text-dex-text font-semibold">
              {(parseFloat(price) * parseFloat(quantity)).toFixed(2)} USDC
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !price || !quantity || !wallet.connected}
          className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
            side === 'BUY'
              ? 'bg-dex-success hover:bg-green-600 disabled:bg-dex-text-muted shadow-lg shadow-dex-success/25'
              : 'bg-dex-danger hover:bg-red-600 disabled:bg-dex-text-muted shadow-lg shadow-dex-danger/25'
          } text-white`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Placing Order...</span>
            </div>
          ) : (
            `Place ${side} Order`
          )}
        </button>
      </form>
    </div>
  );
};

export default TradePanel;
