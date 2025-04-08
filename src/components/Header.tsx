// components/Header.tsx
'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useEffect, useState } from 'react';
import CartModal from './CartModal';
import Link from 'next/link';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setMounted(true);

    // Add scroll event listener to change header appearance on scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate total items in cart
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-150 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
      }`}
    >
      <nav className='container mx-auto px-4 h-16 flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2 group'>
          <div className='relative w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden'>
            <span className='text-white font-bold text-lg'>H</span>
          </div>
          <h1 className='text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors'>
            HuluLulu Store
          </h1>
        </Link>

        <div className='flex items-center gap-4'>
          <button
            onClick={() => setShowCart(true)}
            className='flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full transition-all relative group'
          >
            <ShoppingCartIcon className='w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors' />
            <span
              className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center opacity-0 transition-opacity duration-150'
              style={{ opacity: mounted && cartItemCount > 0 ? 1 : 0 }}
            >
              {cartItemCount}
            </span>
            <span className='hidden md:inline text-gray-700 group-hover:text-blue-600 transition-colors'>
              Cart
            </span>
          </button>
        </div>
      </nav>

      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </header>
  );
}

function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
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
  );
}
