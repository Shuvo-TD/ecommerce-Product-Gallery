'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addItem } from '@/lib/store/cartSlice';
import { Product } from '@/app/api/products/route';

interface RecommendationsProps {
  recommendations: Product[];
  title?: string;
  maxItems?: number;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  title = 'You May Also Like',
  maxItems = 4,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const displayedRecommendations = recommendations.slice(0, maxItems);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.inStock) {
      setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

      const productWithQuantity = {
        ...product,
        quantity: 1,
      };

      setTimeout(() => {
        dispatch(addItem(productWithQuantity));

        setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
        setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

        setTimeout(() => {
          setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
        }, 2000);
      }, 500);
    }
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='text-center mb-10'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
          {title}
        </h2>
        <div className='w-20 h-1 bg-blue-600 mx-auto rounded-full'></div>
      </div>

      {displayedRecommendations.length === 0 ? (
        <div className='bg-gray-50 rounded-lg p-8 text-center max-w-lg mx-auto'>
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
            No recommendations available at this time.
          </p>
          <p className='text-gray-400 mt-2'>
            Check back later for personalized suggestions.
          </p>
        </div>
      ) : (
        <div className='flex flex-wrap justify-center gap-20  mx-auto'>
          {displayedRecommendations.map((product) => (
            <div
              key={product.id}
              className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)]'
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className='relative h-56 overflow-hidden'>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                />
                {!product.inStock && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm'>
                    <span className='text-white font-bold px-4 py-2 bg-red-600 rounded-full shadow-lg'>
                      Out of Stock
                    </span>
                  </div>
                )}
                <div className='absolute top-3 right-3'>
                  <span className='inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
                    {product.category}
                  </span>
                </div>
              </div>
              <div className='p-5'>
                <h3 className='font-semibold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                  {product.name}
                </h3>
                <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                  {product.description}
                </p>
                <div className='flex justify-between items-center gap-2'>
                  <span className='font-bold text-xl text-blue-600'>
                    ${product.price.toFixed(2)}
                  </span>
                  <div className='flex gap-3'>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock || addingToCart[product.id]}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        product.inStock
                          ? addingToCart[product.id]
                            ? 'bg-green-600 text-white'
                            : addedToCart[product.id]
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {addingToCart[product.id] ? (
                        <span className='flex items-center'>
                          <svg
                            className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          Adding...
                        </span>
                      ) : addedToCart[product.id] ? (
                        <span className='flex items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 mr-1'
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
                        <span className='flex items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 mr-1'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
                          </svg>
                          Add
                        </span>
                      ) : (
                        'Out of Stock'
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/products/${product.id}`);
                      }}
                      className='px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors'
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
