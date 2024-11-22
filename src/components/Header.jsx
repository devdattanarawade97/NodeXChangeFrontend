import './Header.css';
import WalletConnect from './WalletConnect';
import "./Header.css";
import { useEffect , useState} from 'react';

  





export default function Header({parentWalletAddress}) {

  //track wallet address
    const [walletAddress, setWalletAddress] = useState(null);
    
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect(); // Connect to Phantom Wallet
          setWalletAddress(response.publicKey.toString()); // Set wallet address
          parentWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Please install Phantom wallet to continue.");
    }
  };

  // Utility function to shorten wallet address
  const shortenWalletAddress = (address) => {
    return address ? `${address.slice(0, 5)}...${address.slice(-3)}` : null;
  };

      // Automatically connect wallet if it's already connected
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then((response) => {
        setWalletAddress(response.publicKey.toString());
      });
    }
  }, []);
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
              />
      </div>
    </header>
  );
}
