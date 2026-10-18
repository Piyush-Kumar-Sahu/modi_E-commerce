import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ShieldAlert, Sparkles, ChevronDown, Gem } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { promotionsApi } from '../../api/promotions';
import { catalogueApi } from '../../api/catalogue';
import { StoreSetting, Category, Collection } from '../../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, openCart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Dropdown states for Desktop
  const [isJewelleryOpen, setIsJewelleryOpen] = useState(false);
  const [isSuitsOpen, setIsSuitsOpen] = useState(false);

  // Accordion states for Mobile
  const [isMobileJewelleryExpanded, setIsMobileJewelleryExpanded] = useState(true);
  const [isMobileSuitsExpanded, setIsMobileSuitsExpanded] = useState(false);

  const [settings, setSettings] = useState<StoreSetting | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const jewelleryDropdownRef = useRef<HTMLDivElement>(null);
  const suitsDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Default fallback categories
  const defaultCategories: { id: number; name: string; slug: string }[] = [
    { id: 1, name: 'Rings', slug: 'rings' },
    { id: 2, name: 'Necklaces', slug: 'necklaces' },
    { id: 3, name: 'Earrings', slug: 'earrings' },
    { id: 4, name: 'Bracelets', slug: 'bracelets' },
    { id: 5, name: 'Pendants', slug: 'pendants' },
  ];

  // Default fallback collections/suites
  const defaultCollections: { id: number; name: string; slug: string }[] = [
    { id: 1, name: 'The Royal Heritage Suite', slug: 'royal-heritage' },
    { id: 2, name: 'Celestial Solitaires', slug: 'celestial-solitaires' },
    { id: 3, name: 'Rose Gold Euphoria', slug: 'rose-gold-euphoria' },
    { id: 4, name: 'Imperial Emeralds', slug: 'imperial-emeralds' },
  ];

  useEffect(() => {
    promotionsApi.getStoreSettings().then(setSettings).catch(() => {});
    
    // Fetch live categories and collections
    catalogueApi.getCategories()
      .then((data) => {
        if (data && data.length > 0) setCategories(data);
      })
      .catch(() => {});

    catalogueApi.getCollections()
      .then((data) => {
        if (data && data.length > 0) setCollections(data);
      })
      .catch(() => {});
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsJewelleryOpen(false);
    setIsSuitsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  // Handle outside click to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        jewelleryDropdownRef.current &&
        !jewelleryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsJewelleryOpen(false);
      }
      if (
        suitsDropdownRef.current &&
        !suitsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSuitsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility handler for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsJewelleryOpen(false);
        setIsSuitsOpen(false);
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const activeCategories = categories.length > 0 ? categories : defaultCategories;
  const activeCollections = collections.length > 0 ? collections : defaultCollections;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-borderNeutral/70 transition-all">
      {/* 1. Top Announcement Bar */}
      {settings?.is_announcement_active !== false && (
        <div className="bg-charcoal text-warmIvory text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>
            {settings?.announcement_bar_text ||
              'Complimentary insured delivery on orders over ₹5,000 | 100% Certified Natural Diamonds & Hallmarked Gold'}
          </span>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          
          {/* Left Area: Mobile Menu Toggle + Brand Wordmark */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 flex items-center justify-center -ml-1 text-charcoal hover:text-primary transition-colors focus:ring-1 focus:ring-primary rounded-button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Brand Wordmark: "Modie" in charcoal, "commers" in green */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group select-none py-1"
              aria-label="Modiecommers Home"
            >
              <span className="font-serif-luxury text-2xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight inline-flex items-baseline leading-none">
                <span className="text-charcoal group-hover:text-charcoal-light transition-colors">
                  Modie
                </span>
                <span className="text-primary font-serif-luxury group-hover:text-primary-hover transition-colors">
                  commers
                </span>
              </span>
            </Link>
          </div>

          {/* Center Area: Desktop Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-medium tracking-wide text-charcoal"
            aria-label="Main Navigation"
          >
            {/* 1. All Products */}
            <Link
              to="/shop"
              className="hover:text-primary transition-colors duration-fast relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all after:duration-fast"
            >
              All Products
            </Link>

            {/* 2. Jewellery (Dropdown) */}
            <div
              ref={jewelleryDropdownRef}
              className="relative"
              onMouseEnter={() => setIsJewelleryOpen(true)}
              onMouseLeave={() => setIsJewelleryOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsJewelleryOpen(!isJewelleryOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsJewelleryOpen(!isJewelleryOpen);
                  }
                }}
                className={`flex items-center gap-1 py-1.5 hover:text-primary transition-colors duration-fast focus:outline-none focus:text-primary ${
                  isJewelleryOpen ? 'text-primary' : ''
                }`}
                aria-haspopup="true"
                aria-expanded={isJewelleryOpen}
              >
                <span>Jewellery</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isJewelleryOpen ? 'rotate-180 text-primary' : 'opacity-60'}`} />
              </button>

              {/* Jewellery Dropdown Menu */}
              <div
                className={`absolute top-full left-0 w-64 bg-white border border-borderNeutral rounded-card shadow-float py-2 z-50 transition-all duration-200 origin-top ${
                  isJewelleryOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-1' : 'opacity-0 scale-95 pointer-events-none -translate-y-1'
                }`}
              >
                <div className="px-4 py-2 border-b border-borderNeutral/60 bg-warmIvory/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                    <Gem className="w-3 h-3 text-primary" />
                    Fine Jewellery Categories
                  </span>
                </div>

                <Link
                  to="/shop"
                  className="block px-4 py-2.5 text-xs uppercase tracking-wider text-charcoal hover:bg-softNeutral hover:text-primary font-semibold transition-colors"
                >
                  All Jewellery
                </Link>

                <div className="h-px bg-borderNeutral/40 mx-3 my-1" />

                {activeCategories.map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    to={`/shop?category=${cat.slug}`}
                    className="flex items-center justify-between px-4 py-2 text-xs text-charcoal hover:bg-softNeutral hover:text-primary transition-colors font-medium"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-mutedGrey capitalize">Explore</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Suits (Curated Suites Dropdown) */}
            <div
              ref={suitsDropdownRef}
              className="relative"
              onMouseEnter={() => setIsSuitsOpen(true)}
              onMouseLeave={() => setIsSuitsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsSuitsOpen(!isSuitsOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsSuitsOpen(!isSuitsOpen);
                  }
                }}
                className={`flex items-center gap-1 py-1.5 hover:text-primary transition-colors duration-fast focus:outline-none focus:text-primary ${
                  isSuitsOpen ? 'text-primary' : ''
                }`}
                aria-haspopup="true"
                aria-expanded={isSuitsOpen}
              >
                <span>Suits</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSuitsOpen ? 'rotate-180 text-primary' : 'opacity-60'}`} />
              </button>

              {/* Suits Dropdown Menu */}
              <div
                className={`absolute top-full left-0 w-72 bg-white border border-borderNeutral rounded-card shadow-float py-2 z-50 transition-all duration-200 origin-top ${
                  isSuitsOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-1' : 'opacity-0 scale-95 pointer-events-none -translate-y-1'
                }`}
              >
                <div className="px-4 py-2 border-b border-borderNeutral/60 bg-warmIvory/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" />
                    Signature Curated Suites
                  </span>
                </div>

                <Link
                  to="/shop"
                  className="block px-4 py-2.5 text-xs uppercase tracking-wider text-charcoal hover:bg-softNeutral hover:text-primary font-semibold transition-colors"
                >
                  All Suites & Collections
                </Link>

                <div className="h-px bg-borderNeutral/40 mx-3 my-1" />

                {activeCollections.map((col) => (
                  <Link
                    key={col.id || col.slug}
                    to={`/shop?collection=${col.slug}`}
                    className="block px-4 py-2 text-xs text-charcoal hover:bg-softNeutral hover:text-primary transition-colors font-medium"
                  >
                    {col.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Our Story */}
            <Link
              to="/about"
              className="hover:text-primary transition-colors duration-fast relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all after:duration-fast"
            >
              Our Story
            </Link>
          </nav>

          {/* Right Area: Action Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Bar Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jewellery, solitaires..."
                    className="w-44 sm:w-56 h-9 px-3 pr-8 text-xs bg-softNeutral/80 border border-borderNeutral rounded-button focus:outline-none focus:ring-1 focus:ring-primary text-charcoal"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 text-mutedGrey hover:text-charcoal"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-primary hover:bg-softNeutral/60 rounded-button transition-colors"
                  aria-label="Search catalogue"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to={isAuthenticated ? '/account?tab=wishlist' : '/login'}
              className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-primary hover:bg-softNeutral/60 rounded-button transition-colors relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-primary hover:bg-softNeutral/60 rounded-button transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart && cart.total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cart.total_items}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-button text-charcoal hover:text-primary hover:bg-softNeutral/60 transition-all"
                    aria-label="Open User Menu"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                      {user?.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-3 h-3 opacity-60 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-borderNeutral rounded-card shadow-float py-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 py-2 border-b border-borderNeutral">
                        <p className="text-xs font-semibold text-charcoal truncate">{user?.display_name}</p>
                        <p className="text-[11px] text-mutedGrey truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors border-b border-borderNeutral"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Owner Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/account"
                        className="block px-4 py-2 text-xs text-charcoal hover:bg-softNeutral transition-colors"
                      >
                        My Account & Orders
                      </Link>
                      <Link
                        to="/orders/track"
                        className="block px-4 py-2 text-xs text-charcoal hover:bg-softNeutral transition-colors"
                      >
                        Track Order
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-borderNeutral mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover px-3 py-1.5 border border-primary/30 hover:border-primary hover:bg-primary-light rounded-button transition-colors duration-fast"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-borderNeutral bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solitaires, rings, necklaces..."
              className="w-full h-11 px-4 pr-10 text-sm bg-softNeutral border border-borderNeutral rounded-button text-charcoal"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-mutedGrey hover:text-primary"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Navigation Links Accordion */}
          <div className="space-y-1">
            {/* All Products */}
            <Link
              to="/shop"
              className="block px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-softNeutral rounded-button"
            >
              All Products
            </Link>

            {/* Expandable Jewellery Section */}
            <div className="border-t border-borderNeutral/60 pt-1">
              <button
                type="button"
                onClick={() => setIsMobileJewelleryExpanded(!isMobileJewelleryExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-softNeutral rounded-button"
                aria-expanded={isMobileJewelleryExpanded}
              >
                <span className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-primary" />
                  Jewellery
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileJewelleryExpanded ? 'rotate-180 text-primary' : 'text-mutedGrey'}`} />
              </button>

              {isMobileJewelleryExpanded && (
                <div className="pl-6 pr-2 py-1 space-y-1">
                  <Link
                    to="/shop"
                    className="block px-3 py-2 text-xs font-semibold text-primary hover:bg-softNeutral rounded-button"
                  >
                    All Jewellery
                  </Link>
                  {activeCategories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/shop?category=${cat.slug}`}
                      className="block px-3 py-2 text-xs font-medium text-charcoal hover:bg-softNeutral rounded-button"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Expandable Suits Section */}
            <div className="border-t border-borderNeutral/60 pt-1">
              <button
                type="button"
                onClick={() => setIsMobileSuitsExpanded(!isMobileSuitsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-softNeutral rounded-button"
                aria-expanded={isMobileSuitsExpanded}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Suits
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileSuitsExpanded ? 'rotate-180 text-primary' : 'text-mutedGrey'}`} />
              </button>

              {isMobileSuitsExpanded && (
                <div className="pl-6 pr-2 py-1 space-y-1">
                  <Link
                    to="/shop"
                    className="block px-3 py-2 text-xs font-semibold text-primary hover:bg-softNeutral rounded-button"
                  >
                    All Suits & Collections
                  </Link>
                  {activeCollections.map((col) => (
                    <Link
                      key={col.id || col.slug}
                      to={`/shop?collection=${col.slug}`}
                      className="block px-3 py-2 text-xs font-medium text-charcoal hover:bg-softNeutral rounded-button"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Our Story */}
            <div className="border-t border-borderNeutral/60 pt-1">
              <Link
                to="/about"
                className="block px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-softNeutral rounded-button"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Quick Info & Support Links */}
          <div className="pt-3 border-t border-borderNeutral space-y-1 text-xs text-mutedGrey">
            <Link to="/contact" className="block px-3 py-1.5 hover:text-primary">
              Contact Concierge & Salon
            </Link>
            <Link to="/orders/track" className="block px-3 py-1.5 hover:text-primary">
              Track Insured Transit
            </Link>
            <Link to="/faq" className="block px-3 py-1.5 hover:text-primary">
              Bespoke FAQs & Sizing
            </Link>
          </div>

          {/* Mobile Admin Link if Admin */}
          {isAdmin && (
            <div className="pt-2 border-t border-borderNeutral">
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-button"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Owner Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
