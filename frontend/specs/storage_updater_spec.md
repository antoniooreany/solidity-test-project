# StorageUpdater Component Specification

## User Story
As a user of the Smart Contract Dashboard, I want to update the stored numeric value by adding a new amount to the current value, so that the on‑chain value increments correctly.

## Functional Requirements
1. **Input Validation**
   - The input field must accept only numeric values.
   - Empty input or non‑numeric input should display a user‑friendly error message in red.
2. **Summation Logic**
   - On form submit, the component receives the current on‑chain `value` prop, adds the entered number, and calls `updateValue` with the summed string.
3. **UX Behavior**
   - While the transaction is pending (`txStatus` is `Pending` or `Awaiting wallet`), the input and button are disabled and a *Transaction pending...* indicator is shown.
   - After a successful transaction, the input field is cleared.
4. **Accessibility**
   - Use semantic HTML (`<form>`, `<label>`) and associate the input with a label for screen readers.

## Acceptance Criteria
- **AC1**: Entering `5` when the displayed current value is `10` and clicking **Send** results in a transaction that updates the contract to `15`.
- **AC2**: Submitting an empty field shows the error *"Введите число"*.
- **AC3**: Submitting a non‑numeric value shows the error *"Введите корректное число"*.
- **AC4**: While the transaction is pending, the input and button are disabled and the pending indicator is visible.
- **AC5**: After a successful transaction, the input field is cleared and the new value appears in the `StorageViewer` component.

## Non‑Functional Requirements
- No additional dependencies are introduced.
- Code follows existing linting rules (`oxlint`).
- Component is covered by unit tests (90%+ line coverage).

## Out‑of‑Scope
- Adding server‑side validation in the smart contract (the contract only stores a string).
- Internationalisation of error messages.
