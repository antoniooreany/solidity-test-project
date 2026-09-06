# Specification: Simple UI for SimpleStorage

## 1. Overview
A minimal React/Vite web application to interact with the existing `SimpleStorage` smart contract. This provides a complete vertical slice of the application (wallet -> contract -> transaction -> UI).

## 2. Requirements
- **Framework**: React with Vite.
- **Location**: The UI must reside in a `frontend/` directory at the root of the project.
- **Web3 Interaction**: Use `ethers.js` to connect to a local Hardhat node (`http://127.0.0.1:8545`).
- **Contract Address**: The deployed `SimpleStorage` address should be fetched from a deployment artifact or an `.env` file, without hardcoding.
- **Wallet Connection**: Connect via MetaMask.

## 3. User Interface (Minimal Screen)
The UI must contain the following blocks:
- **Wallet**: A "Connect MetaMask" button, displaying the user's address and the active network.
- **Current Value**: Reads and displays the current `value` from the `SimpleStorage` contract.
- **Update Value**: A numeric input field and a submit button to send a transaction.
- **Transaction Status**: Displays the current status of the transaction (Idle -> Awaiting wallet -> Pending -> Confirmed / Failed).

## 4. Error Scenarios to Handle
- MetaMask is not installed.
- User rejected the connection request.
- Incorrect network is selected.
- Input field contains an invalid value.
- Transaction is rejected by the user or fails to confirm.
