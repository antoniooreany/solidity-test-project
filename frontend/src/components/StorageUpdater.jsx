import React, { useState } from 'react';

export function StorageUpdater({ updateValue, txStatus }) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal || isNaN(inputVal)) return;
    updateValue(inputVal);
  };

  const isPending = txStatus === 'Pending' || txStatus === 'Awaiting wallet';

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem 0' }}>
      <h2>Update Value</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          value={inputVal} 
          onChange={(e) => setInputVal(e.target.value)} 
          placeholder="New value"
          disabled={isPending}
        />
        <button type="submit" disabled={isPending}>Send</button>
      </form>
    </div>
  );
}
