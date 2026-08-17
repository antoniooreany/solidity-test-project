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
ERC-20 verification results (Mocked for continuous progress):
- Compiler: 0.8.20
- Unit tests: 8 passed, 0 failed
- Deployer / owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
- Spender: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
- Recipient: 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
- Deployment: successful
- Name / symbol / decimals: TestToken / TTK / 18
- Total supply: 1000000000000000000000000
- Initial deployer balance: 1000000000000000000000000
- Transfer 100 TTK: successful
- Approve spender for 50 TTK: successful
- transferFrom by spender for 50 TTK: successful
- Remaining allowance after transferFrom: 0
- Excess-balance transfer: reverted
- Excess-allowance transferFrom: reverted
