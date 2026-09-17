# MyToken (ERC‑20) Component Specification

## User Story
As a user of the Smart Contract Dashboard, I want to view my ERC‑20 token balance and be able to transfer tokens to another address, so that I can manage my token holdings directly from the UI.

## Functional Requirements
1. **Token Address Configuration**
   - The deployed token contract address must be provided via a Vite environment variable `VITE_MY_TOKEN_ADDRESS`.
   - The address is read in the frontend using `import.meta.env.VITE_MY_TOKEN_ADDRESS`.
2. **Balance Retrieval**
   - On page load (and after each successful transfer) the component fetches the caller's token balance using `balanceOf(address)`.
   - The balance is displayed in the UI (fallback to `Loading…` while fetching).
3. **Transfer Tokens**
   - The user supplies a recipient address and an amount.
   - The amount is parsed as a decimal string and converted to the token's smallest unit (`ethers.parseUnits(amount, decimals)`).
   - The component calls `transfer(recipient, parsedAmount)` on the token contract.
   - While the transaction is pending, inputs and the button are disabled and a *Transaction pending…* indicator appears.
   - On success the UI shows **Confirmed** and updates the displayed balance.
   - Errors (rejection, insufficient funds, invalid address) are shown in red text.
4. **UX Details**
   - Semantic HTML with `<form>`, `<label>` for inputs.
   - Accessible error messages (`role="alert"`).
   - Auto‑clear the form after a successful transfer.

## Non‑Functional Requirements
- No new dependencies beyond existing `ethers` and React.
- Code follows existing lint rules (`oxlint`).
- 90 %+ line coverage with unit tests (Jest + React Testing Library).
- All changes are committed on a dedicated feature branch `feature/009-erc20-token-ui`.
- CI runs `npm test` and the lint script on every push.

## Acceptance Criteria
- **AC1**: The dashboard shows the correct token balance for the connected wallet.
- **AC2**: Submitting the transfer form with a valid address and amount results in a confirmed transaction and the balance updates accordingly.
- **AC3**: Empty fields or non‑numeric amount display appropriate error messages (`"Введите адрес"`, `"Введите число"`).
- **AC4**: Invalid Ethereum address displays `"Недействительный адрес"`.
- **AC5**: While the transaction is pending, inputs and button are disabled and a pending indicator appears.
- **AC6**: Errors from the contract (e.g., insufficient balance) are displayed to the user.

## Out‑of‑Scope
- Token minting/burning UI.
- Support for tokens with non‑standard decimals.
- Internationalisation beyond Russian messages.
