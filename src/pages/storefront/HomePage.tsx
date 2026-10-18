import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroBanner } from '../../components/storefront/HeroBanner';
import { CategoryGrid } from '../../components/storefront/CategoryGrid';
import { TrustSection } from '../../components/storefront/TrustSection';
import { VerifiedReviews } from '../../components/storefront/VerifiedReviews';
import { Newsletter } from '../../components/storefront/Newsletter';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton';
import { Product } from '../../types';
import { catalogueApi } from '../../api/catalogue';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      catalogueApi.getProducts({ is_featured: true, page_size: 4 }),
      catalogueApi.getProducts({ is_new_arrival: true, page_size: 4 }),
    ])
      .then(([featuredRes, newRes]) => {
        setFeaturedProducts(featuredRes.results);
        setNewArrivals(newRes.results);
      })
      .catch((err) => console.error('Error fetching homepage products:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Shop by Category */}
      <CategoryGrid />

      {/* 3. Featured Masterpieces */}
      <section className="py-20 bg-warmIvory border-b border-borderNeutral/60">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Atelier Highlights
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-medium text-charcoal mt-1">
                Featured Solitaires & Masterpieces
              </h2>
            </div>
            <Link
              to="/shop?is_featured=true"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover uppercase tracking-wider group"
            >
              <span>View All Featured</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Curated Collection Feature Banner */}
      <section className="relative py-20 bg-charcoal text-white overflow-hidden">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Royal Heritage Bridal Suite</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-medium leading-tight">
                Regal Heirlooms Handcrafted in 22K Gold & Polki
              </h2>

              <p className="text-warmIvory/70 text-sm leading-relaxed">
                Step into timeless grandeur with bridal necklaces, filigree kadas, and emerald teardrops crafted by generational artisans from Jaipur and Mumbai.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/shop?collection=royal-heritage"
                  className="btn-primary bg-primary hover:bg-primary-hover text-white text-xs tracking-wider uppercase px-8"
                >
                  Discover The Suite
                </Link>
                <Link
                  to="/shop"
                  className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 text-xs tracking-wider uppercase px-8"
                >
                  All Collections
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[16/10] sm:aspect-[16/9] rounded-card overflow-hidden shadow-float border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop&q=85"
                  alt="Royal Heritage Collection"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="py-20 bg-white border-b border-borderNeutral/60">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Fresh From The Atelier
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-medium text-charcoal mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?is_new_arrival=true"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover uppercase tracking-wider group"
            >
              <span>Explore New Releases</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Craftsmanship & Trust Section */}
      <TrustSection />

      {/* 7. Verified Customer Reviews */}
      <VerifiedReviews />

      {/* 8. Newsletter */}
      <Newsletter />
    </div>
  );
};
