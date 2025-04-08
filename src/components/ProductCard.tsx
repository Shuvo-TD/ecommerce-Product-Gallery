'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addItem } from '@/lib/store/cartSlice';
import { Product } from '@/app/api/products/route';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || isAdding) return;

    setIsAdding(true);
    try {
      const productWithQuantity = {
        ...product,
        quantity: 1,
      };

      setTimeout(() => {
        dispatch(addItem(productWithQuantity));

        setIsAdding(false);
        setAddedToCart(true);

        setTimeout(() => {
          setAddedToCart(false);
        }, 2000);
      }, 500);
    } catch {
      setIsAdding(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      router.push(`/products/${product.id}`);
    }
  };

  return (
    <div onClick={handleCardClick} className='group cursor-pointer'>
      <div className='relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg'>
        <div className='relative aspect-square'>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {!product.inStock && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <span className='text-lg font-semibold text-white'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className='p-4'>
          <h3 className='mb-2 text-lg font-semibold text-gray-800'>
            {product.name}
          </h3>
          <p className='mb-2 text-sm text-gray-600 line-clamp-2'>
            {product.description}
          </p>
          <div className='flex items-center justify-between'>
            <span className='text-lg font-bold text-gray-900'>
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                !product.inStock
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : isAdding
                  ? 'bg-blue-400 text-white'
                  : addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdding ? (
                <span className='flex items-center gap-2'>
                  <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Adding...
                </span>
              ) : addedToCart ? (
                <span className='flex items-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Added!
                </span>
              ) : product.inStock ? (
                'Add to Cart'
              ) : (
                'Out of Stock'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
