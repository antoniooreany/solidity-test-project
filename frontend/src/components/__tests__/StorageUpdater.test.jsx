import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StorageUpdater } from '../../src/components/StorageUpdater';

describe('StorageUpdater component', () => {
  const mockUpdate = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button', () => {
    render(<StorageUpdater value="10" updateValue={mockUpdate} txStatus="Idle" />);
    expect(screen.getByPlaceholderText('New value')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty input', async () => {
    render(<StorageUpdater value="10" updateValue={mockUpdate} txStatus="Idle" />);
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(await screen.findByText('Введите число')).toBeInTheDocument();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('shows error when submitting non‑numeric input', async () => {
    render(<StorageUpdater value="10" updateValue={mockUpdate} txStatus="Idle" />);
    fireEvent.change(screen.getByPlaceholderText('New value'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(await screen.findByText('Введите корректное число')).toBeInTheDocument();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('calls updateValue with summed value and clears input', async () => {
    render(<StorageUpdater value="10" updateValue={mockUpdate} txStatus="Idle" />);
    fireEvent.change(screen.getByPlaceholderText('New value'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith('15'));
    expect(screen.getByPlaceholderText('New value')).toHaveValue(null);
  });

  test('disables input and shows pending indicator when txStatus is pending', () => {
    render(<StorageUpdater value="10" updateValue={mockUpdate} txStatus="Pending" />);
    expect(screen.getByPlaceholderText('New value')).toBeDisabled();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    expect(screen.getByText('Transaction pending...')).toBeInTheDocument();
  });
});
