import { useState, useEffect, useRef, Fragment } from 'react';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  SearchIcon, 
  MenuIcon, 
  CloseIcon, 
  ChevronDownIcon
} from './Icons';

const DEFAULT_MARQUEE_ITEMS = [
  '✨ Umiz World Collection ✨',
  'Discover Timeless Pakistani Elegance',
  'Cash on Delivery Across Pakistan',
  '100% Authentic Handcrafted Pure Fabrics',
  'Express Nationwide Delivery',
  'WhatsApp Support: 03174341036'
];

export default function Navbar({ 
  currentRoute = '/',
  onNavigate,
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist, 
  products = [],
  onSelectProduct,
  marqueeItems = []
}) {
  const activeMarqueeList = Array.isArray(marqueeItems) && marqueeItems.filter(Boolean).length > 0
    ? marqueeItems.filter(Boolean)
    : DEFAULT_MARQUEE_ITEMS;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // In-Navbar Search States
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchExpanded(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter live matching products for in-navbar search
  const searchResults = searchQuery.trim().length > 0 
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  const handleLinkClick = (route, subFilter = null) => {
    if (onNavigate) onNavigate(route, subFilter);
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (onNavigate) onNavigate('/');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setMobileMenuOpen(false);
  };

  const isHomeActive = currentRoute === '/';
  const isNewArrivalsActive = currentRoute === '/new-arrivals';
  const isCategoriesActive = currentRoute === '/categories' || currentRoute === '/stitched' || currentRoute === '/unstitched' || currentRoute === '/baby-clothes';
  const isSalesActive = currentRoute === '/sales';
  const isAboutActive = currentRoute === '/about';
  const isContactActive = currentRoute === '/contact';

  const dropdownItems = [
    {
      id: 'female',
      title: 'Female (Women Wear)',
      route: '/categories'
    },
    {
      id: 'stitched',
      title: 'Stitched (Ready to Wear)',
      route: '/stitched'
    },
    {
      id: 'unstitched',
      title: 'Unstitched Suits',
      route: '/unstitched'
    },
    {
      id: 'babies',
      title: 'Kids Collection (Baby Clothes)',
      route: '/baby-clothes'
    }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar with Left-to-Right Marquee */}
      <div className="bg-[#641E32] text-[#FAF5EC] text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase py-1.5 sm:py-2 border-b border-[#B89B62]/30 overflow-hidden relative select-none">
        <div className="animate-marquee-ltr flex items-center whitespace-nowrap">
          {/* Loop Set 1 */}
          <div className="flex items-center space-x-8 px-4 shrink-0 font-medium">
            {activeMarqueeList.map((text, idx) => (
              <Fragment key={`m1-${idx}`}>
                <span>{text}</span>
                <span className="text-[#B89B62]">✦</span>
              </Fragment>
            ))}
          </div>

          {/* Loop Set 2 (Identical duplicate for seamless infinite loop) */}
          <div className="flex items-center space-x-8 px-4 shrink-0 font-medium" aria-hidden="true">
            {activeMarqueeList.map((text, idx) => (
              <Fragment key={`m2-${idx}`}>
                <span>{text}</span>
                <span className="text-[#B89B62]">✦</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FAF5EC]/95 text-[#282321] backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-[#E8DCCB]' 
          : 'bg-[#282321]/65 text-[#FAF5EC] backdrop-blur-md py-3 sm:py-4 border-b border-[#FAF5EC]/15'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* ======================================================== */}
          {/* LEFT: MOBILE MENU TRIGGER & BRAND LOGO                   */}
          {/* ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 transition-colors hover:text-[#B89B62] focus:outline-none"
                aria-label="Open navigation menu"
              >
                <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Clickable Brand Logo -> Returns to Home (0, 0) */}
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-0.5 select-none shrink-0"
              title="Umi'z World - Home"
            >
              <img 
                src="/logo.png" 
                alt="Umi'z World Logo" 
                onError={(e) => {
                  if (e.target.src.indexOf('Logo.jpeg') === -1) {
                    e.target.src = '/Logo.jpeg';
                  }
                }}
                className={`transition-all duration-300 rounded-lg sm:rounded-xl object-contain border border-[#B89B62]/60 group-hover:scale-105 group-hover:border-[#B89B62] ${
                  isScrolled 
                    ? 'h-9 w-9 sm:h-11 sm:w-11 shadow-sm' 
                    : 'h-10 w-10 sm:h-12 sm:w-12 shadow-[0_0_15px_rgba(184,155,98,0.25)]'
                }`}
              />
              <div className="flex flex-col text-left">
                <span className={`font-cinzel text-sm xs:text-base sm:text-xl font-bold tracking-[0.14em] sm:tracking-[0.16em] uppercase transition-colors leading-tight ${
                  isScrolled ? 'text-[#641E32] group-hover:text-[#B89B62]' : 'text-[#FAF5EC] group-hover:text-[#E8DCCB]'
                }`}>
                  UMI&apos;Z WORLD
                </span>
                <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#B89B62] font-semibold mt-0.5 truncate max-w-[150px] sm:max-w-none">
                  Umiz World Collection
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER: DESKTOP NAVIGATION LINKS WITH LUXURY DROPDOWN   */}
          {/* ======================================================== */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-3 text-xs uppercase tracking-[0.14em] font-medium shrink-0">
            
            {/* 1. HOME */}
            <button
              onClick={() => handleLinkClick('/')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                isHomeActive 
                  ? 'bg-[#641E32] text-[#FAF5EC] font-semibold shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
            >
              <span>Home</span>
            </button>

            {/* 2. NEW ARRIVALS */}
            <button
              onClick={() => handleLinkClick('/new-arrivals')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                isNewArrivalsActive 
                  ? 'bg-[#641E32] text-[#FAF5EC] font-semibold shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
            >
              <span>New Arrivals</span>
            </button>

            {/* 3. CATEGORIES WITH DROPDOWN */}
            <div 
              className="relative group py-1 shrink-0"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                onClick={() => handleLinkClick('/categories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isCategoriesActive 
                    ? 'bg-[#641E32] text-[#FAF5EC] font-semibold shadow-sm'
                    : (isScrolled 
                        ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                        : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
                }`}
              >
                <span>Categories</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Compact & Clean Categories Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-52 bg-[#FAF5EC] text-[#282321] border border-[#E8DCCB] border-t-2 border-t-[#641E32] rounded-xl shadow-[0_12px_30px_rgba(40,35,33,0.16)] p-1.5 animate-reveal-up normal-case tracking-normal">
                    <div className="space-y-0.5">
                      {dropdownItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleLinkClick(item.route || '/categories', item.id)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#641E32] hover:text-[#FAF5EC] text-[#282321] transition-all flex items-center justify-between group/item text-xs font-medium"
                        >
                          <span>{item.title}</span>
                          <span className="text-[11px] text-[#B89B62] group-hover/item:text-[#FAF5EC] transform transition-transform group-hover/item:translate-x-0.5">
                            →
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 mt-1 border-t border-[#E8DCCB]">
                      <button
                        onClick={() => handleLinkClick('/categories')}
                        className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-[#641E32] hover:text-[#B89B62] rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>View All Collections</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. SALES */}
            <button
              onClick={() => handleLinkClick('/sales')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                isSalesActive 
                  ? 'bg-[#641E32] text-[#FAF5EC] font-semibold shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
            >
              <span>Sales</span>
            </button>

            {/* 5. ABOUT */}
            <button
              onClick={() => handleLinkClick('/about')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                isAboutActive 
                  ? 'bg-[#641E32] text-[#FAF5EC] font-semibold shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
            >
              <span>About</span>
            </button>

            {/* 6. CONTACT */}
            <button
              onClick={() => handleLinkClick('/contact')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                isContactActive 
                  ? 'bg-[#641E32] text-[#FAF5EC] font-semibold shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
            >
              <span>Contact</span>
            </button>

          </div>

          {/* ======================================================== */}
          {/* RIGHT: INLINE SEARCH + WISHLIST + SHOPPING CART         */}
          {/* ======================================================== */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            
            {/* 1. INLINE EXPANDABLE SEARCH */}
            <div ref={searchContainerRef} className="relative flex items-center">
              {isSearchExpanded ? (
                <div className="flex items-center bg-[#FAF5EC] border border-[#B89B62] rounded-full pl-3 pr-1.5 py-1 sm:py-1.5 shadow-lg animate-reveal-up w-36 xs:w-44 sm:w-52 md:w-56 lg:w-60 transition-all shrink-0">
                  <SearchIcon className="w-3.5 h-3.5 text-[#641E32] flex-shrink-0 mr-1.5 sm:mr-2" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lawn, pret..."
                    className="w-full bg-transparent text-[11px] sm:text-xs text-[#282321] placeholder-[#282321]/50 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[#282321]/60 hover:text-[#641E32] text-xs px-1"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchQuery('');
                    }}
                    className="p-1 rounded-full text-[#282321]/60 hover:text-[#641E32] hover:bg-[#E8DCCB]/40 transition-colors ml-0.5 sm:ml-1"
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchExpanded(true)}
                  className={`p-2 transition-all duration-200 rounded-full ${
                    isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]'
                  }`}
                  title="Search Pakistani Eastern Wear"
                >
                  <SearchIcon className="w-4 h-4" />
                </button>
              )}

              {/* Floating Instant Search Results Dropdown */}
              {isSearchExpanded && searchQuery.trim().length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-[calc(100vw-24px)] xs:w-72 sm:w-88 max-w-sm bg-[#FAF5EC] border border-[#E8DCCB] rounded-2xl shadow-2xl p-3 z-50 animate-reveal-up text-[#282321]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8DCCB] mb-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#282321]/70">
                    <span>Search Results</span>
                    <span className="text-[#641E32] font-bold">{searchResults.length} matches</span>
                  </div>

                  <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-1.5">
                    {searchResults.length === 0 ? (
                      <p className="text-xs text-[#282321]/60 text-center py-4">No outfits match "{searchQuery}"</p>
                    ) : (
                      searchResults.map((item) => (
                        <div
                          key={item._id || item.id}
                          onClick={() => {
                            if (onSelectProduct) onSelectProduct(item);
                            setIsSearchExpanded(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#E8DCCB]/50 cursor-pointer transition-colors"
                        >
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200'}
                            alt=""
                            className="w-9 h-11 sm:w-10 sm:h-12 rounded-lg object-cover border border-[#E8DCCB]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-cinzel text-xs font-semibold text-[#641E32] truncate">{item.title}</p>
                            <p className="text-[10.5px] font-medium text-[#282321]/75 mt-0.5">Rs. {(Number(item.price) * 100).toLocaleString()} • {item.categoryLabel || item.category}</p>
                          </div>
                          <span className="text-xs text-[#B89B62]">→</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. WISHLIST ICON WITH REAL DYNAMIC BADGE (NO DUMMY 1) */}
            <button 
              onClick={() => (onNavigate ? onNavigate('/wishlist') : onOpenWishlist())}
              className={`relative p-2 transition-all duration-200 rounded-full ${
                currentRoute === '/wishlist'
                  ? 'bg-[#641E32] text-[#FAF5EC] shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
              title="Your Wishlist"
              aria-label="Wishlist"
            >
              <HeartIcon className="w-4 h-4" filled={currentRoute === '/wishlist'} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:top-0 sm:right-0 min-w-[16px] h-4 px-1 bg-[#641E32] text-[#FAF5EC] text-[8.5px] sm:text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm animate-reveal-up">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. SHOPPING BAG ICON WITH REAL DYNAMIC BADGE (NO DUMMY 1) */}
            <button 
              onClick={() => (onNavigate ? onNavigate('/cart') : onOpenCart())}
              className={`relative p-2 transition-all duration-200 rounded-full ${
                currentRoute === '/cart'
                  ? 'bg-[#641E32] text-[#FAF5EC] shadow-sm'
                  : (isScrolled 
                      ? 'text-[#282321] hover:bg-[#641E32] hover:text-[#FAF5EC]' 
                      : 'text-[#FAF5EC] hover:bg-[#641E32] hover:text-[#FAF5EC]')
              }`}
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:top-0 sm:right-0 min-w-[16px] h-4 px-1 bg-[#641E32] text-[#FAF5EC] text-[8.5px] sm:text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm animate-reveal-up">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </nav>

      {/* ======================================================== */}
      {/* MOBILE SLIDE-OVER MENU                                  */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#282321]/70 backdrop-blur-sm transition-opacity" 
          />
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-[#FAF5EC] text-[#282321] shadow-2xl z-50 flex flex-col justify-between overflow-y-auto p-5 sm:p-6 border-r border-[#E8DCCB]">
            <div>
              {/* Drawer Header with Logo */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E8DCCB]">
                <div 
                  onClick={handleLogoClick}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <img 
                    src="/logo.png" 
                    alt="Umi'z World Logo" 
                    onError={(e) => {
                      if (e.target.src.indexOf('Logo.jpeg') === -1) {
                        e.target.src = '/Logo.jpeg';
                      }
                    }}
                    className="h-10 w-10 rounded-xl object-contain border border-[#B89B62]/60 shadow-sm"
                  />
                  <div>
                    <h3 className="font-cinzel text-base font-bold tracking-wider text-[#641E32]">UMI&apos;Z WORLD</h3>
                    <p className="text-[8.5px] uppercase tracking-[0.24em] text-[#B89B62]">Umiz World Collection</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#282321]/60 hover:text-[#641E32] rounded-full focus:outline-none"
                  aria-label="Close menu"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1.5 mt-5">
                
                {/* Home */}
                <button
                  onClick={() => handleLinkClick('/')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    isHomeActive ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span>Home</span>
                  {isHomeActive && <span className="text-[10px]">●</span>}
                </button>

                {/* New Arrivals */}
                <button
                  onClick={() => handleLinkClick('/new-arrivals')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    isNewArrivalsActive ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span>New Arrivals</span>
                  {isNewArrivalsActive && <span className="text-[10px]">●</span>}
                </button>

                {/* Categories with Accordion */}
                <div>
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                      isCategoriesActive ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                    }`}
                  >
                    <span>Categories</span>
                    <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${mobileCategoriesOpen ? 'rotate-180 text-[#B89B62]' : ''}`} />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="ml-3 pl-3 border-l-2 border-[#E8DCCB] space-y-1 py-1.5 mt-1">
                      {dropdownItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleLinkClick(item.route || '/categories', item.id)}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-[#282321] hover:bg-[#E8DCCB]/50 hover:text-[#641E32] font-medium block"
                        >
                          • {item.title}
                        </button>
                      ))}
                      <button
                        onClick={() => handleLinkClick('/categories')}
                        className="w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold text-[#641E32] hover:underline block pt-1"
                      >
                        → View All Collections
                      </button>
                    </div>
                  )}
                </div>

                {/* Sales */}
                <button
                  onClick={() => handleLinkClick('/sales')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    isSalesActive ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span>Sales</span>
                  {isSalesActive && <span className="text-[10px]">●</span>}
                </button>

                {/* About */}
                <button
                  onClick={() => handleLinkClick('/about')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    isAboutActive ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span>About</span>
                  {isAboutActive && <span className="text-[10px]">●</span>}
                </button>

                {/* Contact */}
                <button
                  onClick={() => handleLinkClick('/contact')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    isContactActive ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span>Contact</span>
                  {isContactActive && <span className="text-[10px]">●</span>}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => handleLinkClick('/wishlist')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    currentRoute === '/wishlist' ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <HeartIcon className="w-3.5 h-3.5 text-[#641E32]" />
                    <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
                  </span>
                  {currentRoute === '/wishlist' && <span className="text-[10px]">●</span>}
                </button>

                {/* Shopping Bag / Cart */}
                <button
                  onClick={() => handleLinkClick('/cart')}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-between transition-colors ${
                    currentRoute === '/cart' ? 'bg-[#641E32] text-[#FAF5EC]' : 'text-[#282321] hover:bg-[#E8DCCB]/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-3.5 h-3.5 text-[#641E32]" />
                    <span>Shopping Bag {cartCount > 0 ? `(${cartCount})` : ''}</span>
                  </span>
                  {currentRoute === '/cart' && <span className="text-[10px]">●</span>}
                </button>

              </div>
            </div>

            <div className="pt-5 border-t border-[#E8DCCB] text-xs text-[#282321]/75 space-y-1">
              <p className="font-cinzel font-semibold text-[#641E32]">Umi&apos;z World Atelier</p>
              <p className="text-[10.5px]">
                Celebrating Pakistani Fashion, One Beautiful Detail at a Time.
              </p>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
