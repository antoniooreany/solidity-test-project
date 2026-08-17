# 003 — ERC-20 Token Contract

## Goal
Create a standard ERC-20 token using the proven OpenZeppelin library.

## Functional requirements
- The contract inherits from OpenZeppelin's `ERC20`.
- Token Name: "TestToken"
- Token Symbol: "TTK"
- Initial Supply: 1,000,000 tokens (with standard 18 decimals) minted to the deployer's address upon deployment.
- Fixed supply (no external minting or burning functions).

## Acceptance criteria
- Deployment succeeds in Remix VM.
- `totalSupply()` equals 1,000,000 * 10^18.
- `balanceOf(deployer)` equals the total supply.
- Standard ERC-20 transfers (`transfer`, `transferFrom`) function correctly between accounts.
- `EthereumRemix/sol-test` passes the automated unit tests.

## Verification
- CI Pipeline Automation: Checked and Passed.
