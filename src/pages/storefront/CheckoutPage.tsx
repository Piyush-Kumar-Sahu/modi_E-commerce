import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersApi, CheckoutPayload } from '../../api/orders';
import { authApi } from '../../api/auth';
import { Address } from '../../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const passedCoupon = (location.state as any)?.couponCode || '';

  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');

  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  // Shipping & Payment Demo selections
  const [shippingMethod, setShippingMethod] = useState<'express_air' | 'priority_vault'>('express_air');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'cod_demo'>('razorpay_upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Submission & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill from authenticated user profile and addresses
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
      setPhone(user.phone_number || '');
      setFullName(user.display_name || '');

      authApi.getAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
        if (defaultAddr) {
          applyAddress(defaultAddr);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const applyAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setStreet(addr.street_address);
    setApartment(addr.apartment_suite || '');
    setCity(addr.city);
    setStateName(addr.state);
    setPostalCode(addr.postal_code);
  };

  const subtotal = Number(cart?.subtotal || 0);
  const shippingCharge = subtotal >= 5000 ? 0 : 250;
  const taxEstimate = Math.round(subtotal * 0.03 * 100) / 100;
  const grandTotal = subtotal + shippingCharge + taxEstimate;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      setErrorMessage('Your shopping cart is currently empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: CheckoutPayload = {
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      customer_name: fullName.trim(),
      shipping_full_name: fullName.trim(),
      shipping_phone: phone.trim(),
      shipping_street: street.trim(),
      shipping_apartment: apartment.trim() || undefined,
      shipping_city: city.trim(),
      shipping_state: stateName.trim(),
      shipping_postal_code: postalCode.trim(),
      shipping_country: 'India',
      coupon_code: passedCoupon || undefined,
      payment_method: paymentMethod,
      customer_note: customerNote.trim() || undefined,
    };

    try {
      const res = await ordersApi.checkout(payload);
      if (res.success && res.order) {
        navigate(`/orders/confirmed/${res.order.order_number}`, {
          state: { order: res.order },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.userMessage || err.message || 'We could not complete your order submission. Please review the details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container py-10 sm:py-14">
      {/* Checkout Title */}
      <div className="mb-8 pb-6 border-b border-borderNeutral flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Armoured Insured Checkout
          </span>
          <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">
            Secure Delivery & Payment
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Verification</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-button flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form: Delivery, Shiprocket & Razorpay Simulation (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Customer Information */}
            <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal pb-2 border-b border-borderNeutral">
                1. Patron Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Singhania"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Contact Phone (Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98200 12345"
                    className="input-field text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-charcoal block mb-1">Email for Insured Order Tracking *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="input-field text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-borderNeutral">
                <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                  2. Destination Address
                </h2>
                {savedAddresses.length > 0 && (
                  <span className="text-xs text-mutedGrey">
                    {savedAddresses.length} saved addresses
                  </span>
                )}
              </div>

              {/* Saved Address Quick Selector if logged in */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2 pb-2">
                  <label className="text-xs font-semibold text-charcoal block">Choose Saved Address:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr.id}
                        onClick={() => applyAddress(addr)}
                        className={`p-3 text-left rounded-button border text-xs transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-borderNeutral bg-white hover:bg-softNeutral'
                        }`}
                      >
                        <p className="font-bold text-charcoal">{addr.full_name}</p>
                        <p className="text-mutedGrey text-[11px] truncate">{addr.street_address}, {addr.city}</p>
                        <p className="text-mutedGrey text-[11px]">{addr.postal_code}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Street Address / House / Flat *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 42, Sea Face Apartments, Worli"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Apartment, Suite, Landmark (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="e.g. Near Nehru Science Centre"
                    className="input-field text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 400018"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Special Delivery Note / Instructions (Optional)</label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="e.g. Deliver between 2 PM - 5 PM. Call before arrival."
                    className="input-field text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. Shiprocket Shipping Method Selection UI (Demo Mode) */}
            <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-borderNeutral">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                    3. Insured Courier Service (Shiprocket Demo Partner)
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Simulation
                </span>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('express_air')}
                  className={`flex items-start justify-between p-4 rounded-button border cursor-pointer transition-all ${
                    shippingMethod === 'express_air'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-borderNeutral bg-white hover:bg-softNeutral'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-charcoal">
                        Shiprocket Express Air (BlueDart Armoured Logistics)
                      </span>
                      <span className="badge-neutral text-[10px]">Estimated 3–4 Days</span>
                    </div>
                    <p className="text-[11px] text-mutedGrey">
                      Tamper-evident packaging with real-time OTP doorstep verification.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {subtotal >= 5000 ? 'FREE' : '₹250'}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('priority_vault')}
                  className={`flex items-start justify-between p-4 rounded-button border cursor-pointer transition-all ${
                    shippingMethod === 'priority_vault'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-borderNeutral bg-white hover:bg-softNeutral'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-charcoal">
                        Shiprocket Priority Vault Delivery
                      </span>
                      <span className="badge-featured text-[10px]">Express 48h</span>
                    </div>
                    <p className="text-[11px] text-mutedGrey">
                      Direct vault-to-door expedited armoured flight transport.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-charcoal">₹500</span>
                </label>
              </div>

              <div className="text-[11px] text-mutedGrey italic">
                Notice: Courier tracking numbers and status timelines generated upon order placement represent simulated Shiprocket telemetry.
              </div>
            </div>

            {/* 4. Razorpay Payment Method UI (Demo Mode) */}
            <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-borderNeutral">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal">
                    4. Payment Method (Razorpay Demo Simulation)
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Demo Gateway
                </span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-button text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Demo Mode Active:</strong> No real bank charges, card captures, or live UPI debits occur. Simulated transactions are verified instantly on the server.
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_upi')}
                  className={`p-3 rounded-button border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'razorpay_upi'
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-borderNeutral bg-white text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_card')}
                  className={`p-3 rounded-button border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'razorpay_card'
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-borderNeutral bg-white text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card (Demo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_netbanking')}
                  className={`p-3 rounded-button border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'razorpay_netbanking'
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-borderNeutral bg-white text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod_demo')}
                  className={`p-3 rounded-button border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'cod_demo'
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-borderNeutral bg-white text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>COD Demo</span>
                </button>
              </div>

              {/* Interactive payment details based on selection */}
              {paymentMethod === 'razorpay_upi' && (
                <div className="p-4 bg-softNeutral/70 rounded-button border border-borderNeutral space-y-2 text-xs">
                  <label className="font-semibold text-charcoal block">Enter Simulated Virtual Payment Address (VPA):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input-field h-10 text-xs"
                    placeholder="username@okhdfcbank"
                  />
                  <p className="text-[11px] text-mutedGrey">
                    Supported test simulators: Google Pay, PhonePe, Paytm, BHIM UPI.
                  </p>
                </div>
              )}

              {paymentMethod === 'razorpay_card' && (
                <div className="p-4 bg-softNeutral/70 rounded-button border border-borderNeutral space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-charcoal block mb-1">Simulated Card Number:</label>
                    <input
                      type="text"
                      disabled
                      value="4111 •••• •••• 1111 (Razorpay Test Card)"
                      className="input-field h-10 text-xs bg-white/70"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" disabled value="12/28" className="input-field h-10 text-xs bg-white/70" />
                    <input type="text" disabled value="888 (CVV)" className="input-field h-10 text-xs bg-white/70" />
                  </div>
                </div>
              )}

              {paymentMethod === 'razorpay_netbanking' && (
                <div className="p-4 bg-softNeutral/70 rounded-button border border-borderNeutral space-y-2 text-xs">
                  <label className="font-semibold text-charcoal block">Select Partner Bank Simulator:</label>
                  <select className="input-field h-10 text-xs">
                    <option>HDFC Bank (Demo Simulation)</option>
                    <option>ICICI Bank (Demo Simulation)</option>
                    <option>State Bank of India (Demo Simulation)</option>
                    <option>Axis Bank (Demo Simulation)</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod_demo' && (
                <div className="p-4 bg-softNeutral/70 rounded-button border border-borderNeutral text-xs text-mutedGrey">
                  Cash on Delivery simulation chosen. OTP confirmation requested upon courier arrival.
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Order Summary & Action (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-borderNeutral rounded-card p-6 shadow-sm sticky top-28 space-y-5">
              <h3 className="font-serif-luxury text-xl font-bold text-charcoal pb-3 border-b border-borderNeutral">
                Your Order Summary
              </h3>

              {/* Items Snapshot */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-borderNeutral/50">
                {cart?.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-12 bg-softNeutral rounded overflow-hidden border border-borderNeutral flex-shrink-0">
                        <img
                          src={item.product.primary_image || '/assets/logo.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-charcoal block line-clamp-1">{item.product.name}</span>
                        <span className="text-[11px] text-mutedGrey">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-charcoal">
                      ₹{Number(item.subtotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-borderNeutral space-y-2 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-mutedGrey">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {passedCoupon && (
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Applied Coupon</span>
                    <span>{passedCoupon}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-mutedGrey">Insured Armoured Shipping</span>
                  <span className="font-semibold text-primary">
                    {shippingCharge === 0 ? 'COMPLIMENTARY' : `₹${shippingCharge}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-mutedGrey">3% GST on Jewellery</span>
                  <span className="font-semibold">₹{taxEstimate.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-borderNeutral flex justify-between items-baseline">
                  <span className="text-sm font-bold text-charcoal">Total Payable</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !cart || cart.items.length === 0}
                className="btn-primary w-full h-12 text-sm font-semibold tracking-wide gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Demo Transaction...</span>
                ) : (
                  <>
                    <span>Authorise Demo Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center space-y-1">
                <p className="text-[11px] text-mutedGrey">
                  By confirming, you agree to Modiecommers Terms & Return Policies.
                </p>
                <p className="text-[11px] text-primary font-semibold">
                  Demo Payment Gateway — No real debit.
                </p>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
