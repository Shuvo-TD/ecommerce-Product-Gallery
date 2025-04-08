'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { removeItem, updateQuantity, clearCart } from '@/lib/store/cartSlice';
import { useState } from 'react';
import Image from 'next/image';

export default function CartModal({ onClose }: { onClose: () => void }) {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [isClearing, setIsClearing] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    if (item?.product?.price && typeof item.quantity === 'number') {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const discount = subtotal > 100 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      dispatch(clearCart());
      setIsClearing(false);
    }, 500);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm'>
      <div className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all'>
        <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>Shopping Cart</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100'
            aria-label='Close cart'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
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
          </button>
        </div>

        {items.length === 0 ? (
          <div className='text-center py-8'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 mx-auto text-gray-400 mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
            <p className='text-gray-500 text-lg mb-2'>Your cart is empty</p>
            <p className='text-gray-400 text-sm mb-4'>
              Looks like you haven&apos;t added any products yet.
            </p>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className='max-h-80 overflow-y-auto pr-2 -mr-2'>
              {items.map((item) => (
                <div
                  key={item?.product?.id || Math.random()}
                  className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-100'
                >
                  <div className='relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200'>
                    <Image
                      src={item.product?.image || '/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-gray-800 truncate'>
                      {item.product?.name || 'Unknown Product'}
                    </h3>
                    <p className='text-blue-600 font-medium'>
                      ${(item.product?.price || 0).toFixed(2)}
                    </p>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          if (item.product?.id && item.quantity > 1) {
                            dispatch(
                              updateQuantity({
                                id: item.product.id,
                                quantity: item.quantity - 1,
                              })
                            );
                          }
                        }}
                        className='p-1 rounded-md hover:bg-gray-100'
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span data-testid='quantity-display'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (item.product?.id) {
                            dispatch(
                              updateQuantity({
                                id: item.product.id,
                                quantity: item.quantity + 1,
                              })
                            );
                          }
                        }}
                        className='p-1 rounded-md hover:bg-gray-100'
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        item.product?.id &&
                        dispatch(removeItem(item.product.id))
                      }
                      className='text-red-500 hover:text-red-700 transition-colors text-sm flex items-center gap-1'
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
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <p className='font-medium text-gray-800 whitespace-nowrap'>
                    $
                    {(
                      (item.product?.price || 0) * (item?.quantity || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className='border-t border-gray-200 pt-4 mt-4 space-y-3'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal:</span>
                <span data-testid='subtotal-amount'>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span data-testid='discount-label'>Discount (10%):</span>
                  <span data-testid='discount-amount'>
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className='flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200'>
                <span>Total:</span>
                <span data-testid='total-amount'>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-3'>
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className={`w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
                  isClearing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isClearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
