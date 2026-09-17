# Smart Contract Dashboard – Specification

## 1. User Story

_As a developer, I want a local web dashboard that lets me interact with my Solidity contracts on a Hardhat local network, so that I can view and modify contract state and transfer ERC‑20 tokens without leaving the browser._

### Acceptance Criteria
1. **Wallet connection** – The UI must allow the user to connect a MetaMask wallet and display the connected address and network name (or chain ID if unknown).
2. **SimpleStorage contract** –
   - The dashboard shows the current stored value.
   - The user can update the value; the transaction status (Idle → Pending → Confirmed / Failed) is displayed.
   - The displayed value updates automatically after a successful transaction.
3. **Counter UI** – A simple increment button updates an internal counter (client‑side only) to demonstrate UI state handling.
4. **MyToken (ERC‑20) contract** –
   - The dashboard reads and displays the token balance of the connected wallet (18 decimals, formatted as a decimal number).
   - The user can transfer an arbitrary amount of tokens to another address.
   - After a confirmed transfer, the balance refreshes automatically.
   - Errors (e.g., insufficient funds, rejected by user) are shown in the UI and reflected in the transaction status.
5. **Environment configuration** – Contract addresses are read from a Vite `.env` file (`VITE_SIMPLE_STORAGE_ADDRESS` and `VITE_MY_TOKEN_ADDRESS`).
6. **Logging** – All major actions (wallet connect, balance fetch, token transfer, contract calls) are logged to the browser console for debugging.
7. **Error handling** – UI must not crash; missing env variables, disconnected wallet, or network mismatch produce user‑friendly error messages.

## 2. Out‑of‑Scope
- Multi‑network support beyond the Hardhat local network.
- Token minting/burning beyond the initial supply.
- UI styling beyond functional layout.
- Production deployment (CD) – this repo is for local development only.

## 3. Non‑Functional Requirements
- **Security** – No secrets are committed. Private keys are never stored in the repo.
- **Reproducibility** – A new developer can run `npm ci`, `npx hardhat node`, `npx hardhat run scripts/deploy_all.js --network localhost`, and `npm run dev` to get the full flow.
- **Testing** – All contract logic must be covered by Hardhat tests (≥80 % coverage).
- **Gitflow** – Development occurs on `develop`; features are added on `feature/*` branches and merged via PR after CI passes.

## 4. Architecture Overview
- **Frontend** – Vite + React; connects to MetaMask via `ethers.BrowserProvider`.
- **Backend (local)** – Hardhat node on `http://127.0.0.1:8545`.
- **Contracts** – `SimpleStorage.sol` and `MyToken.sol` compiled by Hardhat; ABI JSON files are consumed by the frontend.
- **Deployment script** – `scripts/deploy_all.js` deploys both contracts and writes their addresses to `frontend/.env`.

## 5. Tasks (for the next sprint)
- [ ] Add Hardhat unit tests for `MyToken` transfer logic (balance updates, events).
- [ ] Add React component tests for `TokenController` using `@testing-library/react`.
- [ ] Introduce Gitflow branching (`develop`, `feature/erc20-tests`).
- [ ] Set up CI pipeline (GitHub Actions) that runs lint, tests, and builds the Vite app.
- [ ] Update README with quick‑start, testing, and CI instructions.

---
*Document created automatically by the AI assistant following the Spec‑Driven Development workflow.*
