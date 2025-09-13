import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'trade', label: 'Trade' },
    { id: 'orderbook', label: 'Order Book' },
    { id: 'orders', label: 'My Orders' },
    { id: 'markets', label: 'Markets' },
  ];

  return (
    <nav className="bg-dex-card border-b border-dex-border">
      <div className="flex space-x-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 relative ${
              activeTab === tab.id
                ? 'text-dex-accent border-dex-accent bg-dex-bg shadow-lg shadow-dex-accent/10'
                : 'text-dex-text-muted border-transparent hover:text-dex-text hover:border-dex-border hover:bg-dex-card/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
