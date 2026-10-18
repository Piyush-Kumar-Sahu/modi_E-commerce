import { apiRequest } from './client';
import { Banner, StoreSetting } from '../types';

export interface CouponValidationResult {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  discount_amount: string;
  new_subtotal: string;
}

export const promotionsApi = {
  validateCoupon: async (code: string, subtotal: number): Promise<{ success: boolean; message: string; data: CouponValidationResult }> => {
    return apiRequest<{ success: boolean; message: string; data: CouponValidationResult }>('/promotions/validate-coupon/', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  getBanners: async (): Promise<Banner[]> => {
    const res = await apiRequest<{ results: Banner[] } | Banner[]>('/promotions/banners/');
    return Array.isArray(res) ? res : res.results || [];
  },

  getStoreSettings: async (): Promise<StoreSetting> => {
    const res = await apiRequest<{ success: boolean; settings: StoreSetting }>('/promotions/store-settings/');
    return res.settings;
  },
};
