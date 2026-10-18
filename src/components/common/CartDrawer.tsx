import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, isLoading } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = Number(cart?.subtotal || 0);
  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-float flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-borderNeutral flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-charcoal">Your Shopping Bag</h2>
              <span className="text-xs text-mutedGrey font-medium">({cart?.total_items || 0})</span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-mutedGrey hover:text-charcoal rounded-button transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-softNeutral/60 px-4 py-3 border-b border-borderNeutral text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-charcoal mb-1.5">
                Add <span className="font-semibold text-primary">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more to qualify for <span className="font-semibold">Complimentary Insured Shipping</span>!
              </p>
            ) : (
              <div className="flex items-center gap-1.5 text-primary font-semibold mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>You unlocked Complimentary Insured Delivery!</span>
              </div>
            )}
            <div className="w-full bg-borderNeutral h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-softNeutral flex items-center justify-center text-mutedGrey">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif-luxury text-lg text-charcoal font-medium">Your bag is empty</h3>
                <p className="text-xs text-mutedGrey max-w-xs">
                  Discover our certified diamond solitaires and handcrafted gold jewellery to begin your collection.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="btn-primary mt-2 text-xs"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.items.map((item) => {
                const product = item.product;
                const unitPrice = Number(item.unit_price);
                const itemSubtotal = Number(item.subtotal);
                const primaryImage = product.primary_image || '/assets/logo.jpg';

                return (
                  <div
                    key={item.id}
                    className="flex gap-3.5 pb-4 border-b border-borderNeutral/60 last:border-b-0"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="w-20 h-24 rounded-card overflow-hidden bg-softNeutral flex-shrink-0 border border-borderNeutral"
                    >
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={closeCart}
                            className="text-xs sm:text-sm font-medium text-charcoal hover:text-primary transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={isLoading}
                            className="text-mutedGrey hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.variant && (
                          <p className="text-[11px] text-mutedGrey mt-0.5">
                            {item.variant.variant_type}: <span className="font-medium text-charcoal">{item.variant.variant_name}</span>
                          </p>
                        )}

                        <p className="text-xs font-semibold text-charcoal mt-1">
                          ₹{unitPrice.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-borderNeutral rounded-button overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading || item.quantity <= 1}
                            className="p-1 px-2 text-charcoal hover:bg-softNeutral disabled:opacity-40 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-1 px-2 text-charcoal hover:bg-softNeutral disabled:opacity-40 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-primary">
                          ₹{itemSubtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart && cart.items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-borderNeutral bg-warmIvory/60 space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-mutedGrey">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mutedGrey">Estimated Insured Shipping</span>
                  <span className="font-medium text-primary">
                    {cart.estimated_shipping === 0 ? 'FREE' : `₹${cart.estimated_shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-borderNeutral">
                  <span>Estimated Total</span>
                  <span className="text-primary text-base">₹{Number(cart.total_price).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={isLoading}
                className="btn-primary w-full gap-2 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="text-xs text-mutedGrey hover:text-primary transition-colors underline font-medium"
                >
                  View full cart details & apply coupons
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
