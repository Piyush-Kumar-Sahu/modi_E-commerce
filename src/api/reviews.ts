import { apiRequest } from './client';
import { Review } from '../types';

export const reviewsApi = {
  getProductReviews: async (slug: string): Promise<Review[]> => {
    const res = await apiRequest<{ results: Review[] } | Review[]>(`/reviews/product/${slug}/`);
    return Array.isArray(res) ? res : res.results || [];
  },

  checkEligibility: async (productId: number): Promise<{ can_review: boolean; already_reviewed: boolean; has_purchased: boolean }> => {
    return apiRequest<{ can_review: boolean; already_reviewed: boolean; has_purchased: boolean }>(`/reviews/eligibility/${productId}/`);
  },

  submitReview: async (reviewData: { product_id: number; rating: number; title: string; comment: string }): Promise<{ success: boolean; message: string; review: Review }> => {
    return apiRequest<{ success: boolean; message: string; review: Review }>('/reviews/submit/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
};
