import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, TicketPercent, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { promotionsApi, CouponValidationResult } from '../../api/promotions';
import { EmptyState } from '../../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponValidating, setCouponValidating] = useState(false);

  const subtotal = Number(cart?.subtotal || 0);
  const discountAmount = couponResult ? Number(couponResult.discount_amount) : 0;
  const shippingAmount = subtotal >= 5000 ? 0 : 250;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.03 * 100) / 100;
  const finalTotal = taxableAmount + shippingAmount + taxAmount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponValidating(true);
    setCouponError(null);
    try {
      const res = await promotionsApi.validateCoupon(couponCode.trim(), subtotal);
      setCouponResult(res.data);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponResult(null);
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { couponCode: couponResult?.code } });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="section-container py-16">
        <EmptyState
          title="Your Jewellery Bag is Empty"
          description="Explore our certified diamond solitaires, royal bridal heirlooms, and gold necklaces to find your signature piece."
          actionText="Explore Fine Jewellery"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="section-container py-10 sm:py-14">
      <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-charcoal mb-8">
        Your Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Line Items (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-borderNeutral rounded-card overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-xs font-bold uppercase tracking-wider text-mutedGrey border-b border-borderNeutral bg-warmIvory/60">
              <span className="col-span-6">Jewellery Piece</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            <div className="divide-y divide-borderNeutral/60">
              {cart.items.map((item) => {
                const product = item.product;
                const unitPrice = Number(item.unit_price);
                const itemSubtotal = Number(item.subtotal);
                const primaryImg = product.primary_image || '/assets/logo.jpg';

                return (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    
                    {/* Piece Details */}
                    <div className="col-span-6 flex gap-3.5 w-full">
                      <Link
                        to={`/product/${product.slug}`}
                        className="w-18 h-22 sm:w-20 sm:h-24 aspect-[4/5] rounded-card overflow-hidden bg-softNeutral flex-shrink-0 border border-borderNeutral"
                      >
                        <img src={primaryImg} alt={product.name} className="w-full h-full object-cover" />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${product.slug}`}
                            className="text-xs sm:text-sm font-semibold text-charcoal hover:text-primary transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-[11px] text-mutedGrey mt-0.5">
                              {item.variant.variant_type}: <span className="font-semibold text-charcoal">{item.variant.variant_name}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-mutedGrey">
                            SKU: {item.variant?.sku || product.sku}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-1 self-start mt-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center text-xs font-semibold text-charcoal hidden sm:block">
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-2 flex justify-center w-full sm:w-auto">
                      <div className="flex items-center border border-borderNeutral rounded-button overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="px-2.5 py-1 text-charcoal hover:bg-softNeutral text-xs font-bold disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="px-2.5 py-1 text-charcoal hover:bg-softNeutral text-xs font-bold disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line Subtotal */}
                    <div className="col-span-2 text-right text-sm font-bold text-primary w-full sm:w-auto flex justify-between sm:block">
                      <span className="sm:hidden text-xs text-mutedGrey font-normal">Subtotal:</span>
                      <span>₹{itemSubtotal.toLocaleString('en-IN')}</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-mutedGrey pt-2">
            <Link to="/shop" className="text-primary hover:underline font-semibold">
              ← Continue Shopping
            </Link>
            <span>All precious metals insured in transit</span>
          </div>
        </div>

        {/* Right Column: Order Summary (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Input Box */}
          <div className="bg-white border border-borderNeutral rounded-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal">
              <TicketPercent className="w-4 h-4 text-primary" />
              <span>Privileged Promo Code</span>
            </div>

            {couponResult ? (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-button text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Code "{couponResult.code}" Applied!</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-red-600 text-[11px] underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10, ROYAL15"
                  className="input-field uppercase text-xs"
                />
                <button
                  type="submit"
                  disabled={couponValidating || !couponCode.trim()}
                  className="btn-secondary h-11 sm:h-12 text-xs whitespace-nowrap px-4 font-bold"
                >
                  {couponValidating ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            {couponError && (
              <div className="text-[11px] text-red-600 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{couponError}</span>
              </div>
            )}
            
            <p className="text-[11px] text-mutedGrey">
              Try demo codes: <strong>WELCOME10</strong> (10% off), <strong>GLOW2000</strong> (₹2,000 off), or <strong>ROYAL15</strong> (15% off).
            </p>
          </div>

          {/* Cost Summary Box */}
          <div className="bg-white border border-borderNeutral rounded-card p-5 space-y-4 shadow-sm">
            <h3 className="font-serif-luxury text-lg font-bold text-charcoal pb-3 border-b border-borderNeutral">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-mutedGrey">Gross Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span>Coupon Discount ({couponResult?.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-mutedGrey">Insured Armoured Transit</span>
                <span className="font-semibold text-primary">
                  {shippingAmount === 0 ? 'COMPLIMENTARY' : `₹${shippingAmount}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-mutedGrey">Estimated GST (3% on Gold & Gems)</span>
                <span className="font-semibold">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-borderNeutral flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-charcoal block">Total Amount</span>
                  <span className="text-[10px] text-mutedGrey">All duties and insurance included</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn-primary w-full text-sm font-semibold tracking-wide gap-2 h-12"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-borderNeutral text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-xs text-mutedGrey font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Insured Delivery & Lifetime Authenticity</span>
              </div>
              <p className="text-[11px] text-mutedGrey">
                Checkout demo simulation supported by Razorpay & Shiprocket.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
