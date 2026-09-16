import React from 'react';

export function WalletConnect({ account, network, connectWallet, switchNetwork, error }) {
  const isWrongNetwork =
    account && network && !network.includes('31337') && network !== 'localhost';

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Wallet</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p>
            <strong>Address:</strong> {account}
          </p>
          <p>
            <strong>Network:</strong> {network}
          </p>
          {isWrongNetwork && (
            <button
              onClick={switchNetwork}
              style={{
                backgroundColor: '#ff9800',
                color: '#fff',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Switch to Hardhat Network (31337)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
