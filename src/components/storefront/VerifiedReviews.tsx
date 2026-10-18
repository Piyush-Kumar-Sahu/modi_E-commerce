import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerifiedReviews: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      author: 'Priya S.',
      city: 'Mumbai, MH',
      productName: 'Aura Diamond Solitaire Engagement Ring',
      productSlug: 'aura-diamond-solitaire-ring',
      rating: 5,
      date: '14 Oct 2026',
      headline: 'Flawless diamond fire and exceptionally comfortable fit',
      review:
        'The Aura Solitaire exceeded all my expectations! The diamond clarity is flawless, and the craftsmanship of the platinum prongs is exceptionally secure. Arrived in a gorgeous velvet luxury case with complete hallmarking certificates.',
    },
    {
      id: 2,
      author: 'Kavita M.',
      city: 'Bengaluru, KA',
      productName: 'Noor Emerald & Polki Royal Bridal Necklace',
      productSlug: 'noor-emerald-polki-necklace',
      rating: 5,
      date: '02 Oct 2026',
      headline: 'A true heirloom masterpiece for my wedding day',
      review:
        'The meenakari enamelling on the back is just as stunning as the natural uncut polki diamonds in the front. Everyone at our sangeet ceremony could not stop complimenting this piece. Truly royal quality.',
    },
    {
      id: 3,
      author: 'Ananya D.',
      city: 'New Delhi, DL',
      productName: 'Elysian Diamond Tennis Bracelet',
      productSlug: 'elysian-diamond-tennis-bracelet',
      rating: 5,
      date: '28 Sep 2026',
      headline: 'Effortless everyday sparkle with double safety lock',
      review:
        'I wear this tennis bracelet daily. The diamonds are so well-matched and brilliant in sunlight. The double safety clasp gives me complete peace of mind. Delivery was prompt and fully insured.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-borderNeutral/60">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Customer Patrons
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-medium text-charcoal">
            Loved by Discerning Collectors
          </h2>
          <p className="text-mutedGrey text-sm">
            Authentic words from verified purchasers of Modiecommers fine jewellery.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-warmIvory/60 border border-borderNeutral rounded-card p-7 flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Stars */}
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-borderNeutral'}`}
                      />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Purchase</span>
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-charcoal leading-snug">
                  "{t.headline}"
                </h4>

                <p className="text-xs text-mutedGrey leading-relaxed italic">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-borderNeutral/70 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-charcoal block">{t.author}</span>
                  <span className="text-[11px] text-mutedGrey">{t.city}</span>
                </div>
                <Link
                  to={`/product/${t.productSlug}`}
                  className="text-[11px] text-primary hover:underline font-medium text-right max-w-[150px] truncate"
                >
                  {t.productName}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
