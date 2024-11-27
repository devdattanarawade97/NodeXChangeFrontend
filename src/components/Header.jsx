import ArWalletConnect from './ArWalletConnect';
import './Header.css';
import WalletConnect from './WalletConnect';
import { useEffect, useState } from 'react';

export default function Header({ parentWalletAddress  , parentArWalletAddress}) {
  // Track wallet address
  const [walletAddress, setWalletAddress] = useState(null);
  //arconnect wallet address state variable 
  const [arWalletAddress, setArWalletAddress] = useState(null);
  

  // Connect to Phantom Wallet
  const connectArWallet = async () => {

    try {
      // connect to the extension
      await window.arweaveWallet.connect(
        // request permissions to read the active address
        ["ACCESS_ADDRESS","SIGN_TRANSACTION","DISPATCH"],
        // provide some extra info for our app
        {
          name: "NodeXChange",
          logo: "https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk",
        },
        // custom gateway
        {
          host: "g8way.io",
          port: 443,
          protocol: "https",
        }
      );
      // obtain the user's wallet address
      const userArAddress = await window.arweaveWallet.getActiveAddress();

      console.log("Your wallet address is", userArAddress);
      setArWalletAddress(userArAddress); // Set wallet address
      parentArWalletAddress(userArAddress);
    } catch (error) {
      //log error 
      console.log("error while connecting arconnect wallet : ", error);
    }
  };

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

  //disconnect arwallet 
  const disconnectArWallet = () => {
     
    try {
      setArWalletAddress(null); // Clear wallet address
      parentArWalletAddress(null);
      if (window.arweaveWallet && window.arweaveWallet.disconnect) {
        window.arweaveWallet.disconnect(); // Reset provider
      }
      console.log("Wallet disconnected");
      
    } catch (error) {

      //log error 
      console.log("error while disconnecting arconnect wallet : ", error);
      
    }
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

        <button className='connect-marketplace-button'>Marketplace</button>
      <ArWalletConnect
          walletAddress={arWalletAddress}
          shortenWalletAddress={shortenWalletAddress}
          setArWalletAddress={setArWalletAddress}
          onConnectWallet={connectArWallet}
          onDisconnectWallet={disconnectArWallet}
        />
        
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
