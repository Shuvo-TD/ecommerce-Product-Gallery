import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '../FilterPanel';

jest.useFakeTimers();

describe('FilterPanel', () => {
  const defaultProps = {
    filters: {
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      inStock: false,
    },
    categories: ['Electronics', 'Clothing', 'Books'],
    sortBy: '',
    sortOrder: 'asc' as const,
    handleFilterChange: jest.fn(),
    handleSortChange: jest.fn(),
    handleSortOrderChange: jest.fn(),
    onClearFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter sections correctly', () => {
    render(<FilterPanel {...defaultProps} />);

    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('min-price-input')).toBeInTheDocument();
    expect(screen.getByTestId('max-price-input')).toBeInTheDocument();
    expect(screen.getByTestId('in-stock-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('sort-by-select')).toBeInTheDocument();
  });

  it('handles category filter change', () => {
    const mockHandleFilterChange = jest.fn();
    render(
      <FilterPanel
        {...defaultProps}
        handleFilterChange={mockHandleFilterChange}
      />
    );

    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Electronics' } });

    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      category: 'Electronics',
    });
  });

  it('handles price range filter change', () => {
    const mockHandleFilterChange = jest.fn();
    render(
      <FilterPanel
        {...defaultProps}
        handleFilterChange={mockHandleFilterChange}
      />
    );

    const minPriceInput = screen.getByTestId('min-price-input');
    const maxPriceInput = screen.getByTestId('max-price-input');

    fireEvent.change(minPriceInput, { target: { value: '100' } });
    fireEvent.change(maxPriceInput, { target: { value: '500' } });

    // Wait for debounce
    setTimeout(() => {
      expect(mockHandleFilterChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        minPrice: 100,
        maxPrice: 500,
      });
    }, 600);
  });

  it('handles in stock filter change', () => {
    const mockHandleFilterChange = jest.fn();
    render(
      <FilterPanel
        {...defaultProps}
        handleFilterChange={mockHandleFilterChange}
      />
    );

    const inStockCheckbox = screen.getByTestId('in-stock-checkbox');
    fireEvent.click(inStockCheckbox);

    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      inStock: true,
    });
  });

  it('handles sort by change', () => {
    const mockHandleSortChange = jest.fn();
    render(
      <FilterPanel {...defaultProps} handleSortChange={mockHandleSortChange} />
    );

    const sortBySelect = screen.getByTestId('sort-by-select');
    fireEvent.change(sortBySelect, { target: { value: 'price' } });

    expect(mockHandleSortChange).toHaveBeenCalledWith('price');
  });

  it('handles sort order change', () => {
    const mockHandleSortOrderChange = jest.fn();
    render(
      <FilterPanel
        {...defaultProps}
        sortBy='price'
        handleSortOrderChange={mockHandleSortOrderChange}
      />
    );

    const sortDescButton = screen.getByTestId('sort-desc-button');
    fireEvent.click(sortDescButton);

    expect(mockHandleSortOrderChange).toHaveBeenCalledWith('desc');
  });

  it('calls onClearFilters when clear button is clicked', () => {
    const mockOnClearFilters = jest.fn();
    render(
      <FilterPanel
        {...defaultProps}
        filters={{
          ...defaultProps.filters,
          category: 'Electronics',
          minPrice: 100,
          maxPrice: 500,
          inStock: true,
        }}
        onClearFilters={mockOnClearFilters}
      />
    );

    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
  });
});
