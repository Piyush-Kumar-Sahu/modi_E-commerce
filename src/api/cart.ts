import { apiRequest } from './client';
import { Cart, Product } from '../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await apiRequest<{ success: boolean; cart: Cart }>('/cart/');
    return res.cart;
  },

  addToCart: async (productId: number, variantId?: number | null, quantity = 1): Promise<Cart> => {
    const res = await apiRequest<{ success: boolean; message: string; cart: Cart }>('/cart/items/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId || null,
        quantity,
      }),
    });
    return res.cart;
  },

  updateQuantity: async (itemId: number, quantity: number): Promise<Cart> => {
    const res = await apiRequest<{ success: boolean; message: string; cart: Cart }>(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    return res.cart;
  },

  removeFromCart: async (itemId: number): Promise<Cart> => {
    const res = await apiRequest<{ success: boolean; message: string; cart: Cart }>(`/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
    return res.cart;
  },

  clearCart: async (): Promise<Cart> => {
    const res = await apiRequest<{ success: boolean; message: string; cart: Cart }>('/cart/', {
      method: 'POST',
    });
    return res.cart;
  },

  // Wishlist APIs
  getWishlist: async (): Promise<Product[]> => {
    const res = await apiRequest<{ success: boolean; results: Array<{ id: number; product: Product }> }>('/cart/wishlist/');
    return res.results ? res.results.map(r => r.product) : [];
  },

  toggleWishlist: async (productId: number): Promise<{ in_wishlist: boolean; message: string }> => {
    return apiRequest<{ success: boolean; in_wishlist: boolean; message: string }>('/cart/wishlist/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },
};
