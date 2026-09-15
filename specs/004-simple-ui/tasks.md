# Tasks: Simple UI for SimpleStorage

- [x] 1. Initialize `frontend/` using Vite (React template) and install dependencies (ethers, testing libraries).
- [x] 2. Setup testing framework in `frontend/` (Vitest + React Testing Library) and write a basic smoke test.
- [x] 3. Create the `WalletConnect` component and logic (handling connection, missing MetaMask, rejected connection, wrong network).
- [x] 4. Create the `StorageViewer` component to read the value from `SimpleStorage`.
- [x] 5. Create the `StorageUpdater` component to submit transactions.
- [x] 6. Integrate the `TransactionStatus` visualizer (Idle -> Awaiting wallet -> Pending -> Confirmed/Failed).
- [x] 7. Combine components in `App.jsx` and handle `.env` variable configuration for the contract address.
- [x] 8. Verify all error scenarios manually using a local Hardhat node.
- [x] 9. Update `.github/workflows/ci.yml` to run frontend build checks.
