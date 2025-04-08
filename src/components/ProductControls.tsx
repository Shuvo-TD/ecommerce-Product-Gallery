'use client';
import React, { useState } from 'react';
import FilterPanel from './FilterPanel';

interface ProductControlsProps {
  search: string;
  setSearch: (search: string) => void;
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
  };
  setFilters: (filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
  }) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  categories: string[];
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  isPaginationMode: boolean;
  setIsPaginationMode: (isPagination: boolean) => void;
}

export default function ProductControls({
  search,
  setSearch,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  setCurrentPage,
  categories,
  isFilterOpen,
  setIsFilterOpen,
}: ProductControlsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: Infinity,
      inStock: false,
    });
    setSortBy('');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <input
          type='text'
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder='Search products...'
          className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
        {showSuggestions && search && (
          <div className='absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg'>
            {categories
              .filter((category) =>
                category.toLowerCase().includes(search.toLowerCase())
              )
              .map((category) => (
                <button
                  key={category}
                  onClick={() => handleSuggestionClick(category)}
                  className='block w-full px-4 py-2 text-left text-sm hover:bg-gray-100'
                >
                  {category}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className='rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50'
          >
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <FilterPanel
          filters={filters}
          categories={categories}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleFilterChange={setFilters}
          handleSortChange={setSortBy}
          handleSortOrderChange={setSortOrder}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Category Quick Links */}
      <div className='flex flex-wrap gap-2'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilters({ ...filters, category })}
            className={`rounded-full px-4 py-2 text-sm ${
              filters.category === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
