import { apiRequest } from './client';
import { Product, Order, Review, Coupon, StoreSetting, User } from '../types';

export interface DashboardStats {
  kpis: {
    total_revenue: string;
    total_orders: number;
    avg_order_value: string;
    pending_fulfillment: number;
    low_stock_count: number;
    total_customers: number;
  };
  sales_chart: Array<{ date: string; revenue: number; orders: number }>;
  top_products: Array<{ name: string; units_sold: number; revenue: string }>;
  recent_orders: Array<{
    order_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: string;
    status: string;
    status_display: string;
    payment_status: string;
    created_at: string;
  }>;
  low_stock_items: Array<{
    id: number;
    product_name: string;
    variant_name: string;
    sku: string;
    stock: number;
  }>;
}

export const adminApi = {
  getStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>('/admin-ops/dashboard/stats/');
  },

  // Products
  getProducts: async (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qs = query.toString();
    return apiRequest<{ count: number; results: Product[] }>(`/catalogue/products/${qs ? `?${qs}` : ''}`);
  },

  createProduct: async (productData: Partial<Product>) => {
    return apiRequest<Product>('/catalogue/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (slug: string, productData: Partial<Product>) => {
    return apiRequest<Product>(`/catalogue/products/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (slug: string) => {
    return apiRequest(`/catalogue/products/${slug}/`, {
      method: 'DELETE',
    });
  },

  uploadProductImage: async (slug: string, formData: FormData) => {
    return apiRequest(`/catalogue/products/${slug}/upload_image/`, {
      method: 'POST',
      body: formData,
    });
  },

  deleteProductImage: async (slug: string, imageId: number) => {
    return apiRequest(`/catalogue/products/${slug}/delete-image/${imageId}/`, {
      method: 'DELETE',
    });
  },

  addVariant: async (slug: string, variantData: any) => {
    return apiRequest(`/catalogue/products/${slug}/add_variant/`, {
      method: 'POST',
      body: JSON.stringify(variantData),
    });
  },

  // Orders
  getOrders: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qs = query.toString();
    return apiRequest<{ count: number; results: Order[] } | Order[]>(`/orders/${qs ? `?${qs}` : ''}`);
  },

  updateOrderStatus: async (orderNumber: string, statusData: { status: string; note?: string; tracking_number?: string; carrier_name?: string }) => {
    return apiRequest<{ success: boolean; message: string; order: Order }>(`/orders/${orderNumber}/admin_update_status/`, {
      method: 'POST',
      body: JSON.stringify(statusData),
    });
  },

  // Reviews
  getReviews: async (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    const res = await apiRequest<{ results: Review[] } | Review[]>(`/reviews/admin/${qs}`);
    return Array.isArray(res) ? res : res.results || [];
  },

  moderateReview: async (reviewId: number, moderation_status: 'approved' | 'hidden' | 'flagged', reason?: string) => {
    return apiRequest(`/reviews/admin/${reviewId}/moderate/`, {
      method: 'POST',
      body: JSON.stringify({ moderation_status, reason }),
    });
  },

  // Coupons
  getCoupons: async () => {
    const res = await apiRequest<{ results: Coupon[] } | Coupon[]>('/promotions/coupons/');
    return Array.isArray(res) ? res : res.results || [];
  },

  createCoupon: async (coupon: Partial<Coupon>) => {
    return apiRequest<Coupon>('/promotions/coupons/', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  updateCoupon: async (id: number, coupon: Partial<Coupon>) => {
    return apiRequest<Coupon>(`/promotions/coupons/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(coupon),
    });
  },

  deleteCoupon: async (id: number) => {
    return apiRequest(`/promotions/coupons/${id}/`, {
      method: 'DELETE',
    });
  },

  // Customers
  getCustomers: async () => {
    const res = await apiRequest<{ results: User[] } | User[]>('/accounts/admin/customers/');
    return Array.isArray(res) ? res : res.results || [];
  },

  // Settings
  updateStoreSettings: async (settings: Partial<StoreSetting>) => {
    return apiRequest<{ success: boolean; settings: StoreSetting }>('/promotions/store-settings/', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  // Audit Logs
  getAuditLogs: async () => {
    return apiRequest<{ success: boolean; results: any[] }>('/admin-ops/audit-logs/');
  },

  // CSV Exports
  exportOrdersCSV: async () => {
    const csvContent = await apiRequest<string>('/admin-ops/export/orders-csv/');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `modiecommers_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportProductsCSV: async () => {
    const csvContent = await apiRequest<string>('/admin-ops/export/products-csv/');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `modiecommers_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
