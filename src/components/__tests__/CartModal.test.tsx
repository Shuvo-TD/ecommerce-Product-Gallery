import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/lib/store/cartSlice';
import CartModal from '../CartModal';
import { CartState } from '@/lib/store/cartSlice';

const mockOnClose = jest.fn();

const createMockStore = (initialState: CartState) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: initialState,
    },
  });
};

describe('CartModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart message when cart is empty', () => {
    const store = createMockStore({ items: [] });
    render(
      <Provider store={store}>
        <CartModal onClose={mockOnClose} />
      </Provider>
    );
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const store = createMockStore({ items: [] });
    render(
      <Provider store={store}>
        <CartModal onClose={mockOnClose} />
      </Provider>
    );
    const closeButton = screen.getByLabelText(/close cart/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when continue shopping button is clicked in empty cart', () => {
    const store = createMockStore({ items: [] });
    render(
      <Provider store={store}>
        <CartModal onClose={mockOnClose} />
      </Provider>
    );
    const continueButton = screen.getByText(/continue shopping/i);
    fireEvent.click(continueButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays cart items correctly', () => {
    const mockItems = [
      {
        product: {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          image: '/test-image.jpg',
          category: 'test',
          description: 'test description',
          inStock: true,
        },
        quantity: 2,
      },
    ];

    const store = createMockStore({ items: mockItems });
    render(
      <Provider store={store}>
        <CartModal onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('2');
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$199.98');
  });

  it('handles clear cart', async () => {
    const mockItems = [
      {
        product: {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          image: '/test-image.jpg',
          category: 'test',
          description: 'test description',
          inStock: true,
        },
        quantity: 1,
      },
    ];

    const store = createMockStore({ items: mockItems });
    render(
      <Provider store={store}>
        <CartModal onClose={mockOnClose} />
      </Provider>
    );

    const clearButton = screen.getByText('Clear Cart');
    fireEvent.click(clearButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items).toHaveLength(0);
    });
  });

  it('displays cart items correctly with discount', () => {
    const mockItems = [
      {
        product: {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          image: '/test-image.jpg',
          category: 'test',
          description: 'test description',
          inStock: true,
        },
        quantity: 2,
      },
    ];

    const store = createMockStore({ items: mockItems });
    render(
      <Provider store={store}>
        <CartModal onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('2');
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$199.98');
    expect(screen.getByTestId('discount-label')).toHaveTextContent(
      'Discount (10%):'
    );
    expect(screen.getByTestId('discount-amount')).toHaveTextContent('-$20.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$179.98');
  });
});
