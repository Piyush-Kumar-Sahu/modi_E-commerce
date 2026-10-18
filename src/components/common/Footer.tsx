import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Award, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-warmIvory/90 border-t border-borderNeutral/20 pt-16 pb-12 mt-20">
      {/* 1. Value Proposition Pillars */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">100% Certified</h4>
              <p className="text-xs text-warmIvory/60 mt-0.5">SGL & IGI certified natural diamonds</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">BIS Hallmarked</h4>
              <p className="text-xs text-warmIvory/60 mt-0.5">Govt. certified 18K & 22K gold purity</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Insured Transit</h4>
              <p className="text-xs text-warmIvory/60 mt-0.5">Complimentary tamper-proof door delivery</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">15-Day Exchange</h4>
              <p className="text-xs text-warmIvory/60 mt-0.5">Hassle-free lifetime buyback guarantee</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/logo.jpg"
                alt="Modiecommers Logo"
                className="h-10 w-auto object-contain rounded bg-white p-1"
              />
            </Link>
            <p className="text-xs text-warmIvory/70 leading-relaxed max-w-sm">
              Modiecommers brings centuries of fine Indian jewellery heritage into contemporary silhouettes. 
              Meticulously handcrafted in 18K/22K gold, certified natural diamonds, and regal gemstones.
            </p>
            <div className="space-y-2 text-xs text-warmIvory/70 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>102, Heritage Diamond Tower, Zaveri Bazaar, Mumbai 400002</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 98765 43210 (Mon–Sat, 10 AM – 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>care@modiecommers.com</span>
              </div>
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fine Jewellery</h5>
            <ul className="space-y-2.5 text-xs text-warmIvory/70">
              <li><Link to="/shop?category=rings" className="hover:text-white transition-colors">Engagement Rings & Bands</Link></li>
              <li><Link to="/shop?category=necklaces" className="hover:text-white transition-colors">Bridal Necklaces & Chokers</Link></li>
              <li><Link to="/shop?category=earrings" className="hover:text-white transition-colors">Diamond Studs & Jhumkas</Link></li>
              <li><Link to="/shop?category=bracelets" className="hover:text-white transition-colors">Tennis Bracelets & Kadas</Link></li>
              <li><Link to="/shop?category=pendants" className="hover:text-white transition-colors">Solitaire Pendants</Link></li>
            </ul>
          </div>

          {/* Curated Suites */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Curated Suites</h5>
            <ul className="space-y-2.5 text-xs text-warmIvory/70">
              <li><Link to="/shop?collection=royal-heritage" className="hover:text-white transition-colors">The Royal Heritage Suite</Link></li>
              <li><Link to="/shop?collection=celestial-solitaires" className="hover:text-white transition-colors">Celestial Solitaires</Link></li>
              <li><Link to="/shop?collection=rose-gold-euphoria" className="hover:text-white transition-colors">Rose Gold Euphoria</Link></li>
              <li><Link to="/shop?collection=imperial-emeralds" className="hover:text-white transition-colors">Imperial Emeralds</Link></li>
              <li><Link to="/orders/track" className="hover:text-white transition-colors">Shipment Tracking</Link></li>
            </ul>
          </div>

          {/* Policies & Assistance */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Client Care & Policies</h5>
            <ul className="space-y-2.5 text-xs text-warmIvory/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Atelier</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Bespoke Inquiries & Contact</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/jewellery-care" className="hover:text-white transition-colors">Jewellery Care Guide</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Insured Shipping Policy</Link></li>
              <li><Link to="/returns-policy" className="hover:text-white transition-colors">15-Day Return & Exchange</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy & Terms</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Demo Disclaimer & Legal Strip */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-warmIvory/50 gap-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>
            <strong>Demo Architecture:</strong> Razorpay and Shiprocket integrations operate in demonstration mode with verified sample timelines. No actual financial debit occurs.
          </span>
        </div>
        <div>
          © {new Date().getFullYear()} Modiecommers Jewellery Retail Private Limited. All rights reserved. GSTIN: 27AAACM1234F1Z8.
        </div>
      </div>
    </footer>
  );
};
