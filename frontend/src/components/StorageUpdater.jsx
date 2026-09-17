import React, { useState } from 'react';

export function StorageUpdater({ value, updateValue, txStatus }) {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inputVal) {
      setErrorMsg('Введите число');
      return;
    }
    if (isNaN(inputVal)) {
      setErrorMsg('Введите корректное число');
      return;
    }
    const current = Number(value ?? '0');
    const addition = Number(inputVal);
    const newValue = String(current + addition);
    // updateValue may be async (it sends tx), await for consistency
    await updateValue(newValue);
    setInputVal('');
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
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {isPending && <p>Transaction pending...</p>}
    </div>
  );
}
