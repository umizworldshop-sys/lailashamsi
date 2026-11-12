import { useState, useEffect } from 'react';
import { SparklesIcon, PlusIcon, TrashIcon, CheckIcon, UploadIcon } from '../Icons';
import { uploadImageFile } from '../../services/api';

const PRESET_DISCOUNTS = [10, 20, 25, 30, 40, 50, 60, 70];

export default function AdminStoreSettings({
  siteSettings,
  onSaveSettings,
  token,
  showToast
}) {
  const [salePercent, setSalePercent] = useState(siteSettings?.saleDiscountPercent || 30);
  const [saleType, setSaleType] = useState(siteSettings?.saleDiscountType || 'FLAT');
  const [marqueeList, setMarqueeList] = useState(
    Array.isArray(siteSettings?.marqueeItems) && siteSettings.marqueeItems.length > 0
      ? siteSettings.marqueeItems
      : [
          'Discover Timeless Pakistani Elegance',
          'Cash on Delivery Across Pakistan',
          '100% Authentic Handcrafted Pure Fabrics',
          'Express Nationwide Delivery',
          'WhatsApp Support: 03174341036'
        ]
  );
  const [newMarqueeText, setNewMarqueeText] = useState('');

  const [heroSlides, setHeroSlides] = useState(
    Array.isArray(siteSettings?.heroSlides) && siteSettings.heroSlides.length > 0
      ? siteSettings.heroSlides
      : [
          {
            id: 1,
            tag: 'Velvet Formals 2026',
            title: 'Grace in Every Thread',
            subtitle: 'Handcrafted Velvet & Zari Peshwas',
            image: 'https://jazmin.pk/cdn/shop/files/2C5A5663.png?v=1793342503&width=2000'
          },
          {
            id: 2,
            tag: 'Festive Pret & Couture',
            title: 'Festive Pret & Couture',
            subtitle: 'Pure Chiffon, Fine Lawn & Embroidered Silks',
            image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=2000&auto=format&fit=crop'
          },
          {
            id: 3,
            tag: 'Royal Heritage Formals',
            title: 'Timeless Eastern Elegance',
            subtitle: 'Flared Kalidar Silhouettes & Gotta Kinari Work',
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=85&w=2000&auto=format&fit=crop'
          }
        ]
  );

  const [uploadingSlideIndex, setUploadingSlideIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sync local form state when siteSettings prop updates from backend
  useEffect(() => {
    if (!siteSettings) return;
    const timer = setTimeout(() => {
      if (siteSettings.saleDiscountPercent) {
        setSalePercent(siteSettings.saleDiscountPercent);
      }
      if (siteSettings.saleDiscountType) {
        setSaleType(siteSettings.saleDiscountType);
      }
      if (Array.isArray(siteSettings.marqueeItems) && siteSettings.marqueeItems.length > 0) {
        setMarqueeList(siteSettings.marqueeItems);
      }
      if (Array.isArray(siteSettings.heroSlides) && siteSettings.heroSlides.length > 0) {
        setHeroSlides(siteSettings.heroSlides);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [siteSettings]);

  // Marquee handlers
  const handleAddMarqueeItem = () => {
    const trimmed = newMarqueeText.trim();
    if (!trimmed) return;
    setMarqueeList([...marqueeList, trimmed]);
    setNewMarqueeText('');
  };

  const handleUpdateMarqueeItem = (idx, val) => {
    const updated = [...marqueeList];
    updated[idx] = val;
    setMarqueeList(updated);
  };

  const handleRemoveMarqueeItem = (idx) => {
    if (marqueeList.length <= 1) {
      if (showToast) showToast('At least 1 marquee line is required.');
      return;
    }
    setMarqueeList(marqueeList.filter((_, i) => i !== idx));
  };

  // Hero Slide handlers
  const handleSlideFieldChange = (idx, field, value) => {
    const updated = [...heroSlides];
    updated[idx] = { ...updated[idx], [field]: value };
    setHeroSlides(updated);
  };

  const handleAddHeroSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        id: Date.now(),
        tag: 'New Season 2026',
        title: 'Luxury Eastern Couture',
        subtitle: 'Handcrafted Embroidered Formals & Pret',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=2000&auto=format&fit=crop'
      }
    ]);
  };

  const handleRemoveHeroSlide = (idx) => {
    if (heroSlides.length <= 1) {
      if (showToast) showToast('At least 1 Hero Slide is required.');
      return;
    }
    setHeroSlides(heroSlides.filter((_, i) => i !== idx));
  };

  const handleSlideImageUpload = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 1 MB per image limit
    if (file.size > 1 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (showToast) showToast(`Image exceeds 1 MB limit (${sizeMB} MB). Please select an image under 1 MB.`);
      alert(`Image "${file.name}" exceeds the 1 MB limit (${sizeMB} MB). Please select or compress your photo under 1 MB.`);
      if (e.target) e.target.value = '';
      return;
    }

    setUploadingSlideIndex(idx);

    const readFileAsDataUrl = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(f);
      });

    try {
      // Instant preview
      const localPreview = await readFileAsDataUrl(file);
      handleSlideFieldChange(idx, 'image', localPreview);

      // Upload to Cloudinary
      const res = await uploadImageFile(file, token);
      if (res && res.imageUrl) {
        handleSlideFieldChange(idx, 'image', res.imageUrl);
        if (showToast) showToast(`Slide ${idx + 1} photo uploaded to Cloudinary!`);
      }
    } catch {
      if (showToast) showToast(`Slide ${idx + 1} photo attached! Will upload on Save.`);
    } finally {
      setUploadingSlideIndex(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveSettings({
        saleDiscountPercent: Number(salePercent) || 30,
        saleDiscountType: saleType,
        marqueeItems: marqueeList.map((m) => m.trim()).filter(Boolean),
        heroSlides: heroSlides.filter((s) => s && s.image)
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24 md:pb-8">
      {/* Top Sticky Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[#141018] p-3.5 sm:p-5 rounded-2xl border border-[#D4AF37]/40 shadow-lg">
        <div>
          <h2 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
            <span>Homepage Banners & Storefront Settings</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
            Manage your Homepage Hero Slider banner photos, titles, and Grand Seasonal Sale discount percentage.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingSlideIndex !== null}
          className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#b59024] hover:from-[#e0bc42] hover:to-[#c9a129] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
        >
          <CheckIcon className="w-4 h-4 stroke-[3]" />
          <span>{saving ? 'Saving Changes...' : 'Save Banner Settings'}</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* SECTION 1: HOMEPAGE HERO BANNER SLIDER (PRIMARY)                     */}
      {/* =================================================================== */}
      <div className="bg-[#141018] rounded-3xl border border-[#26202C] p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26202C] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              1. HOMEPAGE HERO BANNER SLIDER
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Hero Banner Slides ({heroSlides.length} Active Slides)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Upload photos directly from your device (Max 1 MB) and set banner headings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddHeroSlide} 
            className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>+ Add New Banner Slide</span> 
          </button>
        </div>

        {/* Slides List */}
        <div className="space-y-5">
          {heroSlides.map((slide, idx) => ( 
            <div
              key={slide.id || idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#1A1521] border border-[#2E2536] grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
            >
              {/* Slide Image Preview & Device Upload (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] flex items-center justify-center font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span>Banner Picture</span>
                  </span>
                  {heroSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroSlide(idx)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>Remove Slide</span>
                    </button>
                  )}
                </div>

                {/* Banner Live Preview Box */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#110E14] border border-[#382E42] group shadow-inner">
                  <img
                    src={slide.image || '/Logo.jpeg'}
                    alt={slide.title || `Slide ${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/Logo.jpeg';
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3">
                    {slide.tag && (
                      <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                        {slide.tag}
                      </span>
                    )}
                    <p className="text-xs font-bold text-white truncate">{slide.title || 'Untitled Banner'}</p>
                    {slide.subtitle && (
                      <p className="text-[10px] text-gray-300 truncate">{slide.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Upload from Device Button (Max 1 MB) */}
                <div className="space-y-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    id={`hero-slide-upload-${idx}`}
                    onChange={(e) => handleSlideImageUpload(idx, e)}
                    disabled={uploadingSlideIndex === idx}
                    className="hidden"
                  />
                  <label
                    htmlFor={`hero-slide-upload-${idx}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-bold text-xs text-center cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    {uploadingSlideIndex === idx ? (
                      <span className="animate-pulse">Uploading to Cloudinary...</span>
                    ) : (
                      <>
                        <UploadIcon className="w-4 h-4 shrink-0" />
                        <span>Upload Picture from Device</span>
                      </>
                    )}
                  </label>
                  <p className="text-[10px] text-gray-400 text-center">
                    JPG, PNG or WEBP (Strictly under 1 MB limit)
                  </p>
                </div>
              </div>

              {/* Slide Content Fields (7 cols) - Clean & Focused */}
              <div className="lg:col-span-7 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-200 block">
                    Main Heading Title
                  </label>
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => handleSlideFieldChange(idx, 'title', e.target.value)}
                    placeholder="e.g. Grace in Every Thread"
                    className="w-full bg-[#130F18] border border-[#2F2638] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-200 block">
                    Subtitle Description
                  </label>
                  <input
                    type="text"
                    value={slide.subtitle || ''}
                    onChange={(e) => handleSlideFieldChange(idx, 'subtitle', e.target.value)}
                    placeholder="e.g. Handcrafted Velvet & Zari Peshwas"
                    className="w-full bg-[#130F18] border border-[#2F2638] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-200 block">
                    Top Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={slide.tag || ''}
                    onChange={(e) => handleSlideFieldChange(idx, 'tag', e.target.value)}
                    placeholder="e.g. Velvet Formals 2026"
                    className="w-full bg-[#130F18] border border-[#2F2638] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {/* Status indicator */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-gray-400 border-t border-[#26202C]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Banner Ready</span>
                  </span>
                  <span className="text-[#D4AF37] text-[10px] font-mono">
                    Slide #{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: GRAND SEASONAL SALE BANNER                               */}
      {/* =================================================================== */}
      <div className="bg-[#141018] rounded-3xl border border-[#26202C] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26202C] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              2. GRAND SEASONAL SALE BANNER
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Sale Banner Discount ({saleType} % OFF)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose FLAT or UP TO discount offer and configure the percentage shown across the promotional sale banner.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#641E32]/40 border border-[#B76E79]/40 text-xs font-bold text-[#D4AF37] self-start sm:self-auto">
            Currently: {saleType} {salePercent}% OFF
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-4">
            {/* Discount Prefix Type: FLAT vs UP TO */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-200 block">
                Discount Offer Type (FLAT or UP TO)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'FLAT', label: 'FLAT', desc: 'Storewide Automatic Sale' },
                  { id: 'UP TO', label: 'UP TO', desc: 'Manual Outfit Discounts' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSaleType(item.id)}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col gap-0.5 ${
                      saleType === item.id
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md scale-[1.02]'
                        : 'bg-[#1A1521] text-gray-300 hover:text-white border-[#2F2638] hover:border-gray-600'
                    }`}
                  >
                    <span className="font-mono font-bold text-xs uppercase tracking-wider">{item.id}</span>
                    <span className={`text-[10px] ${saleType === item.id ? 'text-black/80 font-medium' : 'text-gray-400'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic explanation card depending on selected mode */}
              <div className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                saleType === 'FLAT'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}>
                {saleType === 'FLAT' ? (
                  <div className="space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-300">
                      <span>⚡ Storewide Flat Sale Activated</span>
                    </p>
                    <p className="text-[11px] opacity-95">
                      Store ke <strong className="text-white">tamaam products</strong> par automatically <strong>{salePercent || 30}% OFF</strong> lag jayega. Sabhi prices automatically calculate ho kar reduce hongi, original price par strikethrough aayega, aur har outfit par <strong>{salePercent || 30}% OFF</strong> ka badge show hoga.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <span>🏷️ UP TO Individual Discounts Activated</span>
                    </p>
                    <p className="text-[11px] opacity-95">
                      Sirf un outfits par sale aur discount tag show hoga jin par aapne <strong>Products</strong> section mein manually discount set kiya hai. Baaqi tamaam outfits apni regular full price par rahengi.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-200 block">
                Enter Discount Percentage (%)
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-36">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={salePercent}
                    onChange={(e) => setSalePercent(e.target.value)}
                    className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl pl-4 pr-9 py-2.5 text-base font-mono font-bold text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    %
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Changes &ldquo;{saleType} {salePercent}% OFF&rdquo; on Sales Banner
                </span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-gray-400 block">Quick Select Discount:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_DISCOUNTS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setSalePercent(pct)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      Number(salePercent) === pct
                        ? 'bg-[#D4AF37] text-black shadow-md scale-105'
                        : 'bg-[#1A1521] text-gray-300 hover:text-white border border-[#2F2638]'
                    }`}
                  >
                    {saleType} {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Banner Mini Preview */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#641E32] via-[#7d2640] to-[#501325] text-[#FAF5EC] p-5 border border-[#B89B62]/40 shadow-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-white/10 text-[#B89B62] border border-[#B89B62]/40 font-bold">
                LIMITED TIME OFFER
              </span>
              <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Grand Seasonal <span className="text-[#B89B62]">Sale</span>
              </h4>
              <p className="text-[10px] text-[#E8DCCB]/80">Live Banner Preview</p>
            </div>
            <div className="text-right border-l border-white/15 pl-4 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B89B62] font-semibold block">
                SPECIAL DISCOUNT
              </span>
              <div className="font-cinzel text-xl sm:text-2xl font-extrabold text-white">
                {saleType} <span className="text-[#B89B62]">{salePercent || 30}%</span> OFF
              </div>
              <span className="text-[8px] text-[#E8DCCB]/80 uppercase tracking-widest block">
                {saleType === 'FLAT' ? 'ON ENTIRE STORE COLLECTION' : 'ON SELECTED SALE OUTFITS'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 3: OPTIONAL TOP MARQUEE TICKER (COLLAPSIBLE)                 */}
      {/* =================================================================== */}
      <details className="bg-[#141018] rounded-2xl border border-[#26202C] p-4 sm:p-5 group transition-all">
        <summary className="cursor-pointer text-xs font-semibold text-gray-400 hover:text-[#D4AF37] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#D4AF37]">
              Optional
            </span>
            <span>Top Navbar Announcement Bar Ticker ({marqueeList.length} Messages)</span>
          </div>
          <span className="text-[10px] text-gray-500 group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>

        <div className="mt-4 pt-4 border-t border-[#26202C] space-y-4">
          <p className="text-xs text-gray-400">
            Edit or add promotional announcements that scroll at the very top of your website navbar.
          </p>

          {/* Existing Marquee Lines */}
          <div className="space-y-2.5">
            {marqueeList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#1A1521] border border-[#2F2638] text-[#D4AF37] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateMarqueeItem(idx, e.target.value)}
                  placeholder="Enter announcement text..."
                  className="flex-1 bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMarqueeItem(idx)}
                  className="p-2 bg-rose-950/50 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800/40 transition-colors cursor-pointer shrink-0"
                  title="Remove line"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Marquee Line */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="text"
              value={newMarqueeText}
              onChange={(e) => setNewMarqueeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMarqueeItem();
                }
              }}
              placeholder="Add new marquee message..."
              className="flex-1 bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddMarqueeItem}
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </details>

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving || uploadingSlideIndex !== null}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#b59024] hover:from-[#e0bc42] hover:to-[#c9a129] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CheckIcon className="w-4 h-4 stroke-[3]" />
          <span>{saving ? 'Saving Settings...' : 'Save Banner Settings'}</span>
        </button>
      </div>
    </form>
  );
}

