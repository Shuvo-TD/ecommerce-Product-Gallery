'use client';
import React, { useState, useEffect, useRef } from 'react';

interface FilterPanelProps {
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
  };
  categories: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleFilterChange: (filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
  }) => void;
  handleSortChange: (sortBy: string) => void;
  handleSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export default function FilterPanel({
  filters,
  categories,
  sortBy,
  sortOrder,
  handleFilterChange,
  handleSortChange,
  handleSortOrderChange,
  onClearFilters,
}: FilterPanelProps) {
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const minPriceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxPriceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice);
    setLocalMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setLocalMinPrice(value);

    if (minPriceTimerRef.current) {
      clearTimeout(minPriceTimerRef.current);
    }

    minPriceTimerRef.current = setTimeout(() => {
      handleFilterChange({
        ...filters,
        minPrice: value,
      });
    }, 800);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? Infinity : Number(e.target.value);
    setLocalMaxPrice(value);

    if (maxPriceTimerRef.current) {
      clearTimeout(maxPriceTimerRef.current);
    }

    maxPriceTimerRef.current = setTimeout(() => {
      handleFilterChange({
        ...filters,
        maxPrice: value,
      });
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (minPriceTimerRef.current) clearTimeout(minPriceTimerRef.current);
      if (maxPriceTimerRef.current) clearTimeout(maxPriceTimerRef.current);
    };
  }, []);

  const hasActiveFilters =
    filters.category !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < Infinity ||
    filters.inStock;

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
      <div className='flex justify-between items-center mb-4 pb-2 border-b border-gray-200'>
        <h3 className='text-lg font-medium text-gray-900'>Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className='text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            Clear All
          </button>
        )}
      </div>

      <div className='space-y-4'>
        <div className='filter-section'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>Category</h4>
          <select
            value={filters.category}
            onChange={(e) =>
              handleFilterChange({ ...filters, category: e.target.value })
            }
            className='w-full p-2 border rounded-md text-sm'
            aria-label='Category'
            data-testid='category-select'
          >
            <option value=''>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className='filter-section'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Price Range
          </h4>
          <div className='flex items-center gap-2'>
            <div className='relative flex-1'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                $
              </span>
              <input
                type='number'
                value={localMinPrice || ''}
                onChange={handleMinPriceChange}
                placeholder='Min'
                className='pl-8  py-2 border rounded-lg w-28'
                data-testid='min-price-input'
                aria-label='Minimum price'
              />
            </div>
            <span className='text-gray-500'>to</span>
            <div className='relative flex-1'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                $
              </span>
              <input
                type='number'
                value={localMaxPrice === Infinity ? '' : localMaxPrice}
                onChange={handleMaxPriceChange}
                placeholder='Max'
                className='pl-8  p-2 border rounded-lg w-28'
                data-testid='max-price-input'
                aria-label='Maximum price'
              />
            </div>
          </div>
        </div>

        <div className='filter-section'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>Stock</h4>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={filters.inStock}
              onChange={(e) =>
                handleFilterChange({ ...filters, inStock: e.target.checked })
              }
              className='rounded text-blue-600'
              data-testid='in-stock-checkbox'
            />
            <span className='text-sm text-gray-600'>In Stock Only</span>
          </label>
        </div>

        <div className='filter-section'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Sort Options
          </h4>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className='w-full p-2 border rounded-md text-sm mb-2'
            aria-label='Sort by'
            data-testid='sort-by-select'
          >
            <option value=''>Sort By</option>
            <option value='price'>Price</option>
            <option value='name'>Name</option>
            <option value='category'>Category</option>
          </select>

          {sortBy && (
            <div className='flex gap-2'>
              <button
                onClick={() => handleSortOrderChange('asc')}
                className={`flex-1 py-1 px-3 rounded-md text-sm ${
                  sortOrder === 'asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid='sort-asc-button'
              >
                Ascending
              </button>
              <button
                onClick={() => handleSortOrderChange('desc')}
                className={`flex-1 py-1 px-3 rounded-md text-sm ${
                  sortOrder === 'desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid='sort-desc-button'
              >
                Descending
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
