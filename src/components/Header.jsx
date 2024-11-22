import './Header.css';
import WalletConnect from './WalletConnect';
import { useEffect, useState } from 'react';

export default function Header({ parentWalletAddress }) {
  // Track wallet address
  const [walletAddress, setWalletAddress] = useState(null);

  // Connect to Phantom Wallet
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect(); // Connect to Phantom Wallet
        setWalletAddress(response.publicKey.toString()); // Set wallet address
        parentWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("Please install Phantom wallet to continue.");
    }
  };

  // Disconnect from Phantom Wallet
  const disconnectWallet = () => {
    setWalletAddress(null); // Clear wallet address
    parentWalletAddress(null);
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect(); // Reset provider
    }
    console.log("Wallet disconnected");
  };

  // Automatically connect wallet if it's already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
          parentWalletAddress(response.publicKey.toString());
        } catch (err) {
          console.warn("No trusted connection:", err); // Gracefully handle connection errors
        }
      }
    };
    checkWalletConnection();
  }, [parentWalletAddress]);

  // Utility function to shorten wallet address
  const shortenWalletAddress = (address) => {
    return address ? `${address.slice(0, 5)}...${address.slice(-3)}` : null;
  };

  return (
    <header className="header">
      {/* Left-aligned title */}
      <h1 className="header-title">NodeXChange</h1>

      {/* Right-aligned Wallet Connect */}
      <div className="connect-wallet-container">
        <WalletConnect
          walletAddress={walletAddress}
          shortenWalletAddress={shortenWalletAddress}
          setWalletAddress={setWalletAddress}
          onConnectWallet={connectWallet}
          onDisconnectWallet={disconnectWallet}
        />
      </div>
    </header>
  );
}
