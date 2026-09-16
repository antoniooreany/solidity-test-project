# Implementation Plan: Realtime Events & Network Switching

## Architecture Overview

1. **Event Listening**:
   - `useEffect` hook in `App.jsx` creates contract instance via `ethers.Contract`.
   - Attaches `contract.on('ValueChanged', (_oldVal, newVal) => setValue(newVal))`.
   - Cleanup function calls `contract.removeAllListeners('ValueChanged')`.

2. **Network Switching**:
   - Helper `switchNetwork()` calls `window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x7A69' }] })`.
   - If chain 31337 (`0x7A69`) is missing in MetaMask (error code 4902), calls `wallet_addEthereumChain` with Hardhat parameters.

3. **UI Components**:
   - `WalletConnect.jsx`: Render "Switch Network" button if `network !== 'Chain ID: 31337'` and wallet is connected.

## Test Plan

- Unit test for `WalletConnect` displaying switch network button when network is wrong.
- Component test for event subscription cleanup on unmount.
