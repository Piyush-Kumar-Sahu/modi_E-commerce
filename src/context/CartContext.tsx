import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '../types';
import { cartApi } from '../api/cart';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, variantId?: number | null, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const refreshCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: number, variantId?: number | null, quantity = 1) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.addToCart(productId, variantId, quantity);
      setCart(updatedCart);
      setIsCartOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.updateQuantity(itemId, quantity);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.removeFromCart(itemId);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.clearCart();
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
