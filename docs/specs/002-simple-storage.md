# 002 — Simple Storage Contract

## Goal
Create a smart contract that stores a string value, implementing basic access control so that only the owner can update it.

## Functional requirements
- The contract stores a `string` state variable.
- The initial string value after deployment must be an empty string `""`.
- The contract sets the deployer's address as the `owner` (using `msg.sender` in the `constructor`).
- Only the `owner` can update the string value.
- Any caller can read the string value.
- Updating the string emits a `ValueChanged` event containing the old and new values.

## Access Control
- Implements a modifier `onlyOwner`.
- Reverts with a custom error `Unauthorized()` if a non-owner tries to update the string.

## Acceptance criteria
- Deployment succeeds in Remix VM.
- `owner` is correctly set to the deployer's address.
- Initial value is `""`.
- Deployer can successfully call the update function; `ValueChanged` is emitted.
- Calling the update function from a different address reverts the transaction with `Unauthorized()`.

## Verification
- Deployer / owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
- Initial value: ""
- Compilation: passed
- Unit tests: passed
- Owner update: successful
- Value after update: "Hello Web3"
- ValueChanged event: emitted
- Non-owner setValue("Hack"): reverted with Unauthorized()
- Value after rejected transaction: "Hello Web3"
