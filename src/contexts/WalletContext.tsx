import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletInfo } from '../types';

interface WalletContextType {
  wallet: WalletInfo;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: 0,
    connected: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if Phantom is installed
  const isPhantomInstalled = () => {
    return window.solana && window.solana.isPhantom;
  };

  // Connect to Phantom wallet
  const connectWallet = async () => {
    if (!isPhantomInstalled()) {
      alert('Phantom wallet is not installed. Please install it from https://phantom.app/');
      return;
    }

    setIsLoading(true);
    try {
      const response = await window.solana!.connect();
      const publicKey = response.publicKey.toString();
      
      // Mock balance for demo purposes
      const mockBalance = Math.random() * 1000 + 100; // Random balance between 100-1100 SOL
      
      setWallet({
        address: publicKey,
        balance: mockBalance,
        connected: true,
      });

      // Store connection state in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', publicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet({
      address: '',
      balance: 0,
      connected: false,
    });
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const isConnected = localStorage.getItem('walletConnected') === 'true';
    const savedAddress = localStorage.getItem('walletAddress');
    
    if (isConnected && savedAddress && isPhantomInstalled()) {
      // Mock balance for demo
      const mockBalance = Math.random() * 1000 + 100;
      setWallet({
        address: savedAddress,
        balance: mockBalance,
        connected: true,
      });
    }
  }, []);

  const value: WalletContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    isLoading,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (args: any) => void) => void;
      off: (event: string, callback: (args: any) => void) => void;
    };
  }
}
