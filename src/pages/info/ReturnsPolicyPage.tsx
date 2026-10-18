import React from 'react';
import { RotateCcw, ShieldCheck, Check } from 'lucide-react';

export const ReturnsPolicyPage: React.FC = () => {
  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl space-y-8 text-xs sm:text-sm text-mutedGrey leading-relaxed">
      <div className="text-center space-y-2 pb-6 border-b border-borderNeutral">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Patron Assurance</span>
        <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">15-Day Exchange & Lifetime Buyback</h1>
        <p className="text-xs text-mutedGrey">Transparent jewellery investment protection</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">1. 15-Day Inspection & Exchange Period</h2>
        <p>
          We want you to treasure your jewellery piece with total certainty. If for any reason you are not completely enchanted with your purchase, you may initiate an exchange within <strong>15 calendar days</strong> from the date of confirmed delivery.
        </p>
        <div className="p-4 bg-white border border-borderNeutral rounded-card space-y-2 text-xs">
          <p className="font-bold text-charcoal">Exchange Eligibility Conditions:</p>
          <ul className="space-y-1.5 text-mutedGrey">
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Jewellery must remain unworn, unaltered, and without scratches.</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Must be accompanied by original laboratory diamond certificates (SGL/IGI) and invoice.</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Returned in the original plush green velvet presentation box.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">2. Lifetime Exchange & Valuation Buyback</h2>
        <p>
          Jewellery is an appreciating asset. Modiecommers offers guaranteed lifetime buyback and upgrade options across India:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Gold Jewellery:</strong> 100% of benchmark net gold weight value at current market gold rates.</li>
          <li><strong>Diamond Jewellery:</strong> Up to 90% of prevailing certified diamond value towards upgrades.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">3. Initiating an Exchange Request</h2>
        <p>
          To arrange a secure insured return pickup, contact our client team at <strong>care@modiecommers.com</strong> or call <strong>+91 98765 43210</strong>. Our armoured courier partner will collect the verified package from your residence.
        </p>
      </div>
    </div>
  );
};
