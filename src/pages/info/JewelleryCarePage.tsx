import React from 'react';
import { Sparkles, Shield, Droplets, Sun, AlertTriangle } from 'lucide-react';

export const JewelleryCarePage: React.FC = () => {
  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl space-y-10 text-xs sm:text-sm text-mutedGrey leading-relaxed">
      <div className="text-center space-y-2 pb-6 border-b border-borderNeutral">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Master Preservation</span>
        <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">Fine Jewellery Care Guide</h1>
        <p className="text-xs text-mutedGrey">Preserve the fire, brilliance, and luster of your precious metals for lifetimes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-borderNeutral rounded-card p-5 space-y-3">
          <Droplets className="w-6 h-6 text-primary" />
          <h3 className="font-bold text-charcoal text-sm">Gentle Cleaning Protocol</h3>
          <p className="text-xs text-mutedGrey">
            Immerse your diamond ring or gold necklace in a bowl of lukewarm water with mild, ammonia-free liquid soap. Use a baby soft toothbrush to gently clean beneath prongs, rinse thoroughly with fresh water, and pat dry with a microfibre cloth.
          </p>
        </div>

        <div className="bg-white border border-borderNeutral rounded-card p-5 space-y-3">
          <AlertTriangle className="w-6 h-6 text-accent" />
          <h3 className="font-bold text-charcoal text-sm">Avoid Chemical Exposure</h3>
          <p className="text-xs text-mutedGrey">
            Perfumes, hairsprays, chlorines in swimming pools, and household cleaning bleach can discolor precious alloy metals and dull gemstone faceting. Always apply cosmetics and fragrances before wearing fine jewellery.
          </p>
        </div>

        <div className="bg-white border border-borderNeutral rounded-card p-5 space-y-3">
          <Shield className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-charcoal text-sm">Individual Storage in Velvet Vaults</h3>
          <p className="text-xs text-mutedGrey">
            Natural diamonds are the hardest known mineral and can scratch softer gold, emeralds, and pearls if stored together loosely. Store each piece in separate lined compartments or individual suede pouches.
          </p>
        </div>

        <div className="bg-white border border-borderNeutral rounded-card p-5 space-y-3">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-charcoal text-sm">Annual Atelier Prong Inspection</h3>
          <p className="text-xs text-mutedGrey">
            Solitaire prongs experience normal microscopic wear over years of daily enjoyment. We invite all Modiecommers patrons to complimentary annual ultrasonic cleansing and prong integrity checks.
          </p>
        </div>
      </div>
    </div>
  );
};
