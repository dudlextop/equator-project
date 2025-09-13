import React, { useState, useEffect } from 'react';
import { RefreshCw, X, AlertCircle } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Order } from '../types';
import { useWallet } from '../contexts/WalletContext';

const MyOrders: React.FC = () => {
  const { wallet } = useWallet();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getMyOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await mockApi.cancelOrder(orderId);
      if (response.success) {
        setOrders(orders.filter(order => order.id !== orderId));
        alert('Order cancelled successfully!');
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatQuantity = (quantity: number) => quantity.toFixed(4);
  const formatTotal = (total: number) => total.toFixed(2);

  return (
    <div className="bg-dex-card rounded-lg border border-dex-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dex-text">My Orders</h2>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2 text-dex-text-muted hover:text-dex-text transition-colors duration-200"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {!wallet.connected ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2 text-dex-warning mb-2">
            <AlertCircle size={20} />
            <span>Please connect your wallet to view orders</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-dex-text-muted">
          No active orders
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dex-border">
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Side</th>
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Price</th>
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Quantity</th>
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Remaining</th>
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Total</th>
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Client ID</th>
                <th className="text-left py-2 text-sm font-medium text-dex-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-dex-border/50 hover:bg-dex-border/30 transition-all duration-200 group">
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        order.side === 'BUY'
                          ? 'bg-dex-success/20 text-dex-success group-hover:bg-dex-success/30 group-hover:text-green-300'
                          : 'bg-dex-danger/20 text-dex-danger group-hover:bg-dex-danger/30 group-hover:text-red-300'
                      }`}
                    >
                      {order.side}
                    </span>
                  </td>
                  <td className="py-3 text-dex-text font-mono text-sm group-hover:text-dex-accent">
                    {formatPrice(order.price)}
                  </td>
                  <td className="py-3 text-dex-text font-mono text-sm group-hover:text-dex-text">
                    {formatQuantity(order.quantity)}
                  </td>
                  <td className="py-3 text-dex-text font-mono text-sm group-hover:text-dex-text">
                    {formatQuantity(order.remaining)}
                  </td>
                  <td className="py-3 text-dex-text-muted font-mono text-sm group-hover:text-dex-text">
                    {formatTotal(order.total)}
                  </td>
                  <td className="py-3 text-dex-text-muted font-mono text-xs group-hover:text-dex-text">
                    {order.clientId}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="p-2 text-dex-danger hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Cancel Order"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
