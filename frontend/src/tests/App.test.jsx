import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import App from '../App';

// Mock global fetch for API calls
const mockVehicles = [
  {
    id: 'v1',
    make: 'Porsche',
    model: '911 GT3',
    year: 2024,
    category: 'Sports',
    price: 180000,
    quantity: 2,
    description: 'Track sports car',
  },
  {
    id: 'v2',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Electric',
    price: 106500,
    quantity: 0, // OUT OF STOCK
    description: 'Electric gran turismo',
  },
];

global.fetch = vi.fn((url) => {
  if (url.includes('/api/vehicles')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockVehicles),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

describe('Frontend SPA Application Unit & Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders application header and inventory title', async () => {
    render(<App />);

    expect(screen.getByText(/Vortex Motors/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Porsche/i)).toBeInTheDocument();
    });
  });

  it('disables Purchase button when vehicle quantity is zero (out of stock condition)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Audi/i)).toBeInTheDocument();
    });

    // Check for "Sold Out" or disabled state on zero stock Audi vehicle
    const soldOutButton = screen.getByTestId('purchase-btn-v2');
    expect(soldOutButton).toBeDisabled();
    expect(soldOutButton).toHaveTextContent(/Sold Out/i);
  });

  it('enables Purchase button when vehicle quantity is greater than zero', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Porsche/i)).toBeInTheDocument();
    });

    const activePurchaseBtn = screen.getByTestId('purchase-btn-v1');
    expect(activePurchaseBtn).not.toBeDisabled();
    expect(activePurchaseBtn).toHaveTextContent(/Purchase Vehicle/i);
  });

  it('filters vehicle list by search input keyword', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Porsche/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by make or model/i);
    fireEvent.change(searchInput, { target: { value: 'Porsche' } });

    expect(screen.getByText(/Porsche/i)).toBeInTheDocument();
    expect(screen.queryByText(/Audi/i)).not.toBeInTheDocument();
  });
});
