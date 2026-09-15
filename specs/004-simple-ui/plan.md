# Implementation Plan: Simple UI for SimpleStorage

## 1. Architecture

- **Frontend Stack**: React 18+, Vite, ethers.js.
- **Directory**: `frontend/` will be generated using `npm create vite@latest`.
- **Components**:
  - `WalletConnect`: Handles MetaMask connection and network validation.
  - `StorageViewer`: Fetches and displays the current stored value.
  - `StorageUpdater`: Form with numeric input and transaction logic.
  - `TransactionStatus`: Renders the current state of a transaction.

## 2. Integration with Hardhat

- **Local Node**: The app will default to connecting to `http://127.0.0.1:8545`.
- **Artifacts**: The deployed contract address must be passed to the React app via an `.env` file (`VITE_SIMPLE_STORAGE_ADDRESS`). The ABI will be imported directly from the Hardhat artifacts.

## 3. Testing Strategy

- **Unit/Component Tests**: Minimal tests for React components using Vitest and React Testing Library.
- **CI Integration**: The GitHub Actions workflow (`ci.yml`) will be updated to include `npm install` and `npm run build` in the `frontend/` directory, ensuring frontend build safety.

## 4. Step-by-Step Implementation

1. Initialize the Vite project in `frontend/`.
2. Setup Vite configuration, linting, and basic tests (Vitest).
3. Implement Web3 utilities (ethers.js integration).
4. Build the UI components (WalletConnect, StorageViewer, StorageUpdater).
5. Implement state management for transaction tracking and error scenarios.
6. Update CI/CD workflow to check frontend build.
