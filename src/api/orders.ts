import { apiRequest } from './client';
import { Order, ShipmentRecord } from '../types';

export interface CheckoutPayload {
  customer_email: string;
  customer_phone: string;
  customer_name: string;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_street: string;
  shipping_apartment?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country?: string;
  coupon_code?: string;
  payment_method?: string;
  customer_note?: string;
}

export const ordersApi = {
  checkout: async (payload: CheckoutPayload): Promise<{ success: boolean; message: string; order: Order }> => {
    return apiRequest<{ success: boolean; message: string; order: Order }>('/orders/checkout/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res = await apiRequest<{ results: Order[] } | Order[]>('/orders/');
    return Array.isArray(res) ? res : res.results || [];
  },

  getOrderDetail: async (orderNumber: string): Promise<Order> => {
    return apiRequest<Order>(`/orders/${orderNumber}/`);
  },

  cancelOrder: async (orderNumber: string, reason?: string): Promise<{ success: boolean; message: string; order: Order }> => {
    return apiRequest<{ success: boolean; message: string; order: Order }>(`/orders/${orderNumber}/cancel/`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason || 'Customer requested cancellation' }),
    });
  },

  trackOrder: async (orderNumber: string): Promise<{ success: boolean; order_number: string; status: string; customer_name: string; shipping_city: string; shipment: ShipmentRecord }> => {
    return apiRequest<{ success: boolean; order_number: string; status: string; customer_name: string; shipping_city: string; shipment: ShipmentRecord }>(`/orders/track/${orderNumber}/`);
  },
};
