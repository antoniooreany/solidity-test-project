import React from 'react';

export function TransactionStatus({ status }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Transaction Status</h2>
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}
