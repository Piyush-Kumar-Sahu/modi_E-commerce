import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  ChevronRight,
  ChevronDown,
  Check,
  Share2,
  AlertCircle,
  Gem,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '../../types';
import { catalogueApi } from '../../api/catalogue';
import { reviewsApi } from '../../api/reviews';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { ProductDetailSkeleton } from '../../components/common/LoadingSkeleton';
import { ProductCard } from '../../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care' | 'shipping'>('desc');
  const [isAdding, setIsAdding] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // Review Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState<{ can_review: boolean; message?: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    catalogueApi
      .getProductDetail(slug)
      .then((data) => {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        // Load reviews
        reviewsApi.getProductReviews(slug).then(setReviews).catch(() => {});
        // Load related
        if (data.category_slug) {
          catalogueApi.getProducts({ category: data.category_slug, page_size: 4 }).then((rel) => {
            setRelatedProducts(rel.results.filter((p) => p.id !== data.id));
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load product detail:', err);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="section-container py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">Jewellery Piece Not Found</h2>
        <p className="text-mutedGrey text-sm">The selected jewellery item may have been archived or is no longer available.</p>
        <Link to="/shop" className="btn-primary">Return to Collection</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.image)
    : [product.primary_image || '/assets/logo.jpg'];

  const currentPrice = selectedVariant
    ? Number(selectedVariant.final_price)
    : Number(product.current_price);
  const basePrice = Number(product.base_price);
  const isOnSale = product.sale_price && Number(product.sale_price) < basePrice;
  const isFavorited = isInWishlist(product.id);
  const isAvailable = selectedVariant ? selectedVariant.is_in_stock : product.is_in_stock;

  const handleAddToCart = async () => {
    if (!isAvailable) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, selectedVariant?.id, quantity);
      setIsAddedFeedback(true);
      setTimeout(() => setIsAddedFeedback(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Could not add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleCheckReviewEligibility = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await reviewsApi.checkEligibility(product.id);
      if (res.can_review) {
        setReviewEligibility({ can_review: true });
        setIsReviewModalOpen(true);
      } else {
        if (res.already_reviewed) {
          alert('You have already submitted a review for this jewellery piece. Thank you!');
        } else {
          alert('Only verified purchasers who have ordered this jewellery piece can submit an authentic customer review.');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Could not check review eligibility');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError(null);
    try {
      await reviewsApi.submitReview({
        product_id: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccess(false);
        // Reload reviews
        reviewsApi.getProductReviews(product.slug).then(setReviews);
      }, 1800);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="section-container py-8 sm:py-12">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-mutedGrey mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <Link to="/shop" className="hover:text-charcoal transition-colors">Jewellery</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link to={`/shop?category=${product.category.slug}`} className="hover:text-charcoal transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Gallery (55-60% width) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image (4:5 Ratio) */}
          <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-white border border-borderNeutral shadow-sm">
            <img
              src={images[selectedImageIndex] || '/assets/logo.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {isOnSale && <span className="badge-sale">Sale Price</span>}
              {product.is_new_arrival && !isOnSale && <span className="badge-featured">New Arrival</span>}
              <span className="badge-neutral">{product.metal_purity_display || '18K Gold'}</span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-card ${
                isFavorited ? 'bg-white text-accent' : 'bg-white/90 text-charcoal hover:text-accent'
              }`}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-accent text-accent' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 rounded-card overflow-hidden bg-white border transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/20 scale-105'
                      : 'border-borderNeutral opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Purchase Details Panel (40-45% width) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs text-mutedGrey mb-1.5">
              <span>SKU: {selectedVariant ? selectedVariant.sku : product.sku}</span>
              {product.average_rating > 0 && (
                <div className="flex items-center gap-1 text-charcoal font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.average_rating}</span>
                  <span className="text-mutedGrey font-normal">({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-charcoal leading-tight">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="text-xs sm:text-sm text-mutedGrey mt-2 leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="p-4 bg-white border border-borderNeutral rounded-card space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {isOnSale && (
                <span className="text-sm text-mutedGrey line-through">
                  ₹{basePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-mutedGrey">
              Inclusive of all taxes & 3% GST. Free insured shipping across India.
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
                Select {product.variants[0].variant_type}:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 rounded-button text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : 'border-borderNeutral bg-white text-charcoal hover:bg-softNeutral'
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Stock Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-charcoal">Quantity:</span>
              <span className={`font-semibold ${isAvailable ? 'text-primary' : 'text-red-600'}`}>
                {isAvailable ? 'In Stock (Ready to Dispatch)' : 'Temporarily Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-borderNeutral rounded-button bg-white h-12 w-32 px-3 justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !isAvailable}
                  className="text-mutedGrey hover:text-charcoal font-bold text-lg disabled:opacity-30"
                >
                  -
                </button>
                <span className="font-bold text-sm text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isAvailable}
                  className="text-mutedGrey hover:text-charcoal font-bold text-lg disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding || isCartLoading}
                className="btn-primary flex-1 h-12 text-sm gap-2"
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAdding ? 'Adding to Bag...' : 'Add to Shopping Bag'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Buy Now Direct Button */}
          {isAvailable && (
            <button
              onClick={handleBuyNow}
              disabled={isAdding || isCartLoading}
              className="btn-secondary w-full h-12 text-sm font-semibold tracking-wide bg-softNeutral hover:bg-borderNeutral/40"
            >
              Buy Now with 1-Click
            </button>
          )}

          {/* Trust Guarantees */}
          <div className="p-4 bg-warmIvory/80 rounded-card border border-borderNeutral/70 space-y-2.5 text-xs text-charcoal">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Certified Natural Diamonds & Govt. BIS Hallmarked Purity</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Complimentary Insured Delivery within 3–5 Business Days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-accent flex-shrink-0" />
              <span>15-Day Hassle-Free Exchange & Lifetime Valuation Buyback</span>
            </div>
          </div>

          {/* Accordion Tabs */}
          <div className="border-t border-borderNeutral pt-4 space-y-3 text-xs">
            
            {/* Description Tab */}
            <div className="border border-borderNeutral rounded-button overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'desc' ? ('' as any) : 'desc')}
                className="w-full p-3.5 text-left font-semibold text-charcoal flex items-center justify-between hover:bg-softNeutral/40 transition-colors"
              >
                <span>Atelier Description & Craft Details</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'desc' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'desc' && (
                <div className="p-3.5 pt-0 text-mutedGrey leading-relaxed border-t border-borderNeutral/40">
                  {product.description}
                </div>
              )}
            </div>

            {/* Specifications Tab */}
            <div className="border border-borderNeutral rounded-button overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'specs' ? ('' as any) : 'specs')}
                className="w-full p-3.5 text-left font-semibold text-charcoal flex items-center justify-between hover:bg-softNeutral/40 transition-colors"
              >
                <span>Precious Metal & Gemstone Specifications</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'specs' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'specs' && (
                <div className="p-3.5 pt-0 space-y-2 text-mutedGrey border-t border-borderNeutral/40">
                  <div className="grid grid-cols-2 gap-2 py-1 border-b border-borderNeutral/40">
                    <span className="font-medium text-charcoal">Precious Metal:</span>
                    <span>{product.metal_type_display}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-1 border-b border-borderNeutral/40">
                    <span className="font-medium text-charcoal">Gold Purity:</span>
                    <span>{product.metal_purity_display}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-1 border-b border-borderNeutral/40">
                    <span className="font-medium text-charcoal">Primary Gemstone:</span>
                    <span>{product.gemstone || 'Natural Certified Diamond'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-1 border-b border-borderNeutral/40">
                    <span className="font-medium text-charcoal">Gross Weight:</span>
                    <span>{product.weight_grams} grams</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-1">
                    <span className="font-medium text-charcoal">Packaging:</span>
                    <span>{product.packaging_info}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Care Instructions Tab */}
            <div className="border border-borderNeutral rounded-button overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'care' ? ('' as any) : 'care')}
                className="w-full p-3.5 text-left font-semibold text-charcoal flex items-center justify-between hover:bg-softNeutral/40 transition-colors"
              >
                <span>Jewellery Care & Preservation</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'care' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'care' && (
                <div className="p-3.5 pt-0 text-mutedGrey leading-relaxed border-t border-borderNeutral/40">
                  {product.care_instructions || 'Store in airtight suede or velvet boxes. Clean gently with warm water and a lint-free cloth.'}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3. Verified Customer Reviews Section */}
      <section className="mt-20 pt-12 border-t border-borderNeutral">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
              Verified Patron Reviews
            </h3>
            <p className="text-xs text-mutedGrey mt-1">
              {reviews.length} authentic customer reviews from verified jewellery purchasers.
            </p>
          </div>

          <button
            onClick={handleCheckReviewEligibility}
            className="btn-secondary text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Write a Verified Review</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-white border border-borderNeutral rounded-card">
            <p className="text-xs text-mutedGrey mb-3">No reviews submitted yet for this newly released design.</p>
            <p className="text-xs text-primary font-semibold">Have you ordered this piece? Sign in to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 bg-white border border-borderNeutral rounded-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400' : 'text-borderNeutral'}`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Purchase</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-charcoal">{r.title}</h4>
                <p className="text-xs text-mutedGrey leading-relaxed">{r.comment}</p>

                <div className="pt-3 border-t border-borderNeutral/50 flex items-center justify-between text-[11px] text-mutedGrey">
                  <span className="font-semibold text-charcoal">{r.user_name}</span>
                  <span>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-borderNeutral">
          <h3 className="font-serif-luxury text-2xl font-bold text-charcoal mb-8 text-center sm:text-left">
            You May Also Admire
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative bg-white rounded-card shadow-float max-w-lg w-full p-6 sm:p-8 space-y-5 z-10">
            <h3 className="font-serif-luxury text-xl font-bold text-charcoal">
              Submit Verified Purchaser Review
            </h3>
            <p className="text-xs text-mutedGrey">
              Share your feedback for <strong>{product.name}</strong>. Your review will display with a Verified Purchase badge.
            </p>

            {reviewError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-button text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            {reviewSuccess ? (
              <div className="p-4 bg-primary/10 text-primary rounded-button text-xs font-semibold text-center">
                Review submitted successfully! Thank you for your feedback.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Your Rating:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-borderNeutral'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Review Headline:</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Stunning clarity and timeless design"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Your Experience & Feedback:</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the craftsmanship, diamond brilliance, fit, and packaging..."
                    className="w-full p-3 bg-white border border-borderNeutral rounded-button text-xs text-charcoal focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="btn-primary flex-1 text-xs"
                  >
                    {reviewSubmitting ? 'Verifying & Submitting...' : 'Post Verified Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
