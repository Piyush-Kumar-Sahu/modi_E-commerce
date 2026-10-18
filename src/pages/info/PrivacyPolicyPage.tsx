import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl space-y-8 text-xs sm:text-sm text-mutedGrey leading-relaxed">
      <div className="text-center space-y-2 pb-6 border-b border-borderNeutral">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Confidentiality</span>
        <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">Privacy & Data Governance Policy</h1>
        <p className="text-xs text-mutedGrey">Effective: October 2026</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">1. Information Collection & Purpose</h2>
        <p>
          Modiecommers collects customer contact information (name, delivery address, phone, email) solely for verifying high-value precious jewellery orders, facilitating encrypted courier delivery, and issuing legal GST and BIS Hallmark certificates.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">2. Payment Security & Zero Card Data Retention</h2>
        <p>
          Modiecommers does not store, process, or retain sensitive card numbers, CVVs, or bank net banking credentials on our local application servers. All transaction simulations occur through encrypted PCI-DSS compliant sandbox interfaces.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-luxury text-lg font-bold text-charcoal">3. Customer Rights & Data Deletion</h2>
        <p>
          You retain the right to inspect, edit, or request deletion of your account profile at any time, subject to statutory taxation and audit record keeping obligations under Indian commercial law.
        </p>
      </div>
    </div>
  );
};
