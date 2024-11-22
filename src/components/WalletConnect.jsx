

import './WalletConnect.css';
export default function WalletConnect({walletAddress , shortenWalletAddress , setWalletAddress , onConnectWallet , onDisconnectWallet}){ 



    return <div className='connect-wallet-container'>
        {walletAddress ? (
          <>
            <button className= {`wallet-info-button`}>
              {shortenWalletAddress(walletAddress)}
            </button>
            <button
              onClick={() => setWalletAddress(null)} // Disconnect wallet
              className="disconnect-wallet-button"
            >
               <span className="material-icons" onClick={onDisconnectWallet}>logout</span> {/* Disconnect icon */}
            </button>
          </>
        ) : (
          <button onClick={onConnectWallet} className="connect-wallet-button">
            Connect Wallet
          </button>
        )}
    </div>

}