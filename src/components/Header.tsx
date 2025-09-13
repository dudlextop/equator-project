import React from 'react';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const Header: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet, isLoading } = useWallet();
  const [copied, setCopied] = React.useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const copyAddress = async () => {
    if (wallet.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(2);
  };

  return (
    <header className="bg-dex-card border-b border-dex-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-dex-accent">Equator DEX</h1>
          <div className="hidden md:block text-sm text-dex-text-muted">
            Decentralized Exchange
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {wallet.connected ? (
            <div className="flex items-center space-x-3">
              {/* Balance */}
              <div className="hidden md:block bg-dex-bg px-3 py-2 rounded-lg border border-dex-border">
                <div className="text-xs text-dex-text-muted">Balance</div>
                <div className="text-sm font-mono text-dex-text">
                  {formatBalance(wallet.balance)} SOL
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-center space-x-2 bg-dex-bg px-3 py-2 rounded-lg border border-dex-border">
                <div className="text-xs text-dex-text-muted">Address</div>
                <div className="text-sm font-mono text-dex-accent">
                  {formatAddress(wallet.address)}
                </div>
                <button
                  onClick={copyAddress}
                  className="p-1 text-dex-text-muted hover:text-dex-text transition-colors duration-200"
                  title="Copy address"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              
              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="flex items-center space-x-2 bg-dex-danger hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-lg shadow-dex-danger/25 hover:shadow-dex-danger/40 transform hover:scale-105"
              >
                <LogOut size={16} />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-dex-accent hover:bg-dex-accent-light text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-dex-accent/25 hover:shadow-dex-accent/40 transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Wallet size={18} />
              )}
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
