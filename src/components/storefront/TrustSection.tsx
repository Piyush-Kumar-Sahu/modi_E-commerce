import React from 'react';
import { Award, ShieldCheck, Gem, PackageCheck, Clock, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <Gem className="w-6 h-6 text-emerald-600" />,
      title: 'Certified Natural Diamonds',
      description: 'Every diamond solitaire undergoes strict 4C quality grading by independent laboratories (IGI & SGL) with laser-inscribed certificates.',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: 'Govt. BIS Hallmarked Gold',
      description: 'Guaranteed purity. Each piece is stamped with the BIS Hallmark logo, karatage mark (22K 916 / 18K 750), and unique assay identification.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: '100% Insured Delivery',
      description: 'Dispatched through specialized armoured logistics in multi-layer security tamper-evident seals directly to your doorstep.',
    },
    {
      icon: <PackageCheck className="w-6 h-6 text-accent" />,
      title: 'Luxury Keepsake Velvet Vault',
      description: 'Arrives in our custom plush green velvet presentation case, ideal for proposals, anniversaries, and lifelong heirloom preservation.',
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-hover" />,
      title: '15-Day Exchange & Lifetime Buyback',
      description: 'Shop with absolute peace of mind. Transparent exchange terms and competitive guaranteed gold/diamond valuation buyback policies.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: 'Bespoke Atelier Craftsmanship',
      description: 'Master artisans with generations of experience in micro-pavé setting, filigree work, and hand-finished high polishing.',
    },
  ];

  return (
    <section className="py-20 bg-warmIvory border-b border-borderNeutral/60">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            The Modiecommers Promise
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-medium text-charcoal">
            Uncompromising Purity & Enduring Artistry
          </h2>
          <p className="text-mutedGrey text-sm leading-relaxed">
            We hold our fine jewellery to the highest benchmark of integrity, transparency, and master craftsmanship.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-card border border-borderNeutral shadow-sm hover:shadow-card transition-all duration-fast space-y-3.5"
            >
              <div className="w-12 h-12 rounded-full bg-softNeutral flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-base font-semibold text-charcoal tracking-wide">
                {p.title}
              </h3>
              <p className="text-xs text-mutedGrey leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
