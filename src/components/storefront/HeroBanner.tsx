import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../../types';
import { promotionsApi } from '../../api/promotions';

export const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    promotionsApi.getBanners().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
    }).catch(() => {});
  }, []);

  const defaultBanners: Banner[] = [
    {
      id: 1,
      title: 'Timeless Radiance, Handcrafted in Gold & Diamonds',
      subtitle: 'Discover certified solitaires, royal polki bridal heirlooms and contemporary everyday luxury sculpted in 18K and 22K gold.',
      cta_text: 'Explore The Collection',
      cta_link: '/shop',
      badge_text: 'Certified Natural Diamonds',
      display_order: 1,
      is_active: true,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=85',
    },
    {
      id: 2,
      title: 'The Royal Heritage Bridal Suite',
      subtitle: 'Uncut polki diamonds, rich Colombian emeralds and artisanal meenakari handcrafted for once-in-a-lifetime moments.',
      cta_text: 'View Bridal Heirlooms',
      cta_link: '/shop?collection=royal-heritage',
      badge_text: 'Master Craftsmanship',
      display_order: 2,
      is_active: true,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&auto=format&fit=crop&q=85',
    },
  ];

  const activeBanners = banners.length > 0 ? banners : defaultBanners;
  const currentBanner = activeBanners[currentIndex] || defaultBanners[0];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <section className="relative bg-warmIvory overflow-hidden border-b border-borderNeutral/60">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Editorial Headline & Value Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {currentBanner.badge_text && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>{currentBanner.badge_text}</span>
              </div>
            )}

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-medium text-charcoal leading-[1.1] tracking-tight">
              {currentBanner.title}
            </h1>

            <p className="text-mutedGrey text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              {currentBanner.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to={currentBanner.cta_link || '/shop'} className="btn-primary w-full sm:w-auto text-sm gap-2">
                <span>{currentBanner.cta_text || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop?collection=royal-heritage" className="btn-secondary w-full sm:w-auto text-sm">
                Explore Bridal Suites
              </Link>
            </div>

            {/* Micro trust cues */}
            <div className="pt-6 border-t border-borderNeutral/80 flex items-center justify-center lg:justify-start gap-6 text-xs text-mutedGrey font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                100% Certified Diamonds
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                BIS Hallmarked Gold
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Complimentary Insured Shipping
              </span>
            </div>
          </div>

          {/* Hero Photography Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] rounded-card overflow-hidden shadow-float border border-borderNeutral bg-white">
              <img
                src={currentBanner.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=85'}
                alt={currentBanner.title}
                className="w-full h-full object-cover object-center transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-button border border-white/60 shadow-subtle flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-charcoal block">Artisanal Atelier Guarantee</span>
                  <span className="text-[11px] text-mutedGrey">Direct from master Indian jewel-smiths</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                  Authentic
                </span>
              </div>
            </div>

            {/* Slider Navigation Controls if multiple banners */}
            {activeBanners.length > 1 && (
              <div className="absolute -bottom-4 right-6 flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full bg-white border border-borderNeutral text-charcoal hover:text-primary shadow-sm flex items-center justify-center transition-colors"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full bg-white border border-borderNeutral text-charcoal hover:text-primary shadow-sm flex items-center justify-center transition-colors"
                  aria-label="Next banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
