import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl space-y-8 text-xs sm:text-sm text-mutedGrey leading-relaxed">
      <div className="text-center space-y-2 pb-6 border-b border-borderNeutral">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Insured Logistics</span>
        <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">Shipping & Delivery Policy</h1>
        <p className="text-xs text-mutedGrey">Last updated: October 2026</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">1. Complimentary Insured Armoured Transit</h2>
        <p>
          All Modiecommers orders exceeding <strong>₹5,000</strong> qualify for 100% complimentary insured shipping across all pin codes in India. Orders below this threshold incur a nominal insured handling charge of ₹250.
        </p>
        <p>
          From the exact moment our master setters release your jewellery from our Mumbai central vault until the physical handover at your address, the parcel is insured for its full declared replacement value.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">2. Delivery Timeframes & Dispatch</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>In-Stock Solitaires & Bands:</strong> Dispatched within 24 to 48 business hours; arrives in 3 to 5 business days.</li>
          <li><strong>Custom Sizing & Engravings:</strong> Dispatched within 5 to 7 business days.</li>
          <li><strong>Bespoke Bridal Heirlooms:</strong> Individually cast and crafted; dispatched in 10 to 14 business days.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">3. Tamper-Evident Security Seals</h2>
        <p>
          Your jewellery arrives inside an armoured courier polybag equipped with high-security tamper indicators. If you observe any evidence of tearing, puncture, or open seals, do not accept delivery and immediately contact our Concierge at <strong>+91 98765 43210</strong>.
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-card text-xs text-amber-900">
        <strong>Demo Integration Scope:</strong> For the present website architecture, Shiprocket partner delivery timelines and AWB tracking numbers are provided in simulated demo mode.
      </div>
    </div>
  );
};
