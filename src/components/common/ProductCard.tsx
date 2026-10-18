import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentPrice = Number(product.current_price || product.base_price);
  const basePrice = Number(product.base_price);
  const isOnSale = product.sale_price && Number(product.sale_price) < basePrice;

  const primaryImage = product.primary_image || '/assets/logo.jpg';
  const secondaryImage = product.secondary_image || primaryImage;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (err: any) {
      alert(err.message || 'Please sign in to save jewellery pieces.');
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_in_stock) return;

    setIsAdding(true);
    try {
      // Pick the first available variant if exists, else generic product
      const defaultVariantId = product.variants && product.variants.length > 0 ? product.variants[0].id : null;
      await addToCart(product.id, defaultVariantId, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error('Quick add failed:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="card-jewellery group flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container (Strict 4:5 portrait crop) */}
      <div className="relative aspect-[4/5] bg-softNeutral/60 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isOnSale && (
            <span className="badge-sale">
              Sale
            </span>
          )}
          {product.is_new_arrival && !isOnSale && (
            <span className="badge-featured">
              New Arrival
            </span>
          )}
          {product.is_bestseller && !product.is_new_arrival && !isOnSale && (
            <span className="badge-neutral">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button (Min 44x44px target) */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-fast z-10 ${
            isFavorited
              ? 'bg-white text-accent shadow-sm'
              : 'bg-white/90 text-charcoal/70 hover:text-accent hover:bg-white shadow-sm'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-accent text-accent' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-fast z-10">
          {product.is_in_stock ? (
            <button
              onClick={handleQuickAdd}
              disabled={isAdding || isCartLoading}
              className="w-full h-10 bg-white/95 backdrop-blur-sm text-charcoal hover:bg-primary hover:text-white font-medium text-xs rounded-button border border-borderNeutral/80 shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary group-hover:text-white" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isAdding ? 'Adding...' : 'Quick Add to Bag'}</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full h-10 bg-charcoal/80 backdrop-blur-sm text-white text-xs font-semibold rounded-button flex items-center justify-center">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* 2. Product Meta Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metal & Category metadata */}
          <div className="flex items-center justify-between text-[11px] text-mutedGrey tracking-wide mb-1">
            <span>{product.metal_purity_display || '18K Gold'} • {product.category_name}</span>
            {product.average_rating > 0 && (
              <span className="flex items-center gap-1 font-medium text-charcoal">
                ★ {product.average_rating}
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-semibold text-charcoal hover:text-primary transition-colors line-clamp-1 group-hover:underline"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2 border-t border-borderNeutral/50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-charcoal">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {isOnSale && (
              <span className="text-xs text-mutedGrey line-through">
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {!product.is_in_stock && (
            <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
