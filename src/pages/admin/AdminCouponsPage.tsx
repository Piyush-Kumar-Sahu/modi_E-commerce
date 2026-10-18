import React, { useState, useEffect } from 'react';
import {
  TicketPercent,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  RefreshCw,
  Search,
  Tag,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Coupon } from '../../types';
import { useToast } from '../../components/common/Toast';

export const AdminCouponsPage: React.FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    minimum_order_amount: '0',
    maximum_discount_amount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    usage_limit: '',
    is_active: true,
  });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getCoupons();
      setCoupons(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load promotional coupons', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '10',
      minimum_order_amount: '0',
      maximum_discount_amount: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      usage_limit: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      minimum_order_amount: coupon.minimum_order_amount.toString(),
      maximum_discount_amount: coupon.maximum_discount_amount ? coupon.maximum_discount_amount.toString() : '',
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
      usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : '',
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const updated = await adminApi.updateCoupon(coupon.id, { is_active: !coupon.is_active });
      setCoupons(coupons.map((c) => (c.id === coupon.id ? updated : c)));
      showToast(`Coupon ${coupon.code} is now ${updated.is_active ? 'active' : 'inactive'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update coupon status', 'error');
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!window.confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) {
      return;
    }
    try {
      await adminApi.deleteCoupon(coupon.id);
      setCoupons(coupons.filter((c) => c.id !== coupon.id));
      showToast(`Coupon "${coupon.code}" deleted successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete coupon', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showToast('Coupon code is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Coupon> = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value) || 0,
        minimum_order_amount: parseFloat(formData.minimum_order_amount) || 0,
        maximum_discount_amount: formData.maximum_discount_amount ? parseFloat(formData.maximum_discount_amount) : null,
        start_date: formData.start_date,
        end_date: formData.end_date ? formData.end_date : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit, 10) : null,
        is_active: formData.is_active,
      };

      if (editingCoupon) {
        const updated = await adminApi.updateCoupon(editingCoupon.id, payload);
        setCoupons(coupons.map((c) => (c.id === editingCoupon.id ? updated : c)));
        showToast(`Coupon ${updated.code} updated successfully`, 'success');
      } else {
        const created = await adminApi.createCoupon(payload);
        setCoupons([created, ...coupons]);
        showToast(`Coupon ${created.code} created successfully`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save coupon', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = coupons.filter((c) => c.is_active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-charcoal">Coupons & Promotions</h1>
          <p className="text-xs text-mutedGrey mt-0.5">
            Create and manage promotional discount codes for your customers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="p-2 border border-borderNeutral bg-white hover:bg-softNeutral text-charcoal rounded-button text-xs transition-colors"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-borderNeutral p-4 rounded-card shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <TicketPercent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-mutedGrey uppercase tracking-wider">Total Coupons</p>
            <p className="font-serif-luxury text-xl font-bold text-charcoal">{coupons.length}</p>
          </div>
        </div>

        <div className="bg-white border border-borderNeutral p-4 rounded-card shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-mutedGrey uppercase tracking-wider">Active Campaigns</p>
            <p className="font-serif-luxury text-xl font-bold text-charcoal">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white border border-borderNeutral p-4 rounded-card shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accentOrange/10 text-accentOrange flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-mutedGrey uppercase tracking-wider">Total Redemptions</p>
            <p className="font-serif-luxury text-xl font-bold text-charcoal">{totalRedemptions}</p>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white border border-borderNeutral rounded-card shadow-card overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-borderNeutral flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-mutedGrey absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by coupon code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <span className="text-xs text-mutedGrey">
            Showing {filteredCoupons.length} of {coupons.length} coupons
          </span>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-mutedGrey">Loading promotional codes...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <TicketPercent className="w-12 h-12 text-mutedGrey/40 mx-auto" />
              <p className="text-sm font-semibold text-charcoal">No coupons found</p>
              <p className="text-xs text-mutedGrey max-w-sm mx-auto">
                {searchQuery
                  ? `No promo code matches "${searchQuery}". Clear your search to see all coupons.`
                  : 'Start promoting your jewellery boutique by launching your first discount campaign.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleOpenCreateModal}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-softNeutral/60 border-b border-borderNeutral text-mutedGrey uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Spend</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4 text-center">Usage</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNeutral">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-softNeutral/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-warmIvory border border-borderNeutral px-2.5 py-1 rounded text-primary tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="p-1 text-mutedGrey hover:text-charcoal transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {coupon.description && (
                        <p className="text-[11px] text-mutedGrey mt-1 max-w-xs truncate">
                          {coupon.description}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 font-semibold text-charcoal">
                      {coupon.discount_type === 'percentage' ? (
                        <span className="text-primary font-bold">{coupon.discount_value}% OFF</span>
                      ) : (
                        <span className="text-primary font-bold">₹{Number(coupon.discount_value).toLocaleString('en-IN')} OFF</span>
                      )}
                      {coupon.maximum_discount_amount && (
                        <span className="block text-[10px] text-mutedGrey font-normal">
                          Max cap: ₹{Number(coupon.maximum_discount_amount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-charcoal">
                      {Number(coupon.minimum_order_amount) > 0 ? (
                        <span>₹{Number(coupon.minimum_order_amount).toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-mutedGrey italic">No minimum</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-mutedGrey">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3 h-3 text-mutedGrey" />
                        <span>{coupon.start_date.split('T')[0]}</span>
                        <span>→</span>
                        <span>{coupon.end_date ? coupon.end_date.split('T')[0] : 'Indefinite'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-charcoal">{coupon.used_count}</span>
                      <span className="text-mutedGrey text-[11px]">
                        {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' / ∞'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                          coupon.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-charcoal/10 text-mutedGrey hover:bg-charcoal/20'
                        }`}
                        title="Click to toggle status"
                      >
                        {coupon.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(coupon)}
                          className="px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-card shadow-float max-w-lg w-full overflow-hidden border border-borderNeutral">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-borderNeutral flex items-center justify-between bg-warmIvory">
              <h2 className="font-serif-luxury text-lg font-bold text-charcoal">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Discount Coupon'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-mutedGrey hover:text-charcoal p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs font-mono uppercase focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount Discount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Description / Marketing Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat 15% off on royal bridal collections"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    {formData.discount_type === 'percentage'
                      ? 'Discount Percentage (%) *'
                      : 'Discount Value (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="1"
                    max={formData.discount_type === 'percentage' ? '100' : undefined}
                    placeholder={formData.discount_type === 'percentage' ? '15' : '1000'}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Minimum Order Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0 for no minimum"
                    value={formData.minimum_order_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, minimum_order_amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {formData.discount_type === 'percentage' && (
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Maximum Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Leave empty for unlimited percentage discount"
                    value={formData.maximum_discount_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, maximum_discount_amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Usage Limit (Total)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500 (Empty for unlimited)"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Coupon is Active & Redeemable</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-borderNeutral flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
                >
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
