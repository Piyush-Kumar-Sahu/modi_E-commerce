import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, Check, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Product, Category, Collection } from '../../types';
import { catalogueApi, ProductFilterParams } from '../../api/catalogue';

export const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters read from URL params
  const categoryParam = searchParams.get('category') || '';
  const collectionParam = searchParams.get('collection') || '';
  const searchParam = searchParams.get('search') || '';
  const metalTypeParam = searchParams.get('metal_type') || '';
  const metalPurityParam = searchParams.get('metal_purity') || '';
  const inStockParam = searchParams.get('in_stock') === 'true';
  const isFeaturedParam = searchParams.get('is_featured') === 'true';
  const isNewArrivalParam = searchParams.get('is_new_arrival') === 'true';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const orderingParam = searchParams.get('ordering') || 'featured';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Load Categories & Collections on mount
  useEffect(() => {
    Promise.all([catalogueApi.getCategories(), catalogueApi.getCollections()])
      .then(([cats, cols]) => {
        setCategories(cats);
        setCollections(cols);
      })
      .catch((err) => console.error('Error loading taxonomy:', err));
  }, []);

  // Fetch Products whenever URL params change
  useEffect(() => {
    setIsLoading(true);
    const filterArgs: ProductFilterParams = {
      page: pageParam,
      page_size: 12,
      category: categoryParam || undefined,
      collection: collectionParam || undefined,
      search: searchParam || undefined,
      metal_type: metalTypeParam || undefined,
      metal_purity: metalPurityParam || undefined,
      in_stock: inStockParam ? true : undefined,
      is_featured: isFeaturedParam ? true : undefined,
      is_new_arrival: isNewArrivalParam ? true : undefined,
      min_price: minPriceParam ? Number(minPriceParam) : undefined,
      max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
      ordering: orderingParam !== 'featured' ? orderingParam : undefined,
    };

    catalogueApi
      .getProducts(filterArgs)
      .then((data) => {
        setProducts(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(data.total_pages || 1);
      })
      .catch((err) => {
        console.error('Error fetching catalogue products:', err);
        setProducts([]);
      })
      .finally(() => setIsLoading(false));
  }, [
    categoryParam,
    collectionParam,
    searchParam,
    metalTypeParam,
    metalPurityParam,
    inStockParam,
    isFeaturedParam,
    isNewArrivalParam,
    minPriceParam,
    maxPriceParam,
    orderingParam,
    pageParam,
  ]);

  const updateFilter = (key: string, value: string | boolean | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    nextParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount = [
    categoryParam,
    collectionParam,
    searchParam,
    metalTypeParam,
    metalPurityParam,
    inStockParam,
    isFeaturedParam,
    isNewArrivalParam,
    minPriceParam,
    maxPriceParam,
  ].filter(Boolean).length;

  const currentCategory = categories.find((c) => c.slug === categoryParam);
  const currentCollection = collections.find((c) => c.slug === collectionParam);

  const pageTitle = currentCategory
    ? currentCategory.name
    : currentCollection
    ? currentCollection.name
    : searchParam
    ? `Search Results for "${searchParam}"`
    : 'All Fine Jewellery';

  return (
    <div className="section-container py-10 sm:py-14">
      
      {/* 1. Header Banner & Title */}
      <div className="mb-10 text-center sm:text-left border-b border-borderNeutral pb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
          {currentCollection ? 'Curated Suite' : 'Modiecommers Catalogue'}
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-charcoal">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-mutedGrey mt-2 max-w-2xl leading-relaxed">
          {currentCategory?.description ||
            currentCollection?.description ||
            'Explore our handcrafted 18K and 22K gold rings, diamond solitaires, bridal chokers, and contemporary wristlets.'}
        </p>
      </div>

      {/* 2. Controls Bar (Active Filters, Result Count, Sort Dropdown, Mobile Filter Trigger) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-borderNeutral/60 mb-8">
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden btn-secondary h-10 px-4 text-xs gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          <span className="text-xs text-mutedGrey font-medium">
            Showing <strong className="text-charcoal">{products.length}</strong> of{' '}
            <strong className="text-charcoal">{totalCount}</strong> pieces
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-mutedGrey whitespace-nowrap hidden sm:inline">Sort by:</span>
          <select
            value={orderingParam}
            onChange={(e) => updateFilter('ordering', e.target.value)}
            className="h-10 px-3 bg-white border border-borderNeutral rounded-button text-xs font-semibold text-charcoal focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
          >
            <option value="featured">Featured / Curated</option>
            <option value="newest">New Arrivals</option>
            <option value="bestseller">Bestselling Pieces</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* 3. Main Grid Layout with Left Desktop Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 pr-4 border-r border-borderNeutral/60">
          
          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Categories</h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => updateFilter('category', null)}
                className={`w-full text-left py-1.5 px-2 rounded-button transition-colors flex items-center justify-between ${
                  !categoryParam ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal hover:bg-softNeutral'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter('category', c.slug)}
                  className={`w-full text-left py-1.5 px-2 rounded-button transition-colors flex items-center justify-between ${
                    categoryParam === c.slug ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  <span>{c.name}</span>
                  {c.product_count !== undefined && (
                    <span className="text-[11px] text-mutedGrey">({c.product_count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Curated Collections */}
          <div className="space-y-3 pt-4 border-t border-borderNeutral">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Curated Suites</h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => updateFilter('collection', null)}
                className={`w-full text-left py-1.5 px-2 rounded-button transition-colors ${
                  !collectionParam ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal hover:bg-softNeutral'
                }`}
              >
                All Suites
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => updateFilter('collection', col.slug)}
                  className={`w-full text-left py-1.5 px-2 rounded-button transition-colors ${
                    collectionParam === col.slug ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Metal Type */}
          <div className="space-y-3 pt-4 border-t border-borderNeutral">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Precious Metal</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Metals', val: '' },
                { label: 'Yellow Gold', val: 'yellow_gold' },
                { label: 'Rose Gold', val: 'rose_gold' },
                { label: 'White Gold', val: 'white_gold' },
                { label: 'Platinum', val: 'platinum' },
                { label: '925 Sterling Silver', val: 'sterling_silver' },
              ].map((m) => (
                <button
                  key={m.label}
                  onClick={() => updateFilter('metal_type', m.val)}
                  className={`w-full text-left py-1 px-2 rounded-button transition-colors ${
                    metalTypeParam === m.val ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metal Purity */}
          <div className="space-y-3 pt-4 border-t border-borderNeutral">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Gold Karatage / Purity</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Purities', val: '' },
                { label: '22K (91.6% Pure)', val: '22k' },
                { label: '18K (75.0% Pure)', val: '18k' },
                { label: '14K (58.5% Pure)', val: '14k' },
                { label: '925 Silver', val: '925' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => updateFilter('metal_purity', p.val)}
                  className={`w-full text-left py-1 px-2 rounded-button transition-colors ${
                    metalPurityParam === p.val ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal hover:bg-softNeutral'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="space-y-3 pt-4 border-t border-borderNeutral">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-charcoal">
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateFilter('in_stock', e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-borderNeutral"
              />
              <span>In Stock Only</span>
            </label>
          </div>

        </aside>

        {/* Product Cards Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No jewellery found matching your criteria"
              description="Try relaxing your filters, searching for a different keyword, or exploring our entire catalog."
              actionText="Reset All Filters"
              onActionClick={clearAllFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-borderNeutral">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    return (
                      <button
                        key={pNum}
                        onClick={() => updateFilter('page', String(pNum))}
                        className={`w-10 h-10 rounded-button text-xs font-semibold transition-colors ${
                          pageParam === pNum
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white border border-borderNeutral text-charcoal hover:bg-softNeutral'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* 4. Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-float flex flex-col p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-borderNeutral">
                <h3 className="font-serif-luxury text-lg font-bold text-charcoal">Filter Jewellery</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-mutedGrey">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Filters */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-charcoal">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      updateFilter('category', null);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1.5 px-2 rounded-button ${
                      !categoryParam ? 'bg-primary/10 text-primary font-bold' : ''
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateFilter('category', c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1.5 px-2 rounded-button ${
                        categoryParam === c.slug ? 'bg-primary/10 text-primary font-bold' : ''
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-charcoal pt-2 border-t border-borderNeutral">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateFilter('in_stock', e.target.checked)}
                  className="w-4 h-4 rounded text-primary"
                />
                <span>In Stock Only</span>
              </label>

              <div className="pt-4 border-t border-borderNeutral space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn-primary w-full text-xs"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="btn-secondary w-full text-xs"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
