import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Layers,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Category, Collection, ProductVariant } from '../../types';
import { adminApi } from '../../api/admin';
import { catalogueApi } from '../../api/catalogue';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  // Product Form Fields
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategory, setPCategory] = useState<number | string>('');
  const [pCollection, setPCollection] = useState<number | string>('');
  const [pBasePrice, setPBasePrice] = useState('');
  const [pSalePrice, setPSalePrice] = useState('');
  const [pMetalType, setPMetalType] = useState('yellow_gold');
  const [pMetalPurity, setPMetalPurity] = useState('18k');
  const [pGemstone, setPGemstone] = useState('Natural Certified Diamond');
  const [pWeight, setPWeight] = useState('4.50');
  const [pDescription, setPDescription] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsNewArrival, setPIsNewArrival] = useState(false);
  const [pIsBestseller, setPIsBestseller] = useState(false);
  const [pIsActive, setPIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Image Upload Fields
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [imageIsPrimary, setImageIsPrimary] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Variant Fields
  const [vType, setVType] = useState('Ring Size');
  const [vName, setVName] = useState('Size 7');
  const [vSku, setVSku] = useState('');
  const [vPriceAdj, setVPriceAdj] = useState('0');
  const [vStock, setVStock] = useState('10');
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      adminApi.getProducts({ search, category: selectedCategory || undefined }),
      catalogueApi.getCategories(),
      catalogueApi.getCollections(),
    ])
      .then(([prodRes, cats, cols]) => {
        setProducts(prodRes.results || []);
        setCategories(cats);
        setCollections(cols);
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setPName('');
    setPSku(`MOD-JW-${Date.now().toString().slice(-4)}`);
    setPCategory(categories[0]?.id || '');
    setPCollection('');
    setPBasePrice('45000');
    setPSalePrice('');
    setPMetalType('yellow_gold');
    setPMetalPurity('18k');
    setPGemstone('Natural Certified Diamond');
    setPWeight('4.50');
    setPDescription('Handcrafted with certified diamonds and pure hallmarked gold.');
    setPIsFeatured(false);
    setPIsNewArrival(true);
    setPIsBestseller(false);
    setPIsActive(true);
    setFormError(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPSku(p.sku);
    setPCategory(p.category?.id || (categories.find(c => c.slug === p.category_slug)?.id || ''));
    setPCollection(p.collection?.id || '');
    setPBasePrice(String(p.base_price));
    setPSalePrice(p.sale_price ? String(p.sale_price) : '');
    setPMetalType(p.metal_type);
    setPMetalPurity(p.metal_purity);
    setPGemstone(p.gemstone);
    setPWeight(String(p.weight_grams));
    setPDescription(p.description);
    setPIsFeatured(p.is_featured);
    setPIsNewArrival(p.is_new_arrival);
    setPIsBestseller(p.is_bestseller);
    setPIsActive(p.is_active !== false);
    setFormError(null);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const payload: any = {
      name: pName.trim(),
      sku: pSku.trim(),
      category: Number(pCategory),
      collection: pCollection ? Number(pCollection) : null,
      base_price: pBasePrice,
      sale_price: pSalePrice ? pSalePrice : null,
      metal_type: pMetalType,
      metal_purity: pMetalPurity,
      gemstone: pGemstone,
      weight_grams: pWeight,
      description: pDescription,
      is_featured: pIsFeatured,
      is_new_arrival: pIsNewArrival,
      is_bestseller: pIsBestseller,
      is_active: pIsActive,
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.slug, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setIsProductModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you wish to delete/archive "${name}"?`)) return;
    try {
      await adminApi.deleteProduct(slug);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Image Upload Handler
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageModalProduct || !selectedFile) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('alt_text', imageAlt || imageModalProduct.name);
    formData.append('is_primary', String(imageIsPrimary));

    try {
      await adminApi.uploadProductImage(imageModalProduct.slug, formData);
      setSelectedFile(null);
      setImageAlt('');
      setImageIsPrimary(false);
      // Reload product details for updated images
      const updated = await catalogueApi.getProductDetail(imageModalProduct.slug);
      setImageModalProduct(updated);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imgId: number) => {
    if (!imageModalProduct) return;
    try {
      await adminApi.deleteProductImage(imageModalProduct.slug, imgId);
      const updated = await catalogueApi.getProductDetail(imageModalProduct.slug);
      setImageModalProduct(updated);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  };

  // Variant Creation Handler
  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantModalProduct) return;

    setIsAddingVariant(true);
    try {
      await adminApi.addVariant(variantModalProduct.slug, {
        variant_type: vType,
        variant_name: vName,
        sku: vSku || `${variantModalProduct.sku}-${Date.now().toString().slice(-3)}`,
        price_adjustment: vPriceAdj,
        stock_quantity: Number(vStock),
        is_active: true,
      });
      setVName('');
      setVSku('');
      const updated = await catalogueApi.getProductDetail(variantModalProduct.slug);
      setVariantModalProduct(updated);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add variant');
    } finally {
      setIsAddingVariant(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-borderNeutral gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Jewellery Catalogue & Inventory</h2>
          <p className="text-xs text-mutedGrey mt-0.5">Manage designs, pricing, variants, and high-res photography.</p>
        </div>

        <button onClick={openAddModal} className="btn-primary h-10 px-4 text-xs gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Jewellery Piece</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, gemstone..."
            className="input-field text-xs pl-9"
          />
          <Search className="w-4 h-4 text-mutedGrey absolute left-3 top-3.5" />
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-11 sm:h-12 px-3 bg-white border border-borderNeutral rounded-button text-xs font-semibold text-charcoal"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-borderNeutral rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-borderNeutral bg-warmIvory/60 text-mutedGrey font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Piece</th>
                <th className="py-3 px-4">SKU / Metal</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderNeutral/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-mutedGrey">
                    Loading inventory catalogue...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-mutedGrey">
                    No jewellery pieces found. Click "Add New Jewellery Piece" to begin.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const currentPrice = Number(p.current_price || p.base_price);
                  const isSale = p.sale_price && Number(p.sale_price) < Number(p.base_price);

                  return (
                    <tr key={p.id} className="hover:bg-softNeutral/30">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-10 h-12 rounded bg-softNeutral overflow-hidden border border-borderNeutral flex-shrink-0">
                          <img
                            src={p.primary_image || '/assets/logo.jpg'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-charcoal block line-clamp-1">{p.name}</span>
                          <span className="text-[11px] text-mutedGrey">{p.gemstone || 'Natural Diamond'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-charcoal block">{p.sku}</span>
                        <span className="text-[11px] text-mutedGrey">{p.metal_purity_display || '18K'}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-charcoal">
                        {p.category_name}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-charcoal block">₹{currentPrice.toLocaleString('en-IN')}</span>
                        {isSale && (
                          <span className="text-[10px] text-mutedGrey line-through">₹{Number(p.base_price).toLocaleString('en-IN')}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-bold ${p.total_stock <= 5 ? 'text-red-600' : 'text-primary'}`}>
                          {p.total_stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          p.is_active !== false ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-600'
                        }`}>
                          {p.is_active !== false ? 'Active' : 'Archived'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setImageModalProduct(p);
                            setIsImageModalOpen(true);
                          }}
                          className="p-1.5 text-mutedGrey hover:text-primary rounded"
                          title="Manage Photos"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setVariantModalProduct(p);
                            setIsVariantModalOpen(true);
                          }}
                          className="p-1.5 text-mutedGrey hover:text-primary rounded"
                          title="Manage Variants & Stock"
                        >
                          <Layers className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-mutedGrey hover:text-primary rounded"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.slug, p.name)}
                          className="p-1.5 text-mutedGrey hover:text-red-600 rounded"
                          title="Archive / Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white rounded-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 z-10 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-mutedGrey">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-600 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Design Title *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Imperial Diamond Solitaire Ring"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">SKU Reference *</label>
                  <input
                    type="text"
                    required
                    value={pSku}
                    onChange={(e) => setPSku(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Category *</label>
                  <select
                    required
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="input-field text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Curated Suite (Optional)</label>
                  <select
                    value={pCollection}
                    onChange={(e) => setPCollection(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="">None / Standalone</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Base Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={pBasePrice}
                    onChange={(e) => setPBasePrice(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Sale Price (Optional ₹ INR)</label>
                  <input
                    type="number"
                    value={pSalePrice}
                    onChange={(e) => setPSalePrice(e.target.value)}
                    placeholder="Leave empty if regular price"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Precious Metal</label>
                  <select
                    value={pMetalType}
                    onChange={(e) => setPMetalType(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="yellow_gold">Yellow Gold</option>
                    <option value="rose_gold">Rose Gold</option>
                    <option value="white_gold">White Gold</option>
                    <option value="platinum">Platinum</option>
                    <option value="sterling_silver">925 Sterling Silver</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Gold Karatage / Purity</label>
                  <select
                    value={pMetalPurity}
                    onChange={(e) => setPMetalPurity(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="24k">24 Karat (99.9%)</option>
                    <option value="22k">22 Karat (91.6%)</option>
                    <option value="18k">18 Karat (75.0%)</option>
                    <option value="14k">14 Karat (58.5%)</option>
                    <option value="925">925 Silver</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Gemstone Information</label>
                  <input
                    type="text"
                    value={pGemstone}
                    onChange={(e) => setPGemstone(e.target.value)}
                    placeholder="e.g. 1.05 ct VVS1 Diamond"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Gross Weight (Grams)</label>
                  <input
                    type="text"
                    value={pWeight}
                    onChange={(e) => setPWeight(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Atelier Description *</label>
                <textarea
                  rows={3}
                  required
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full p-2.5 bg-white border border-borderNeutral rounded-button text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2 border-t border-borderNeutral">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsFeatured}
                    onChange={(e) => setPIsFeatured(e.target.checked)}
                    className="rounded text-primary"
                  />
                  <span>Featured Piece</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsNewArrival}
                    onChange={(e) => setPIsNewArrival(e.target.checked)}
                    className="rounded text-primary"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsBestseller}
                    onChange={(e) => setPIsBestseller(e.target.checked)}
                    className="rounded text-primary"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsActive}
                    onChange={(e) => setPIsActive(e.target.checked)}
                    className="rounded text-primary"
                  />
                  <span>Active on Storefront</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-borderNeutral">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 text-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save Jewellery Piece'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload & Management Modal */}
      {isImageModalOpen && imageModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setIsImageModalOpen(false)} />
          <div className="relative bg-white rounded-card p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 z-10 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                  Manage Photography
                </h3>
                <p className="text-xs text-mutedGrey">{imageModalProduct.name}</p>
              </div>
              <button onClick={() => setIsImageModalOpen(false)} className="p-1 text-mutedGrey">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Images */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                Gallery Images ({imageModalProduct.images?.length || 0})
              </span>
              <div className="grid grid-cols-3 gap-3">
                {imageModalProduct.images?.map((img) => (
                  <div key={img.id} className="relative aspect-[4/5] rounded border border-borderNeutral overflow-hidden group">
                    <img src={img.image} alt={img.alt_text} className="w-full h-full object-cover" />
                    {img.is_primary && (
                      <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-white/90 text-red-600 rounded hover:bg-white shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload New Image Form */}
            <form onSubmit={handleUploadImage} className="pt-4 border-t border-borderNeutral space-y-3 text-xs">
              <span className="font-bold text-charcoal uppercase tracking-wider block">
                Upload New Image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="input-field p-2 text-xs"
              />

              <div>
                <label className="font-semibold text-charcoal block mb-1">Alt Description</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Ring on velvet presentation box"
                  className="input-field text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={imageIsPrimary}
                  onChange={(e) => setImageIsPrimary(e.target.checked)}
                  className="rounded text-primary"
                />
                <span>Set as primary catalogue image</span>
              </label>

              <button
                type="submit"
                disabled={isUploadingImage || !selectedFile}
                className="btn-primary w-full text-xs"
              >
                {isUploadingImage ? 'Uploading Image...' : 'Upload Image to Storage'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Variant & Inventory Modal */}
      {isVariantModalOpen && variantModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setIsVariantModalOpen(false)} />
          <div className="relative bg-white rounded-card p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 z-10 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                  Variants & Stock Inventory
                </h3>
                <p className="text-xs text-mutedGrey">{variantModalProduct.name}</p>
              </div>
              <button onClick={() => setIsVariantModalOpen(false)} className="p-1 text-mutedGrey">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Variants */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                Active Variants
              </span>
              <div className="divide-y divide-borderNeutral/60 border border-borderNeutral rounded-button text-xs">
                {variantModalProduct.variants?.map((v) => (
                  <div key={v.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-charcoal">{v.variant_name}</span>
                      <span className="text-mutedGrey ml-2 text-[11px]">({v.sku})</span>
                      {Number(v.price_adjustment) !== 0 && (
                        <span className="text-primary ml-2 font-semibold">
                          +{Number(v.price_adjustment)}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-charcoal bg-softNeutral px-2 py-0.5 rounded">
                      {v.stock_quantity} in stock
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Variant Form */}
            <form onSubmit={handleAddVariant} className="pt-4 border-t border-borderNeutral space-y-3 text-xs">
              <span className="font-bold text-charcoal uppercase tracking-wider block">
                Add Variant (Size / Length)
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Type</label>
                  <input
                    type="text"
                    required
                    value={vType}
                    onChange={(e) => setVType(e.target.value)}
                    placeholder="e.g. Ring Size, Chain Length"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Variant Name</label>
                  <input
                    type="text"
                    required
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    placeholder="e.g. Size 8, 18-Inch"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={vStock}
                    onChange={(e) => setVStock(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Price Adjustment (₹)</label>
                  <input
                    type="number"
                    value={vPriceAdj}
                    onChange={(e) => setVPriceAdj(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingVariant}
                className="btn-primary w-full text-xs"
              >
                {isAddingVariant ? 'Adding Variant...' : 'Add Variant to Product'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
