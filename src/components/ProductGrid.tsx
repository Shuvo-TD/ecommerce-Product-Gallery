'use client';
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/app/api/products/route';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

export default function ProductGrid({
  products,
  loading,
  error,
  hasMore,
  loadMoreRef,
}: ProductGridProps) {
  if (loading && products.length === 0) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>Error</h2>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>
            No Products Found
          </h2>
          <p className='text-gray-600'>
            Try adjusting your filters or search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {hasMore && (
        <div
          ref={loadMoreRef}
          className='col-span-full flex justify-center py-4'
        >
          {loading && (
            <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-600'></div>
          )}
        </div>
      )}
    </div>
  );
}
