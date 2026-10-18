import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ShieldCheck, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { Order } from '../../types';
import { ordersApi } from '../../api/orders';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      setIsLoading(true);
      ordersApi
        .getOrderDetail(orderNumber)
        .then(setOrder)
        .catch((err) => console.error('Failed to load order confirmation:', err))
        .finally(() => setIsLoading(false));
    }
  }, [order, orderNumber]);

  if (isLoading) {
    return (
      <div className="section-container py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-mutedGrey font-medium">Retrieving verified order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section-container py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">Order Reference Not Found</h2>
        <p className="text-xs text-mutedGrey">We could not locate this order in the active database.</p>
        <Link to="/" className="btn-primary">Return to Storefront</Link>
      </div>
    );
  }

  const trackingNumber = order.shipment_record?.tracking_number || 'SR-EXP-PENDING';
  const estDelivery = order.shipment_record?.estimated_delivery_date || '4 business days';

  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl">
      
      {/* 1. Success Hero Box */}
      <div className="bg-white border border-borderNeutral rounded-card p-6 sm:p-10 text-center space-y-4 shadow-card">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Order Confirmed & Authorised
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-charcoal">
            Thank You for Your Patronage
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey max-w-md mx-auto">
            Order <strong className="text-charcoal font-semibold">#{order.order_number}</strong> has been received by our vault fulfillment team.
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-button text-xs text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Simulated Demo Transaction:</strong> Razorpay payment simulation verified. No real money charged to your account. Courier tracking telemetry provided below is for demonstration.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={`/orders/track/${order.order_number}`}
            className="btn-primary w-full sm:w-auto text-xs gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Simulated Courier Timeline</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-secondary w-full sm:w-auto text-xs gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. Order Details Summary */}
      <div className="mt-8 bg-white border border-borderNeutral rounded-card p-6 sm:p-8 space-y-6">
        <h3 className="font-serif-luxury text-lg font-bold text-charcoal pb-3 border-b border-borderNeutral">
          Order Summary & Delivery Destination
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal">
          <div>
            <span className="font-bold uppercase tracking-wider text-mutedGrey block mb-1">
              Destination Address
            </span>
            <p className="font-semibold">{order.shipping_full_name}</p>
            <p className="text-mutedGrey">{order.shipping_street}</p>
            {order.shipping_apartment && <p className="text-mutedGrey">{order.shipping_apartment}</p>}
            <p className="text-mutedGrey">{order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}</p>
            <p className="text-mutedGrey">Phone: {order.shipping_phone}</p>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-mutedGrey block mb-1">
              Logistics & Courier Telemetry
            </span>
            <p className="font-semibold text-primary">{order.shipment_record?.carrier_name || 'Shiprocket Partner'}</p>
            <p className="text-mutedGrey">Tracking ID: <strong>{trackingNumber}</strong></p>
            <p className="text-mutedGrey">Estimated Delivery: <strong>{estDelivery}</strong></p>
            <p className="text-mutedGrey">Payment Method: {order.payment_method} (Demo)</p>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="pt-4 border-t border-borderNeutral space-y-3">
          <span className="font-bold uppercase tracking-wider text-mutedGrey text-xs block">
            Items in this Shipment
          </span>
          <div className="divide-y divide-borderNeutral/50">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-softNeutral rounded overflow-hidden border border-borderNeutral flex-shrink-0">
                    <img src={item.image_url || '/assets/logo.jpg'} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal block">{item.product_name}</span>
                    {item.variant_name && <span className="text-mutedGrey text-[11px]">{item.variant_name}</span>}
                    <span className="text-mutedGrey text-[11px] block">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-charcoal">
                  ₹{Number(item.subtotal).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-borderNeutral text-xs space-y-1.5 text-right">
          <div className="flex justify-between sm:justify-end gap-6 text-mutedGrey">
            <span>Subtotal:</span>
            <span className="font-semibold text-charcoal">₹{Number(order.subtotal_amount).toLocaleString('en-IN')}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between sm:justify-end gap-6 text-primary font-semibold">
              <span>Coupon Discount:</span>
              <span>- ₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between sm:justify-end gap-6 text-mutedGrey">
            <span>Insured Delivery:</span>
            <span className="font-semibold text-charcoal">
              {Number(order.shipping_amount) === 0 ? 'FREE' : `₹${order.shipping_amount}`}
            </span>
          </div>
          <div className="flex justify-between sm:justify-end gap-6 text-mutedGrey">
            <span>GST (3%):</span>
            <span className="font-semibold text-charcoal">₹{Number(order.tax_amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between sm:justify-end gap-6 text-sm font-bold text-primary pt-2 border-t border-borderNeutral">
            <span>Final Paid (Demo):</span>
            <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      <div className="mt-8 text-center">
        <Link to="/shop" className="text-xs text-primary hover:underline font-semibold">
          ← Return to Fine Jewellery Boutique
        </Link>
      </div>

    </div>
  );
};
