import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { cartApi } from '../api/cart';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const refreshWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const items = await cartApi.getWishlist();
      setWishlist(items);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to save jewellery pieces to your wishlist.');
    }
    const res = await cartApi.toggleWishlist(productId);
    await refreshWishlist();
    return res.in_wishlist;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
