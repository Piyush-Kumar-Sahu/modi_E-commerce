import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag, Truck, Edit, X, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { ordersApi } from '../../api/orders';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchQ);
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Order for Status Management
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierName, setCarrierName] = useState('Shiprocket Express (BlueDart Air)');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  const fetchOrders = () => {
    setIsLoading(true);
    adminApi
      .getOrders({ search, status: statusFilter || undefined })
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res.results || [];
        setOrders(list);
      })
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderModal = async (order: Order) => {
    try {
      const full = await ordersApi.getOrderDetail(order.order_number);
      setSelectedOrder(full);
      setNewStatus(full.status);
      setTrackingNumber(full.shipment_record?.tracking_number || '');
      setCarrierName(full.shipment_record?.carrier_name || 'Shiprocket Express (BlueDart Air)');
      setAdminNote('');
      setUpdateFeedback(null);
    } catch {
      setSelectedOrder(order);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setUpdateFeedback(null);
    try {
      const res = await adminApi.updateOrderStatus(selectedOrder.order_number, {
        status: newStatus,
        note: adminNote || `Status updated to ${newStatus}`,
        tracking_number: trackingNumber,
        carrier_name: carrierName,
      });
      setSelectedOrder(res.order);
      setUpdateFeedback(`Order status updated to ${newStatus} successfully.`);
      fetchOrders();
      setTimeout(() => setUpdateFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-borderNeutral">
        <h2 className="text-xl font-bold text-charcoal">Customer Orders & Fulfilment</h2>
        <p className="text-xs text-mutedGrey mt-0.5">
          Process vault dispatches, transition statuses, and configure Shiprocket tracking telemetry.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, patron name, or email..."
            className="input-field text-xs pl-9"
          />
          <Search className="w-4 h-4 text-mutedGrey absolute left-3 top-3.5" />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 sm:h-12 px-3 bg-white border border-borderNeutral rounded-button text-xs font-semibold text-charcoal"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-borderNeutral rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-borderNeutral bg-warmIvory/60 text-mutedGrey font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfilment Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderNeutral/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-mutedGrey">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-mutedGrey">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_number} className="hover:bg-softNeutral/30">
                    <td className="py-3 px-4 font-bold text-charcoal">{o.order_number}</td>
                    
                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal block">{o.customer_name}</span>
                      <span className="text-[11px] text-mutedGrey">{o.customer_email}</span>
                    </td>

                    <td className="py-3 px-4 text-mutedGrey">
                      {new Date(o.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4 font-bold text-charcoal">
                      ₹{Number(o.total_amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        {o.status_display}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {o.payment_status_display}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openOrderModal(o)}
                        className="btn-secondary h-8 px-2.5 text-xs font-semibold"
                      >
                        Manage Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Management Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 z-10 shadow-float">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                  Manage Order #{selectedOrder.order_number}
                </h3>
                <span className="text-xs text-mutedGrey">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-mutedGrey">
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateFeedback && (
              <div className="p-3 bg-primary/10 text-primary rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{updateFeedback}</span>
              </div>
            )}

            {/* Patron & Destination Snapshot */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-softNeutral/60 rounded-card text-xs">
              <div>
                <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block mb-1">
                  Patron & Contact
                </span>
                <p className="font-semibold">{selectedOrder.customer_name}</p>
                <p className="text-mutedGrey">{selectedOrder.customer_email}</p>
                <p className="text-mutedGrey">Phone: {selectedOrder.customer_phone}</p>
              </div>

              <div>
                <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block mb-1">
                  Shipping Destination
                </span>
                <p>{selectedOrder.shipping_street}</p>
                {selectedOrder.shipping_apartment && <p>{selectedOrder.shipping_apartment}</p>}
                <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_postal_code}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block">
                Line Items Snapshot
              </span>
              <div className="divide-y divide-borderNeutral/60 border border-borderNeutral rounded-button p-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-charcoal">{item.product_name}</span>
                      {item.variant_name && <span className="text-mutedGrey ml-2 text-[11px]">({item.variant_name})</span>}
                      <span className="text-mutedGrey ml-2 text-[11px]">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-charcoal">
                      ₹{Number(item.subtotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Transition Form */}
            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-3 border-t border-borderNeutral text-xs">
              <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block">
                Update Order & Shipment Status
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Permitted Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing (In Vault)</option>
                    <option value="packed">Packed (Armoured Seal)</option>
                    <option value="shipped">Shipped (In Transit)</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Carrier Partner</label>
                  <input
                    type="text"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Shiprocket AWB / Tracking ID</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. SR-EXP-772910"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Internal Note / Event Reason</label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. Dispatched via airport security courier"
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary flex-1 text-xs"
                >
                  {isUpdating ? 'Saving Update...' : 'Commit Status & Tracking Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn-secondary text-xs"
                >
                  Close
                </button>
              </div>
            </form>

            {/* Audit Timeline of Status Events */}
            {selectedOrder.events && selectedOrder.events.length > 0 && (
              <div className="pt-3 border-t border-borderNeutral space-y-2 text-xs">
                <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block">
                  Status Event History
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedOrder.events.map((evt) => (
                    <div key={evt.id} className="p-2 bg-softNeutral rounded flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-charcoal uppercase">{evt.status}:</strong>{' '}
                        <span className="text-mutedGrey">{evt.note}</span>
                      </div>
                      <span className="text-mutedGrey text-[10px] whitespace-nowrap ml-2">
                        {new Date(evt.created_at).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
