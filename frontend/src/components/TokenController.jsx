import React, { useState } from 'react';

export function TokenController({ balance, sendTokens, isPending }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    sendTokens(recipient, amount);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>MyToken (ERC-20)</h2>
      <p>
        <strong>Your Balance:</strong> {balance !== null ? balance : 'Loading...'}
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Recipient Address (0x...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isPending}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isPending}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={isPending}>
          Transfer Tokens
        </button>
      </form>
    </div>
  );
}
