import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Check, EyeOff, Flag, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Review } from '../../types';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchReviews = () => {
    setIsLoading(true);
    adminApi
      .getReviews(statusFilter || undefined)
      .then(setReviews)
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleModerate = async (id: number, status: 'approved' | 'hidden' | 'flagged') => {
    try {
      await adminApi.moderateReview(id, status, `Moderated by admin to ${status}`);
      setActionMessage(`Review #${id} has been marked as ${status}.`);
      fetchReviews();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update review status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-borderNeutral gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Verified Review Moderation</h2>
          <p className="text-xs text-mutedGrey mt-0.5">
            Audit customer reviews. Only approved reviews appear on public product detail pages.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-white border border-borderNeutral rounded-button text-xs font-semibold text-charcoal"
        >
          <option value="">All Moderation States</option>
          <option value="pending">Pending Moderation</option>
          <option value="approved">Approved (Public)</option>
          <option value="hidden">Hidden</option>
          <option value="flagged">Flagged as Abuse/Spam</option>
        </select>
      </div>

      {actionMessage && (
        <div className="p-3 bg-primary/10 text-primary rounded-button text-xs font-semibold">
          {actionMessage}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-mutedGrey">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 bg-white border border-borderNeutral rounded-card text-center text-xs text-mutedGrey">
            No reviews found matching the current moderation filter.
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-borderNeutral rounded-card p-5 space-y-3 shadow-sm hover:border-primary/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-borderNeutral/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal">{r.product_name || `Product #${r.product}`}</span>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-borderNeutral'}`} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Purchaser</span>
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      r.moderation_status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.moderation_status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {r.moderation_status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-charcoal">{r.title}</h4>
                <p className="text-xs text-mutedGrey leading-relaxed mt-1">{r.comment}</p>
              </div>

              <div className="pt-2 border-t border-borderNeutral/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-mutedGrey">
                  Submitted by: <strong className="text-charcoal">{r.user_name}</strong> on {new Date(r.created_at).toLocaleDateString('en-IN')}
                </span>

                <div className="flex items-center gap-2">
                  {r.moderation_status !== 'approved' && (
                    <button
                      onClick={() => handleModerate(r.id, 'approved')}
                      className="btn-primary h-8 px-3 text-xs gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {r.moderation_status !== 'hidden' && (
                    <button
                      onClick={() => handleModerate(r.id, 'hidden')}
                      className="btn-secondary h-8 px-3 text-xs gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  )}

                  {r.moderation_status !== 'flagged' && (
                    <button
                      onClick={() => handleModerate(r.id, 'flagged')}
                      className="btn-secondary h-8 px-3 text-xs gap-1 text-red-600 hover:bg-red-50"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Flag Abuse</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
