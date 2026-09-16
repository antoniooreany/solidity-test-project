import React from 'react';

export function CounterController({ count, increment, isPending }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Counter Contract</h2>
      <p>
        <strong>Current Count:</strong> {count !== null ? count : 'Loading...'}
      </p>
      <button onClick={increment} disabled={isPending}>
        Increment Counter (+1)
      </button>
    </div>
  );
}
