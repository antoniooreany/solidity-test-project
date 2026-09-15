# Tasks: Simple UI for SimpleStorage

- [ ] 1. Initialize `frontend/` using Vite (React template) and install dependencies (ethers, testing libraries).
- [ ] 2. Setup testing framework in `frontend/` (Vitest + React Testing Library) and write a basic smoke test.
- [ ] 3. Create the `WalletConnect` component and logic (handling connection, missing MetaMask, rejected connection, wrong network).
- [ ] 4. Create the `StorageViewer` component to read the value from `SimpleStorage`.
- [ ] 5. Create the `StorageUpdater` component to submit transactions.
- [ ] 6. Integrate the `TransactionStatus` visualizer (Idle -> Awaiting wallet -> Pending -> Confirmed/Failed).
- [ ] 7. Combine components in `App.jsx` and handle `.env` variable configuration for the contract address.
- [ ] 8. Verify all error scenarios manually using a local Hardhat node.
- [ ] 9. Update `.github/workflows/ci.yml` to run frontend build checks.
