import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { catalogueApi } from '../../api/catalogue';

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    catalogueApi.getCategories().then((data) => {
      setCategories(data);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const defaultCategoryImages: Record<string, string> = {
    rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    earrings: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&auto=format&fit=crop&q=80',
    bracelets: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=500&auto=format&fit=crop&q=80',
    pendants: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&auto=format&fit=crop&q=80',
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-borderNeutral/60">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Curated Categories
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
            Shop by Fine Jewellery Category
          </h2>
          <p className="text-mutedGrey text-xs sm:text-sm">
            Handcrafted with ethically sourced natural diamonds, precious gemstones, and certified pure gold.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="w-full aspect-square rounded-card bg-softNeutral" />
                <div className="h-4 w-1/2 bg-softNeutral rounded mx-auto" />
              </div>
            ))
          ) : (
            categories.map((cat) => {
              const bgImg = defaultCategoryImages[cat.slug] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80';

              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-fast"
                >
                  <div className="w-full aspect-square rounded-card overflow-hidden bg-softNeutral border border-borderNeutral relative mb-3 shadow-sm group-hover:shadow-card transition-all">
                    <img
                      src={bgImg}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  
                  <h3 className="text-sm font-semibold text-charcoal group-hover:text-primary transition-colors tracking-wide">
                    {cat.name}
                  </h3>
                  {cat.product_count !== undefined && (
                    <span className="text-[11px] text-mutedGrey mt-0.5">
                      {cat.product_count} Pieces
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
