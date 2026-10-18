import React from 'react';
import { Award, Gem, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="section-container py-12 sm:py-16 space-y-16 max-w-4xl">
      
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Our Heritage & Atelier
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-medium text-charcoal">
          The Story Behind Modiecommers
        </h1>
        <p className="text-mutedGrey text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Founded with a devotion to artisanal perfection, Modiecommers marries royal Indian jewellery craftsmanship with contemporary European minimalism.
        </p>
      </div>

      {/* Atelier Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/5] rounded-card overflow-hidden bg-white border border-borderNeutral shadow-card">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1000&auto=format&fit=crop&q=80"
            alt="Jewellery Craftsmanship Atelier"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-mutedGrey leading-relaxed">
          <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">
            Generations of Master Metal-Smiths
          </h2>
          <p>
            Every piece in the Modiecommers atelier begins as an intimate sketch, drafted to highlight the natural brilliance of handpicked conflict-free diamonds and precious Colombian emeralds.
          </p>
          <p>
            Unlike mass-produced commercial fashion jewellery, each Modiecommers design is hand-cast, pavé set under high-magnification microscopes, and finished with master polishing in 18K and 22K certified gold.
          </p>
          <div className="p-4 bg-warmIvory rounded-card border border-borderNeutral space-y-1 text-charcoal font-medium">
            <p className="text-xs italic">
              "Fine jewellery is not merely an ornament; it is an enduring repository of family celebrations, milestones, and eternal affection."
            </p>
            <span className="text-[11px] text-primary font-bold block pt-1">— The Modiecommers Master Founders</span>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="space-y-6">
        <h2 className="font-serif-luxury text-2xl font-bold text-charcoal text-center">
          Our Core Craftsmanship Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-3">
            <Gem className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-charcoal text-sm">Conflict-Free Certified Diamonds</h3>
            <p className="text-xs text-mutedGrey leading-relaxed">
              We exclusively work with Kimberley Process certified suppliers, ensuring that every solitaire meets stringent ethical, humanitarian, and environmental benchmarks.
            </p>
          </div>

          <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-3">
            <Award className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-charcoal text-sm">Govt. BIS Hallmarking</h3>
            <p className="text-xs text-mutedGrey leading-relaxed">
              100% legal purity compliance. Every ingot of gold is verified by authorized assay centers and laser engraved with official hallmarking symbols.
            </p>
          </div>

          <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-charcoal text-sm">Direct Atelier Pricing</h3>
            <p className="text-xs text-mutedGrey leading-relaxed">
              By removing traditional retail showroom markups and intermediary brokers, we offer heirloom-grade fine jewellery directly to you with transparent pricing.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-charcoal text-white rounded-card p-8 sm:p-12 text-center space-y-4 shadow-float">
        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium">
          Experience the Radiance Firsthand
        </h3>
        <p className="text-xs sm:text-sm text-warmIvory/70 max-w-md mx-auto">
          Explore our signature solitaires, royal bridal suites, and modern daily jewellery collections.
        </p>
        <Link to="/shop" className="btn-primary bg-primary hover:bg-primary-hover text-white text-xs px-8">
          Explore The Collection
        </Link>
      </div>

    </div>
  );
};
