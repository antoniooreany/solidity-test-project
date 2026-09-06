import React from 'react';

export function WalletConnect({ account, network, connectWallet, error }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Wallet</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p><strong>Address:</strong> {account}</p>
          <p><strong>Network:</strong> {network}</p>
        </div>
      )}
    </div>
  );
}
