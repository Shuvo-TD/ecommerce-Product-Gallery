'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/app/api/products/route';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import FilterPanel from './FilterPanel';
import Image from 'next/image';

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 2000,
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 8,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (search.trim()) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/products?search=${encodeURIComponent(search)}&limit=5`
          );
          if (!response.ok) throw new Error('Failed to fetch suggestions');
          const data = await response.json();
          setSearchSuggestions(data.products);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setSearchSuggestions([]);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (searchInputRef.current &&
          searchInputRef.current.contains(event.target as Node)) ||
        (suggestionsRef.current &&
          suggestionsRef.current.contains(event.target as Node))
      ) {
        return;
      }
      setShowSuggestions(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false);
    router.push(`/products/${product.id}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setDebouncedSearch(search);
      setShowSuggestions(false);
      fetchProducts(1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const fetchProducts = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(filters.category && { category: filters.category }),
          minPrice: filters.minPrice.toString(),
          maxPrice: filters.maxPrice.toString(),
          inStock: filters.inStock.toString(),
          ...(sortBy && { sortBy }),
          sortOrder,
          ...(debouncedSearch && { search: debouncedSearch }),
        });

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        setProducts((prev) =>
          append ? [...prev, ...data.products] : data.products
        );
        setPagination(data.pagination);
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, sortBy, sortOrder, debouncedSearch, pagination.limit]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      const uniqueCategories = Array.from(
        new Set(data.products.map((product: Product) => product.category))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (inView && hasMore && !loading && !isLoadingMore && !isPaginationMode) {
      fetchProducts(pagination.currentPage + 1, true);
    }
  }, [
    inView,
    hasMore,
    loading,
    isLoadingMore,
    fetchProducts,
    pagination.currentPage,
    isPaginationMode,
  ]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchProducts(1);
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    fetchProducts(1);
  };

  const handlePageChange = (page: number) => {
    setIsPaginationMode(true);
    fetchProducts(page);
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 2000,
      inStock: false,
    });
    setSortBy('');
    setSortOrder('asc');
    setSearch('');
    setDebouncedSearch('');
    fetchProducts(1);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div
          data-testid='loading-spinner'
          className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8 text-red-500'>
        <p>{error}</p>
        <button
          onClick={() => fetchProducts(1)}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <input
            ref={searchInputRef}
            type='text'
            placeholder='Search products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className='w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='absolute left-3 top-3.5 h-5 w-5 text-gray-400'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clipRule='evenodd'
            />
          </svg>
          {showSuggestions && searchSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className='absolute z-50 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto'
            >
              {searchSuggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className='w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3'
                >
                  <div className='relative w-10 h-10 flex-shrink-0'>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className='object-cover rounded'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {product.name}
                    </p>
                    <p className='text-sm text-gray-500 truncate'>
                      {product.category}
                    </p>
                  </div>
                  <div className='text-sm font-medium text-gray-900'>
                    ${product.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex gap-2'>
          <div className='flex justify-between items-center mb-4'>
            <button
              onClick={toggleFilterPanel}
              className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
              data-testid='filter-toggle-button'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
                  clipRule='evenodd'
                />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className='mb-4' data-testid='filter-panel'>
          <FilterPanel
            filters={filters}
            categories={categories}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleFilterChange={handleFilterChange}
            handleSortChange={handleSortChange}
            handleSortOrderChange={(order: 'asc' | 'desc') =>
              setSortOrder(order)
            }
            onClearFilters={clearFilters}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-12 w-12 mx-auto text-gray-400 mb-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='text-gray-500 text-lg'>
            No products match your filters.
          </p>
          <p className='text-gray-400 mt-2'>
            Try adjusting your search criteria.
          </p>
          <button
            onClick={clearFilters}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6'>
            {products.map((product) => (
              <div key={product.id} className='w-full'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className='mt-6 text-center text-gray-600'>
            Showing {products.length} of {pagination.totalItems} products
          </div>

          {hasMore && !isPaginationMode && (
            <div ref={ref} className='h-20 flex justify-center items-center'>
              {isLoadingMore && (
                <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600'></div>
              )}
            </div>
          )}

          {isPaginationMode && pagination.totalPages > 1 && (
            <div className='mt-6 flex justify-center gap-2'>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className='px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-1'
                data-testid='prev-page-button'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Previous
              </button>

              <div className='flex items-center gap-1'>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 &&
                        page <= pagination.currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className='px-2'>...</span>
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              pagination.currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100'
                            }`}
                            data-testid={`page-${page}-button`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          pagination.currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                        data-testid={`page-${page}-button`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className='px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-1'
                data-testid='next-page-button'
              >
                Next
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
