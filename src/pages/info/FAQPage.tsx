import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Diamond Certification & Authenticity',
      q: 'Are all Modiecommers diamonds certified by independent laboratories?',
      a: 'Yes. Every solitaire diamond above 0.30 carats is certified by renowned third-party grading institutions including SGL (Solitaire Gemological Laboratories) and IGI (International Gemological Institute). Each certified stone features a microscopic laser-inscribed unique serial number on its girdle corresponding exactly to your official certificate.'
    },
    {
      category: 'Diamond Certification & Authenticity',
      q: 'How can I verify the BIS Hallmarking on gold jewellery?',
      a: 'Every piece crafted by Modiecommers carries the official Bureau of Indian Standards (BIS) Hallmark stamp. The hallmark includes the BIS triangular logo, purity mark (e.g., 916 for 22K gold, 750 for 18K gold, 585 for 14K gold), and the Unique Identification Number (HUID) verifiable via the BIS Care mobile app.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'How are high-value fine jewellery packages secured during shipping?',
      a: 'All orders are dispatched through specialized armored logistics partners (BlueDart Armoured Apex) in tamper-evident security parcels. The shipment is 100% insured against loss or damage until handed over to you with OTP verification.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'What is the standard delivery timeframe?',
      a: 'In-stock pieces are dispatched within 24 to 48 hours and arrive within 3 to 5 business days across metro cities in India. Bespoke or customized sizing orders require approximately 7 to 10 business days for master casting and setting.'
    },
    {
      category: 'Sizing & Customization',
      q: 'Can I request a complimentary ring resizing?',
      a: 'Yes! Modiecommers provides one complimentary ring resizing within 30 days of receiving your order (for eligible solitaire designs up to ±1.5 standard sizes).'
    },
    {
      category: 'Exchange & Buyback',
      q: 'What is your 15-Day Exchange and Lifetime Buyback policy?',
      a: 'We offer a 15-day inspection period during which unworn jewellery in its original vault packaging with intact certificates can be exchanged. Furthermore, we provide a lifetime buyback guarantee based on the prevailing market rate of gold and certified diamonds.'
    },
    {
      category: 'Payment & Demo Architecture',
      q: 'What is the demo mode indicator on payments and tracking?',
      a: 'This website architecture features simulated Razorpay payment workflows and Shiprocket shipment telemetry for demonstration. No live charges are deducted, and all payment records are clearly labelled as demonstration transactions.'
    }
  ];

  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Help Centre & Client Guidance
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-charcoal">
          Frequently Asked Questions
        </h1>
        <p className="text-mutedGrey text-xs sm:text-sm max-w-md mx-auto">
          Find comprehensive guidance regarding our certified diamonds, hallmarked gold, insured logistics, and sizing.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-borderNeutral rounded-card overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-softNeutral/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">
                    {faq.category}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-charcoal block">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-mutedGrey transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-mutedGrey leading-relaxed border-t border-borderNeutral/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
