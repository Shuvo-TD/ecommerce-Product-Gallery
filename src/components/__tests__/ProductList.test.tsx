import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/lib/store/cartSlice';
import ProductList from '../ProductList';

global.fetch = jest.fn();

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Test Description 1',
    price: 100,
    category: 'Electronics',
    image: '/test1.jpg',
    inStock: true,
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 200,
    category: 'Electronics',
    image: '/test2.jpg',
    inStock: true,
  },
];

const mockPagination = {
  totalItems: 2,
  totalPages: 1,
  currentPage: 1,
  limit: 8,
};

const mockApiResponse = {
  products: mockProducts,
  pagination: mockPagination,
};

const createMockStore = (initialState = { cart: { items: [] } }) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

describe('ProductList', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();

    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponse),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders product list and handles search', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products?search=Test')
      );
    });
  });

  it('toggles filter panel visibility', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const filterButton = screen.getByTestId('filter-toggle-button');
    fireEvent.click(filterButton);

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
  });
});
