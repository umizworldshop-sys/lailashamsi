import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  startTransition,
  Suspense,
  lazy
} from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ValueProps from './components/ValueProps';
import Categories from './components/Categories';
import ProductSection from './components/ProductSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import HomeSalesSection from './components/HomeSalesSection';

import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import CheckoutPage from './components/CheckoutPage';

import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';

import { PRODUCTS } from './data/products';
import { SparklesIcon, WhatsAppIcon } from './components/Icons';
import { fetchProducts, fetchSiteSettings } from './services/api';

// Code-split secondary routes & admin portal for instant load under 1,000+ concurrent users
const CategoriesPage = lazy(() => import('./components/CategoriesPage'));
const SalesPage = lazy(() => import('./components/SalesPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const NewArrivalsPage = lazy(() => import('./components/NewArrivalsPage'));
const StitchedPage = lazy(() => import('./components/StitchedPage'));
const UnstitchedPage = lazy(() => import('./components/UnstitchedPage'));
const BabyClothesPage = lazy(() => import('./components/BabyClothesPage'));
const QuickViewPage = lazy(() => import('./components/quickview/QuickViewPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

export default function App() {
  const [products, setProducts] = useState(PRODUCTS);
  const [siteSettings, setSiteSettings] = useState({
    saleDiscountPercent: 30,
    marqueeItems: [
      '✨ Umiz World Collection ✨',
      'Discover Timeless Pakistani Elegance',
      'Cash on Delivery Across Pakistan',
      '100% Authentic Handcrafted Pure Fabrics',
      'Express Nationwide Delivery',
      'WhatsApp Support: 03174341036'
    ],
    heroSlides: []
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency] = useState('PKR');

  // -----------------------------------------------------------
  // URL ROUTING & NAVIGATION (Supports /, /new-arrivals, /categories, /stitched, /unstitched, /baby-clothes, /sales, /about, /contact, /cart, /wishlist, /checkout)
  // -----------------------------------------------------------
  const [currentRoute, setCurrentRoute] = useState(() => {
    try {
      const redirected = sessionStorage.getItem('laila_spa_redirect');
      if (redirected) {
        sessionStorage.removeItem('laila_spa_redirect');
        window.history.replaceState({}, '', redirected);
        const redirectPath = redirected.toLowerCase();
        if (redirectPath.startsWith('/quick-view') || redirectPath.startsWith('/quickview') || redirectPath.startsWith('/product/')) return '/quick-view';
        if (redirectPath.startsWith('/new-arrivals') || redirectPath.startsWith('/newarrivals')) return '/new-arrivals';
        if (redirectPath.startsWith('/categories')) return '/categories';
        if (redirectPath.startsWith('/stitched') || redirectPath.startsWith('/stitch')) return '/stitched';
        if (redirectPath.startsWith('/unstitched')) return '/unstitched';
        if (redirectPath.startsWith('/baby-clothes') || redirectPath.startsWith('/babies') || redirectPath.startsWith('/kids') || redirectPath.startsWith('/baby')) return '/baby-clothes';
        if (redirectPath.startsWith('/sales') || redirectPath.startsWith('/sale')) return '/sales';
        if (redirectPath.startsWith('/about')) return '/about';
        if (redirectPath.startsWith('/contact')) return '/contact';
        if (redirectPath.startsWith('/cart')) return '/cart';
        if (redirectPath.startsWith('/wishlist')) return '/wishlist';
        if (redirectPath.startsWith('/checkout')) return '/checkout';
      }
    } catch {}
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/quick-view') || path.startsWith('/quickview') || path.startsWith('/product/')) return '/quick-view';
    if (path === '/new-arrivals' || path === '/newarrivals') return '/new-arrivals';
    if (path === '/categories') return '/categories';
    if (path === '/stitched' || path === '/stitch') return '/stitched';
    if (path === '/unstitched') return '/unstitched';
    if (path === '/baby-clothes' || path === '/babies' || path === '/kids' || path === '/baby') return '/baby-clothes';
    if (path === '/sales' || path === '/sale') return '/sales';
    if (path === '/about') return '/about';
    if (path === '/contact') return '/contact';
    if (path === '/cart') return '/cart';
    if (path === '/wishlist') return '/wishlist';
    if (path === '/checkout') return '/checkout';
    return '/'; // Clean Home root route
  });
  const [currentSubFilter, setCurrentSubFilter] = useState('all');
  const [previousRoute, setPreviousRoute] = useState('/');

  // Dedicated Quick View Page state (No Popup; navigates to /quick-view/:id)
  const [quickViewProduct, setQuickViewProduct] = useState(() => {
    try {
      const path = window.location.pathname;
      const match = path.match(/^\/(?:quick-view|quickview|product)\/([^/]+)/i);
      if (match && match[1]) {
        const pid = decodeURIComponent(match[1]);
        const found = PRODUCTS.find((p) => String(p.id) === String(pid));
        if (found) return found;
      }
      const saved = sessionStorage.getItem('laila_quickview_product');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PRODUCTS[0] || null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const navigateTo = useCallback((route, subFilter = null) => {
    startTransition(() => {
      setCurrentRoute(route);
      if (subFilter) {
        setCurrentSubFilter(subFilter);
      }
    });
    window.history.pushState({}, '', route);

    // Always start fresh from top instantly on route change to prevent jarring bottom-to-top scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (route === '/new-arrivals') {
      document.title = "New Arrivals | UMI'Z WORLD Haute Couture";
    } else if (route === '/quick-view') {
      document.title = "Product Quick View | UMI'Z WORLD Haute Couture";
    } else if (route === '/categories') {
      document.title = "Categories | UMI'Z WORLD Haute Couture";
    } else if (route === '/stitched') {
      document.title = "Stitched & Ready to Wear | UMI'Z WORLD Haute Couture";
    } else if (route === '/unstitched') {
      document.title = "Unstitched Luxury Suits | UMI'Z WORLD Haute Couture";
    } else if (route === '/baby-clothes') {
      document.title = "Baby & Kids Eastern Wear | UMI'Z WORLD";
    } else if (route === '/sales') {
      document.title = "Seasonal Archive Sale | UMI'Z WORLD";
    } else if (route === '/about') {
      document.title = "Atelier Heritage & Craft | UMI'Z WORLD";
    } else if (route === '/contact') {
      document.title = "Private Appointments & Contact | UMI'Z WORLD";
    } else if (route === '/cart') {
      document.title = "Shopping Bag | UMI'Z WORLD Haute Couture";
    } else if (route === '/wishlist') {
      document.title = "Saved Wishlist | UMI'Z WORLD Haute Couture";
    } else if (route === '/checkout') {
      document.title = "Express Checkout | UMI'Z WORLD Haute Couture";
    } else {
      document.title = "UMI'Z WORLD | Luxury Pret & Couture For Women";
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/quick-view') || path.startsWith('/quickview') || path.startsWith('/product/')) setCurrentRoute('/quick-view');
      else if (path === '/new-arrivals' || path === '/newarrivals') setCurrentRoute('/new-arrivals');
      else if (path === '/categories') setCurrentRoute('/categories');
      else if (path === '/stitched' || path === '/stitch') setCurrentRoute('/stitched');
      else if (path === '/unstitched') setCurrentRoute('/unstitched');
      else if (path === '/baby-clothes' || path === '/babies' || path === '/kids' || path === '/baby') setCurrentRoute('/baby-clothes');
      else if (path === '/sales' || path === '/sale') setCurrentRoute('/sales');
      else if (path === '/about') setCurrentRoute('/about');
      else if (path === '/contact') setCurrentRoute('/contact');
      else if (path === '/cart') setCurrentRoute('/cart');
      else if (path === '/wishlist') setCurrentRoute('/wishlist');
      else if (path === '/checkout') setCurrentRoute('/checkout');
      else setCurrentRoute('/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real functional Cart state (starts empty [] with NO dummy data, persists real additions)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('laila_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync real cart modifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('laila_cart', JSON.stringify(cartItems));
    } catch (err) {
      void err;
    }
  }, [cartItems]);

  // Load dynamic catalog from MongoDB backend & sync cart items with backend product details
  const loadProducts = useCallback(async () => {
    try {
      const res = await fetchProducts();
      if (res && res.products && res.products.length > 0) {
        const backendList = res.products.map((p, idx) => {
          const rawPrice = Number(p.price) || 0;
          // Scale price: if stored in PKR >= 1000, convert to base unit so CURRENCY_RATES.PKR.rate (100) displays exact PKR
          const displayPrice = rawPrice >= 1000 ? Math.round(rawPrice / 100) : rawPrice;
          const rawOrig = p.originalPrice ? Number(p.originalPrice) : null;
          const displayOrig = rawOrig && rawOrig >= 1000 ? Math.round(rawOrig / 100) : rawOrig;
          const primaryImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.image || '/Logo.jpeg');

          return {
            ...p,
            id: p._id || p.id || idx + 1,
            price: displayPrice,
            originalPrice: displayOrig,
            rawPkrPrice: rawPrice,
            image: primaryImg,
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [primaryImg],
            category: p.category || 'female',
            categoryLabel: p.categoryLabel || 'Female (Women Wear)'
          };
        });
        setProducts(backendList);

        // Sync active QuickView product if user landed directly on /quick-view/:id
        const pathMatch = window.location.pathname.match(/^\/(?:quick-view|quickview|product)\/([^/]+)/i);
        if (pathMatch && pathMatch[1]) {
          const targetId = decodeURIComponent(pathMatch[1]);
          const matchedQuick = backendList.find(
            (p) => String(p.id) === String(targetId) || String(p._id) === String(targetId)
          );
          if (matchedQuick) {
            setQuickViewProduct(matchedQuick);
          }
        }

        // Sync cart items with authoritative backend product details
        setCartItems((prevCart) =>
          prevCart.map((cartItem) => {
            const matched = backendList.find(
              (p) =>
                (p.id !== undefined && String(p.id) === String(cartItem.id)) ||
                (p._id !== undefined && String(p._id) === String(cartItem._id || cartItem.id)) ||
                (p.title && cartItem.title && p.title.toLowerCase() === cartItem.title.toLowerCase())
            );
            if (!matched) return cartItem;
            return {
              ...matched,
              ...cartItem,
              id: matched.id || matched._id || cartItem.id,
              productId: String(matched._id || matched.id || cartItem.id),
              title: matched.title,
              category: matched.category,
              categoryLabel: matched.categoryLabel,
              fabric: matched.fabric,
              pieces: matched.pieces,
              description: matched.description,
              price: Number(matched.price),
              originalPrice: Number(matched.originalPrice || matched.price),
              images: matched.images?.length ? matched.images : cartItem.images,
              sizes: matched.sizes?.length ? matched.sizes : cartItem.sizes,
              colors: matched.colors?.length ? matched.colors : cartItem.colors,
              stock: matched.stock ?? cartItem.stock
            };
          })
        );
      }
    } catch (err) {
      console.warn('Using fallback catalog data:', err.message);
    }
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Concurrent zero-wait catalog & settings initialization
    loadProducts();
    fetchSiteSettings()
      .then((res) => {
        if (res && res.settings) {
          setSiteSettings(res.settings);
        }
      })
      .catch(() => {});
  }, [loadProducts]);

  const handleCloseAdmin = useCallback(() => {
    setIsAdminOpen(false);
    sessionStorage.removeItem('ls_admin_token');
    localStorage.removeItem('ls_admin_token');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Real functional Wishlist state (starts empty [] with NO dummy data, persists real additions)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('laila_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync real wishlist modifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('laila_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      void err;
    }
  }, [wishlist]);

  // Open Quick View on its own dedicated page route (/quick-view/:id) instead of a modal popup
  const handleOpenQuickView = (product) => {
    if (!product) return;
    setQuickViewProduct(product);
    try {
      sessionStorage.setItem('laila_quickview_product', JSON.stringify(product));
    } catch {
      // ignore
    }
    if (currentRoute !== '/quick-view') {
      setPreviousRoute(currentRoute);
    }
    const pid = product.id || product._id || '';
    startTransition(() => {
      setCurrentRoute('/quick-view');
    });
    window.history.pushState({}, '', pid ? `/quick-view/${pid}` : '/quick-view');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = `${product.title} | LAILA SHAMSI Haute Couture`;
  };

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Add to Cart handler (Always enriches from live backend products array)
  const handleAddToCart = useCallback(
    (newItem) => {
      const backendProduct = products.find(
        (p) =>
          (p.id !== undefined && String(p.id) === String(newItem.id)) ||
          (p._id !== undefined && String(p._id) === String(newItem._id || newItem.id)) ||
          (p.title && newItem.title && p.title.toLowerCase() === newItem.title.toLowerCase())
      );

      const enrichedNewItem = backendProduct
        ? {
            ...backendProduct,
            ...newItem,
            id: backendProduct.id || backendProduct._id || newItem.id,
            productId: String(backendProduct._id || backendProduct.id || newItem.id),
            title: backendProduct.title,
            category: backendProduct.category,
            categoryLabel: backendProduct.categoryLabel,
            fabric: backendProduct.fabric,
            pieces: backendProduct.pieces,
            description: backendProduct.description,
            price: Number(backendProduct.price),
            originalPrice: Number(backendProduct.originalPrice || backendProduct.price),
            images: backendProduct.images?.length ? backendProduct.images : newItem.images,
            sizes: backendProduct.sizes?.length ? backendProduct.sizes : newItem.sizes,
            colors: backendProduct.colors?.length ? backendProduct.colors : newItem.colors,
            stock: backendProduct.stock ?? newItem.stock
          }
        : newItem;

      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) =>
            item.id === enrichedNewItem.id &&
            item.selectedSize === enrichedNewItem.selectedSize &&
            item.selectedColor?.name === enrichedNewItem.selectedColor?.name
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + (enrichedNewItem.quantity || 1)
          };
          return updated;
        } else {
          return [...prevItems, { ...enrichedNewItem, quantity: enrichedNewItem.quantity || 1 }];
        }
      });

      showToast(`Added "${enrichedNewItem.title}" (${enrichedNewItem.selectedSize}) to Bag!`);
    },
    [products, showToast]
  );

  // Update quantity in Cart / Checkout
  const handleUpdateQuantity = useCallback((targetItem, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.id === targetItem.id &&
          item.selectedSize === targetItem.selectedSize &&
          item.selectedColor?.name === targetItem.selectedColor?.name
        ) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }, []);

  // Update size or color directly on Checkout page
  const handleUpdateItemVariant = useCallback((targetItem, { selectedSize, selectedColor }) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.id === targetItem.id &&
          item.selectedSize === targetItem.selectedSize &&
          item.selectedColor?.name === targetItem.selectedColor?.name
        ) {
          return {
            ...item,
            selectedSize: selectedSize || item.selectedSize,
            selectedColor: selectedColor || item.selectedColor
          };
        }
        return item;
      })
    );
  }, []);

  // Remove item from Cart / Checkout
  const handleRemoveFromCart = useCallback(
    (targetItem) => {
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.id === targetItem.id &&
              item.selectedSize === targetItem.selectedSize &&
              item.selectedColor?.name === targetItem.selectedColor?.name
            )
        )
      );
      showToast('Removed from Bag');
    },
    [showToast]
  );

  // Toggle Wishlist
  const handleToggleWishlist = useCallback(
    (productId) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          showToast('Removed from Wishlist');
          return prev.filter((id) => id !== productId);
        } else {
          showToast('Added to Wishlist ❤️');
          return [...prev, productId];
        }
      });
    },
    [showToast]
  );

  // Navigate to dedicated /checkout route (No Popup)
  const handleProceedToCheckout = useCallback(
    (data = null) => {
      setIsCartOpen(false);
      if (data) {
        setCheckoutData(data);
      }
      navigateTo('/checkout');
    },
    [navigateTo]
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EC] text-[#282321] font-body selection:bg-[#641E32] selection:text-[#FAF5EC]">
      {/* High-Visibility Toast Notification (Always clearly visible & never hidden by navbar) */}
      {toast && (
        <div className="fixed top-28 sm:top-32 right-4 sm:right-8 z-[99999] max-w-[calc(100vw-32px)] sm:max-w-md flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#282321] text-[#FAF5EC] shadow-[0_12px_40px_rgba(0,0,0,0.45)] border-2 border-[#B89B62] animate-reveal-up text-xs sm:text-[13px] font-semibold tracking-wide backdrop-blur-md">
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B62] flex-shrink-0 animate-pulse" />
          <span className="flex-1 leading-snug">{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-[#FAF5EC]/60 hover:text-[#FAF5EC] text-xs p-1 ml-1 cursor-pointer transition-colors"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Glassmorphic Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => navigateTo('/cart')}
        onOpenWishlist={() => navigateTo('/wishlist')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        products={products}
        onSelectProduct={handleOpenQuickView}
        marqueeItems={siteSettings?.marqueeItems}
      />

      <main className="flex-1">
        {/* VIEW 1: HOME STOREFRONT */}
        {currentRoute === '/' && (
          <>
            {/* 1. Hero Section */}
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onLookbookClick={() => navigateTo('/new-arrivals')}
              customSlides={siteSettings?.heroSlides}
            />

            {/* 2. Categories Section (Directly under Hero) */}
            <Categories
              activeCategory={activeCategory}
              onSelectCategory={(catId) => {
                setActiveCategory(catId);
                setSearchQuery('');
                if (catId === 'stitched') navigateTo('/stitched');
                else if (catId === 'unstitched') navigateTo('/unstitched');
                else if (catId === 'babies') navigateTo('/baby-clothes');
                else navigateTo('/categories', catId);
              }}
              onExploreAll={() => navigateTo('/categories')}
            />

            {/* 3. New Arrivals Collection Section */}
            <ProductSection
              products={products}
              activeCategory="all"
              title="New Arrivals"
              maxProducts={5}
              onExploreAll={() => navigateTo('/new-arrivals')}
              onSelectCategory={(catId) => {
                setActiveCategory(catId);
                setSearchQuery('');
              }}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />

            {/* 4. Sales Section with Garment Cards & Explore All Sales Button */}
            <HomeSalesSection
              products={products}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
              onExploreAll={() => navigateTo('/sales')}
              saleDiscountPercent={siteSettings?.saleDiscountPercent}
            />

            {/* 5. Brand Heritage Value Props */}
            <ValueProps />

            {/* 6. Client Reviews Section */}
            <ReviewsSection />
          </>
        )}

        {/* Suspense wrapper for lazy-loaded routes */}
        <Suspense
          fallback={
            <div className="pt-40 pb-24 text-center text-xs uppercase tracking-[0.2em] text-[#641E32] font-semibold">
              Loading Atelier Collection...
            </div>
          }
        >
          {/* DEDICATED PRODUCT QUICK VIEW PAGE (/quick-view/:id) */}
          {currentRoute === '/quick-view' && (
            <QuickViewPage
              product={quickViewProduct}
              products={products}
              onBack={() => navigateTo(previousRoute || '/')}
              onNavigate={navigateTo}
              onSelectProduct={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              onProceedToCheckout={handleProceedToCheckout}
              isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
            />
          )}

          {/* VIEW 2: DEDICATED NEW ARRIVALS */}
          {currentRoute === '/new-arrivals' && (
            <NewArrivalsPage
              products={products}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
            />
          )}

          {/* VIEW 3: CATEGORIES */}
          {currentRoute === '/categories' && (
            <CategoriesPage
              products={products}
              subFilter={currentSubFilter}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
            />
          )}

          {/* VIEW 4: DEDICATED STITCHED (READY TO WEAR) */}
          {currentRoute === '/stitched' && (
            <StitchedPage
              products={products}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
            />
          )}

          {/* VIEW 5: DEDICATED UNSTITCHED SUITS */}
          {currentRoute === '/unstitched' && (
            <UnstitchedPage
              products={products}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
            />
          )}

          {/* VIEW 6: DEDICATED BABY & KIDS CLOTHES */}
          {currentRoute === '/baby-clothes' && (
            <BabyClothesPage
              products={products}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
            />
          )}

          {/* VIEW 7: SALES */}
          {currentRoute === '/sales' && (
            <SalesPage
              products={products}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedCurrency={selectedCurrency}
              saleDiscountPercent={siteSettings?.saleDiscountPercent}
            />
          )}

          {/* VIEW 5: ABOUT */}
          {currentRoute === '/about' && (
            <AboutPage onExploreCollection={() => navigateTo('/')} />
          )}

          {/* VIEW 6: CONTACT */}
          {currentRoute === '/contact' && (
            <ContactPage onShowToast={showToast} initialCategory={currentSubFilter} />
          )}
        </Suspense>

        {/* VIEW 7: SHOPPING BAG / CART */}
        {currentRoute === '/cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={handleProceedToCheckout}
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            products={products}
            selectedCurrency={selectedCurrency}
            onNavigate={navigateTo}
          />
        )}

        {/* VIEW 8: WISHLIST */}
        {currentRoute === '/wishlist' && (
          <WishlistPage
            wishlist={wishlist}
            products={products}
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            selectedCurrency={selectedCurrency}
            onNavigate={navigateTo}
          />
        )}

        {/* VIEW 9: DEDICATED SINGLE-PAGE CHECKOUT ROUTER (/checkout) */}
        {currentRoute === '/checkout' && (
          <CheckoutPage
            items={cartItems}
            products={products}
            initialCheckoutData={checkoutData}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateItemVariant={handleUpdateItemVariant}
            onRemoveItem={handleRemoveFromCart}
            onOrderSuccess={() => {
              setCartItems([]);
              setCheckoutData(null);
            }}
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            selectedCurrency={selectedCurrency}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Minimalist Dark Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={navigateTo}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setSearchQuery('');
          navigateTo('/categories', catId);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        selectedCurrency={selectedCurrency}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
        selectedCurrency={selectedCurrency}
      />

      {/* Executive Atelier Admin Portal */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={handleCloseAdmin}
            onProductsUpdated={loadProducts}
            siteSettings={siteSettings}
            onSettingsUpdated={(updated) => setSiteSettings(updated)}
          />
        </Suspense>
      )}

      {/* Floating WhatsApp Quick Connect Button (Only visible on customer storefront, hidden in Admin) */}
      {!isAdminOpen && (
        <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50 flex items-center group">
          <span 
            role="tooltip"
            className="absolute right-full mr-3 px-3.5 py-1.5 rounded-xl bg-[#282321] text-[#FAF5EC] text-xs font-medium tracking-wide border border-[#B89B62]/40 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap translate-x-2 group-hover:translate-x-0"
          >
            Connect Us
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-y-transparent border-l-[6px] border-l-[#282321]" />
          </span>
          <a
            href="https://wa.me/923174341036?text=Hello%20Laila%20Shamsi%20Atelier!"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
            aria-label="Connect Us on WhatsApp"
          >
            <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
          </a>
        </aside>
      )}
    </div>
  );
}
