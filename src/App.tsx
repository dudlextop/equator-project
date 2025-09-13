import React, { useState } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import OrderBook from './components/OrderBook';
import TradePanel from './components/TradePanel';
import MyOrders from './components/MyOrders';
import RecentTrades from './components/RecentTrades';
import Markets from './components/Markets';

function App() {
  const [activeTab, setActiveTab] = useState('trade');

  const handleOrderPlaced = () => {
    // This will trigger a refresh of My Orders when an order is placed
    // The MyOrders component handles its own refresh logic
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'trade':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradePanel onOrderPlaced={handleOrderPlaced} />
            <RecentTrades />
          </div>
        );
      case 'orderbook':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderBook />
            <RecentTrades />
          </div>
        );
      case 'orders':
        return <MyOrders />;
      case 'markets':
        return <Markets />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradePanel onOrderPlaced={handleOrderPlaced} />
            <RecentTrades />
          </div>
        );
    }
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-dex-bg">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-6 py-8">
          {renderContent()}
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
