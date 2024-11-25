

import './ArWalletConnect.css';
export default function ArWalletConnect({walletAddress , shortenWalletAddress,  setArWalletAddress,onConnectWallet , onDisconnectWallet }){ 



    return <div className='connect-wallet-container'>
             {walletAddress ? (
          <>
            <button className= {`wallet-info-button`}>
              {shortenWalletAddress(walletAddress)}
            </button>
            <button
              onClick={() => setArWalletAddress(null)} // Disconnect wallet
              className="disconnect-wallet-button"
            >
               <span className="material-icons" onClick={onDisconnectWallet}>logout</span> {/* Disconnect icon */}
            </button>
          </>
        ) : (
          <button onClick={onConnectWallet} className="connect-wallet-button">
            Connect Arweave
          </button>
        )}
    </div>

}