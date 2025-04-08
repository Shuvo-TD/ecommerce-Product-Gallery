import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/app/api/products/route';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}


const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsed = JSON.parse(stored);
   
        if (parsed && Array.isArray(parsed.items)) {
      
          return parsed.items.filter((item: unknown) => {
            const cartItem = item as CartItem;
            return cartItem && 
              cartItem.product && 
              cartItem.product.id && 
              typeof cartItem.quantity === 'number' && 
              cartItem.quantity > 0;
          });
        }
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
  }
  return [];
};

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
};


const saveCartToLocalStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      if (!action.payload || !action.payload.id) return;
      
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCartToLocalStorage(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (!action.payload) return;
      
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      saveCartToLocalStorage(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      if (!action.payload || !action.payload.id || action.payload.quantity < 1) return;
      
      const item = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
        saveCartToLocalStorage(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('cart');
        } catch (error) {
          console.error('Failed to remove cart from localStorage:', error);
        }
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
