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

Status: Pending manual validation in Remix VM.

The implementation and automated test files were created locally.
No manual deployment or execution in Remix VM has been recorded yet.

Do not treat the following as verified until actual test evidence is
recorded:

- Compiler result.
- Unit-test result.
- Deployment address.
- ERC-20 transfer behavior.
- approve / transferFrom behavior.
- Revert behavior for insufficient balance and allowance.
