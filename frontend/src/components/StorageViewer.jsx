import React from 'react';

export function StorageViewer({ value }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Current Value</h2>
      <p>{value !== null ? (value === '' ? '"" (empty)' : value) : 'Loading...'}</p>
    </div>
  );
}
