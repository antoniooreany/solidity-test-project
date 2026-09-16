import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing and shows the main title', () => {
    render(<App />);
    expect(screen.getByText('SimpleStorage UI')).toBeInTheDocument();
    expect(screen.getByText('Connect MetaMask')).toBeInTheDocument();
  });

  it('renders Current Value section', () => {
    render(<App />);
    expect(screen.getByText('Current Value')).toBeInTheDocument();
    expect(screen.getByText('Update Value')).toBeInTheDocument();
  });
});
