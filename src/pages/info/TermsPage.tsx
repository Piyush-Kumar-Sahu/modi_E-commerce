import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl space-y-8 text-xs sm:text-sm text-mutedGrey leading-relaxed">
      <div className="text-center space-y-2 pb-6 border-b border-borderNeutral">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal Terms</span>
        <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">Terms of Service</h1>
        <p className="text-xs text-mutedGrey">Effective: October 2026</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">1. Atelier Operations & Authenticity</h2>
        <p>
          By browsing or purchasing from Modiecommers Fine Jewellery, you agree that all jewellery weights, carat grades, and dimensions are certified according to standard gemological tolerances.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">2. Order Acceptance & Server Price Authority</h2>
        <p>
          Receipt of an electronic order confirmation does not constitute our final acceptance of an order. Modiecommers reserves the right to validate pricing, bullion rate fluctuations, stock availability, and verified identification prior to order dispatch.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">3. Verified Purchaser Review Policy</h2>
        <p>
          To maintain genuine trust and prevent fabricated endorsements, customer reviews are strictly restricted to verified patrons who have completed an authenticated order for the respective design.
        </p>
      </div>
    </div>
  );
};
