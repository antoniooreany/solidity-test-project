import React from 'react';

export function StorageViewer({ value, history = [] }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Current Value</h2>
      <p>{value !== null ? (value === '' ? '"" (empty)' : value) : 'Loading...'}</p>
      {history.length > 0 && (
        <div style={{ marginTop: '1rem', borderTop: '1px dashed #ccc', paddingTop: '0.5rem' }}>
          <h3>Value History ({history.length})</h3>
          <ol>
            {history.map((val, idx) => (
              <li key={idx}>{val === '' ? '"" (empty)' : val}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
