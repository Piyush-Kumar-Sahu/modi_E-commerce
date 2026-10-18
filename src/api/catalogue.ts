import { apiRequest } from './client';
import { Product, Category, Collection } from '../types';

export interface ProductFilterParams {
  category?: string;
  collection?: string;
  min_price?: number;
  max_price?: number;
  metal_type?: string;
  metal_purity?: string;
  in_stock?: boolean;
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_bestseller?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedProducts {
  success: boolean;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: Product[];
}

export const catalogueApi = {
  getProducts: async (params: ProductFilterParams = {}): Promise<PaginatedProducts> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    });
    const qs = query.toString();
    return apiRequest<PaginatedProducts>(`/catalogue/products/${qs ? `?${qs}` : ''}`);
  },

  getProductDetail: async (slug: string): Promise<Product> => {
    return apiRequest<Product>(`/catalogue/products/${slug}/`);
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await apiRequest<{ results: Category[] } | Category[]>('/catalogue/categories/');
    return Array.isArray(res) ? res : res.results || [];
  },

  getCollections: async (): Promise<Collection[]> => {
    const res = await apiRequest<{ results: Collection[] } | Collection[]>('/catalogue/collections/');
    return Array.isArray(res) ? res : res.results || [];
  },
};
