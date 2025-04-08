'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addItem } from '@/lib/store/cartSlice';
import { Product } from '@/app/api/products/route';
import Image from 'next/image';
import Recommendations from '@/components/Recomandations';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);

        if (data.category) {
          const relatedResponse = await fetch(
            `/api/products?category=${data.category}&limit=4`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();

            const filteredRelated = relatedData.products.filter(
              (p: Product) => p.id !== data.id
            );
            setRelatedProducts(filteredRelated);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.inStock || isAdding) return;

    setIsAdding(true);
    try {
      const productWithQuantity = {
        ...product,
        quantity: quantity,
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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Error</h2>
          <p className='text-gray-600'>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='relative aspect-square rounded-lg overflow-hidden bg-gray-100'>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className='object-cover'
            priority
          />
          {!product.inStock && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <span className='text-lg font-semibold text-white'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {product.name}
          </h1>
          <p className='text-gray-600 mb-6'>{product.description}</p>

          <div className='mb-6'>
            <span className='text-2xl font-bold text-gray-900'>
              ${product.price.toFixed(2)}
            </span>
            <span className='ml-2 text-sm text-gray-500'>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className='flex items-center gap-4 mb-8'>
            <div className='flex items-center border border-gray-300 rounded-md overflow-hidden'>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className='px-3 py-2 hover:bg-gray-100 transition-colors'
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type='number'
                min='1'
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className='w-16 text-center py-2 focus:outline-none'
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className='px-3 py-2 hover:bg-gray-100 transition-colors'
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-300 ${
                !product.inStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-blue-400 text-white'
                  : addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdding ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24'>
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
                <span className='flex items-center justify-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Added to Cart!
                </span>
              ) : product.inStock ? (
                'Add to Cart'
              ) : (
                'Out of Stock'
              )}
            </button>
          </div>

          <div className='border-t border-gray-200 pt-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>
              Product Details
            </h2>
            <div className='space-y-2 text-gray-600'>
              <p>
                <span className='font-medium'>Category:</span>{' '}
                {product.category}
              </p>
              <p>
                <span className='font-medium'>Stock Status:</span>{' '}
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-16'>
        <Recommendations
          recommendations={relatedProducts}
          title='Related Products'
          maxItems={4}
        />
      </div>
    </div>
  );
}
