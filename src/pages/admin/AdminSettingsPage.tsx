import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Save,
  CheckCircle,
  Database,
  Truck,
  CreditCard,
  Bell,
  RefreshCw,
  Clock,
  User,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { promotionsApi } from '../../api/promotions';
import { StoreSetting } from '../../types';
import { useToast } from '../../components/common/Toast';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<StoreSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    store_name: '',
    support_email: '',
    support_phone: '',
    store_address: '',
    gst_number: '',
    announcement_bar_text: '',
    is_announcement_active: true,
    free_shipping_threshold: '10000',
    currency_symbol: '₹',
    currency_code: 'INR',
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await promotionsApi.getStoreSettings();
      if (data) {
        setSettings(data);
        setFormData({
          store_name: data.store_name || 'Modiecommers Luxury Jewellery',
          support_email: data.support_email || 'care@modiecommers.com',
          support_phone: data.support_phone || '+91 98765 43210',
          store_address: data.store_address || 'Suite 401, Gold Souk Heritage Arcade, Bandra West, Mumbai 400050',
          gst_number: data.gst_number || '27AADCM1234F1Z8',
          announcement_bar_text: data.announcement_bar_text || 'Complimentary Insured Shipping Across India on Orders Above ₹10,000 | Certified BIS Hallmark Gold & IGI Diamonds',
          is_announcement_active: data.is_announcement_active ?? true,
          free_shipping_threshold: data.free_shipping_threshold?.toString() || '10000',
          currency_symbol: data.currency_symbol || '₹',
          currency_code: data.currency_code || 'INR',
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load store settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await adminApi.getAuditLogs();
      if (res && res.results) {
        setAuditLogs(res.results);
      }
    } catch (err: any) {
      // Non-critical, ignore or show subtle message
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchAuditLogs();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: Partial<StoreSetting> = {
        store_name: formData.store_name,
        support_email: formData.support_email,
        support_phone: formData.support_phone,
        store_address: formData.store_address,
        gst_number: formData.gst_number,
        announcement_bar_text: formData.announcement_bar_text,
        is_announcement_active: formData.is_announcement_active,
        free_shipping_threshold: parseFloat(formData.free_shipping_threshold) || 0,
        currency_symbol: formData.currency_symbol,
        currency_code: formData.currency_code,
      };

      const res = await adminApi.updateStoreSettings(payload);
      setSettings(res.settings);
      showToast('Store settings updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update store settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportOrders = async () => {
    try {
      showToast('Exporting orders CSV...', 'info');
      await adminApi.exportOrdersCSV();
      showToast('Orders CSV downloaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export orders CSV', 'error');
    }
  };

  const handleExportProducts = async () => {
    try {
      showToast('Exporting products CSV...', 'info');
      await adminApi.exportProductsCSV();
      showToast('Products catalog CSV downloaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export products CSV', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-charcoal">Store Settings & Operations</h1>
          <p className="text-xs text-mutedGrey mt-0.5">
            Configure boutique brand details, announcement banner, and export business reports
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="p-2 border border-borderNeutral bg-white hover:bg-softNeutral text-charcoal rounded-button text-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
          title="Refresh Settings"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Store Configuration Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-borderNeutral rounded-card shadow-card p-6 space-y-6">
            
            <div className="border-b border-borderNeutral pb-3 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="font-serif-luxury text-base font-bold text-charcoal">Boutique Identity & Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Store Legal Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                  className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  GST Identification Number (GSTIN)
                </label>
                <input
                  type="text"
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                  className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs font-mono uppercase focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Customer Concierge Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-mutedGrey absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.support_email}
                    onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Concierge Support Hotline
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-mutedGrey absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.support_phone}
                    onChange={(e) => setFormData({ ...formData, support_phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Atelier & Flagship Store Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-mutedGrey absolute left-3 top-2.5" />
                <textarea
                  rows={2}
                  value={formData.store_address}
                  onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Announcement Banner Section */}
            <div className="border-t border-borderNeutral pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accentOrange" />
                  <div>
                    <h3 className="font-serif-luxury text-base font-bold text-charcoal">Top Announcement Banner</h3>
                    <p className="text-[11px] text-mutedGrey">Displays across the top of all storefront pages</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_announcement_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_announcement_active: e.target.checked })
                    }
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-charcoal">Show Banner</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Banner Text Content
                </label>
                <textarea
                  rows={2}
                  value={formData.announcement_bar_text}
                  onChange={(e) =>
                    setFormData({ ...formData, announcement_bar_text: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Complimentary insured shipping on all orders over ₹10,000"
                />
              </div>
            </div>

            {/* Currency & Thresholds */}
            <div className="border-t border-borderNeutral pt-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-charcoal">Financial & Shipping Rules</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.free_shipping_threshold}
                    onChange={(e) =>
                      setFormData({ ...formData, free_shipping_threshold: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={formData.currency_symbol}
                    onChange={(e) =>
                      setFormData({ ...formData, currency_symbol: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Currency Code
                  </label>
                  <input
                    type="text"
                    value={formData.currency_code}
                    onChange={(e) =>
                      setFormData({ ...formData, currency_code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border border-borderNeutral rounded-button text-xs font-mono uppercase focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-borderNeutral flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-sm"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Store Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Reports & System Status (1 col) */}
        <div className="space-y-6">
          
          {/* CSV Reports Card */}
          <div className="bg-white border border-borderNeutral rounded-card shadow-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-borderNeutral pb-3">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h2 className="font-serif-luxury text-base font-bold text-charcoal">Data Export & CSV</h2>
            </div>

            <p className="text-xs text-mutedGrey leading-relaxed">
              Export live store records directly into standard CSV format for accounting, inventory audits, and offline spreadsheet analysis.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleExportOrders}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-softNeutral hover:bg-borderNeutral/50 text-charcoal text-xs font-semibold rounded-button transition-colors border border-borderNeutral"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export All Orders (CSV)</span>
                </div>
                <span className="text-[10px] text-mutedGrey bg-white px-1.5 py-0.5 rounded border border-borderNeutral">
                  .csv
                </span>
              </button>

              <button
                onClick={handleExportProducts}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-softNeutral hover:bg-borderNeutral/50 text-charcoal text-xs font-semibold rounded-button transition-colors border border-borderNeutral"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export Catalogue & Inventory (CSV)</span>
                </div>
                <span className="text-[10px] text-mutedGrey bg-white px-1.5 py-0.5 rounded border border-borderNeutral">
                  .csv
                </span>
              </button>
            </div>
          </div>

          {/* Infrastructure & Simulation Guardrails */}
          <div className="bg-white border border-borderNeutral rounded-card shadow-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-borderNeutral pb-3">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h2 className="font-serif-luxury text-base font-bold text-charcoal">System Environment</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-borderNeutral">
                <span className="text-mutedGrey flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" /> Database Engine
                </span>
                <span className="font-semibold text-charcoal">PostgreSQL 18.1 (Port 5433)</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-borderNeutral">
                <span className="text-mutedGrey flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-accentOrange" /> Payment Gateway
                </span>
                <span className="bg-accentOrange/10 text-accentOrange font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                  Demo / Simulation Only
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-borderNeutral">
                <span className="text-mutedGrey flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-primary" /> Logistics Courier
                </span>
                <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                  Shiprocket Demo Track
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-mutedGrey flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Review System
                </span>
                <span className="font-semibold text-charcoal">Verified Buyer Server-Enforced</span>
              </div>
            </div>
          </div>

          {/* Activity Audit Log Preview */}
          <div className="bg-white border border-borderNeutral rounded-card shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-borderNeutral pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-mutedGrey" />
                <h3 className="font-serif-luxury text-sm font-bold text-charcoal">Recent Admin Activity</h3>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="text-[11px] text-primary hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-2.5">
              {isLoadingLogs ? (
                <p className="text-[11px] text-mutedGrey">Loading activity logs...</p>
              ) : auditLogs.length === 0 ? (
                <p className="text-[11px] text-mutedGrey">No recent audit entries.</p>
              ) : (
                auditLogs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="text-[11px] pb-2 border-b border-borderNeutral/50 last:border-none">
                    <p className="font-semibold text-charcoal">{log.action || 'System action'}</p>
                    <div className="flex items-center justify-between text-mutedGrey mt-0.5">
                      <span>{log.user_email || 'admin'}</span>
                      <span>{log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
