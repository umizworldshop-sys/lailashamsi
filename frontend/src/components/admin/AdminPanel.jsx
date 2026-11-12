import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SparklesIcon, 
  DashboardIcon, 
  PackageIcon, 
  ReceiptIcon, 
  MailIcon, 
  SlidersIcon 
} from '../Icons';
import AdminAuthModal from './AdminAuthModal';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminStoreSettings from './AdminStoreSettings';
import AdminProductModal from './AdminProductModal';
import AdminOrderDetailsModal from './AdminOrderDetailsModal';
import AdminMessages from './AdminMessages';
import {
  getAdminProfile,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageFile,
  fetchOrders,
  updateOrderStatus,
  fetchSiteSettings,
  updateSiteSettings,
  fetchAdminMessages,
  updateMessageStatus,
  toggleStarMessage,
  deleteMessage
} from '../../services/api';

const STOREFRONT_CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'female', label: 'Female (Women Wear)' },
  { id: 'babies', label: 'Kids Collection' },
  { id: 'unstitched', label: 'Unstitched Suits' },
  { id: 'stitched', label: 'Stitched (Ready to Wear)' }
];

export default function AdminPanel({
  isOpen,
  onClose,
  onProductsUpdated,
  siteSettings,
  onSettingsUpdated
}) {
  // View mode: 'auth' | 'dashboard'
  const [view, setView] = useState('auth');
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState('grid');

  // Auth credentials (always starts fresh for login)
  const [token, setToken] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  // Data states
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [localSettings, setLocalSettings] = useState(siteSettings || null);
  const [dataLoading, setDataLoading] = useState(false);

  // Filters & Search
  const [globalSearch, setGlobalSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Form State
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'female',
    categoryLabel: 'Female (Women Wear)',
    price: '',
    originalPrice: '',
    fabric: '',
    pieces: '3 Piece',
    tag: 'Bestseller',
    description: '',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Standard', hex: '#641E32' }],
    images: ['']
  });
  const [productFormError, setProductFormError] = useState('');
  const [productSaving, setProductSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Toast feedback
  const [panelToast, setPanelToast] = useState('');
  const showToast = (msg) => {
    setPanelToast(msg);
    setTimeout(() => setPanelToast(''), 3200);
  };

  // Load Dashboard Data
  const loadDashboardData = useCallback(async (activeToken = token) => {
    if (!activeToken) return;
    setDataLoading(true);
    try {
      const [productsRes, ordersRes, settingsRes, messagesRes] = await Promise.all([
        fetchProducts().catch(() => ({ products: [] })),
        fetchOrders(activeToken).catch(() => ({ orders: [] })),
        fetchSiteSettings().catch(() => ({ settings: null })),
        fetchAdminMessages(activeToken).catch(() => ({ messages: [] }))
      ]);

      if (productsRes && productsRes.products) setProductsList(productsRes.products);
      if (ordersRes && ordersRes.orders) setOrdersList(ordersRes.orders);
      if (settingsRes && settingsRes.settings) setLocalSettings(settingsRes.settings);
      if (messagesRes && messagesRes.messages) setMessagesList(messagesRes.messages);
    } catch (err) {
      console.warn('Dashboard data loading error:', err);
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  // Handle open/close state transitions & background scroll lock
  useEffect(() => {
    if (!isOpen) {
      // When admin panel is closed, auto-logout and reset state for next time
      setToken('');
      setAdminUser(null);
      setView('auth');
      sessionStorage.removeItem('ls_admin_token');
      localStorage.removeItem('ls_admin_token');
      return;
    }

    // Prevent background scrolling while admin modal is active
    document.documentElement.classList.add('admin-modal-open');
    document.body.classList.add('admin-modal-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.classList.remove('admin-modal-open');
      document.body.classList.remove('admin-modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Auth Success Callback (invoked on successful login or register)
  const handleAuthSuccess = ({ token: newToken, admin: newAdmin }) => {
    sessionStorage.setItem('ls_admin_token', newToken);
    localStorage.removeItem('ls_admin_token');
    setToken(newToken);
    setAdminUser(newAdmin);
    setView('dashboard');
    showToast(`Welcome back, ${newAdmin.name}!`);
    loadDashboardData(newToken);
  };

  // Explicit Logout
  const handleLogout = () => {
    sessionStorage.removeItem('ls_admin_token');
    localStorage.removeItem('ls_admin_token');
    setToken('');
    setAdminUser(null);
    setView('auth');
    showToast('Logged out successfully.');
  };

  // Exit & Scroll to top (automatically logs out as requested)
  const handleClose = () => {
    handleLogout();
    onClose();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Product Operations
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      category: 'female',
      categoryLabel: 'Female (Women Wear)',
      price: '',
      originalPrice: '',
      fabric: '',
      pieces: '3 Piece',
      tag: 'New Arrival',
      description: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Standard', hex: '#641E32' }],
      images: [],
      isNewArrival: true,
      isOnSale: false,
      isTrending: false
    });
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id || product.id);
    const catId = product.category || 'female';
    const catObj = STOREFRONT_CATEGORIES.find(c => c.id === catId);
    const realPrice = product.price < 1000 ? product.price * 100 : product.price;
    const realOrig = product.originalPrice ? (product.originalPrice < 1000 ? product.originalPrice * 100 : product.originalPrice) : '';

    setProductForm({
      title: product.title || '',
      category: catId,
      categoryLabel: catObj ? catObj.label : (product.categoryLabel || 'Female (Women Wear)'),
      price: realPrice,
      originalPrice: realOrig,
      fabric: product.fabric || '',
      pieces: product.pieces || '3 Piece',
      tag: product.tag || '',
      description: product.description || '',
      sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL'],
      colors: product.colors || [{ name: 'Standard', hex: '#641E32' }],
      images: Array.isArray(product.images) && product.images.filter(Boolean).length > 0
        ? product.images.filter(Boolean)
        : (product.image ? [product.image] : []),
      isNewArrival: product.isNewArrival !== undefined ? Boolean(product.isNewArrival) : true,
      isOnSale: product.isOnSale !== undefined ? Boolean(product.isOnSale) : Boolean(product.originalPrice && Number(product.originalPrice) > Number(product.price)),
      isTrending: product.isTrending !== undefined ? Boolean(product.isTrending) : false
    });
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductFormError('');
    setProductSaving(true);

    try {
      const validImages = (productForm.images || []).map(img => (img || '').trim()).filter(Boolean);
      if (validImages.length === 0) {
        setProductFormError('Please upload at least one product photo from your device before saving.');
        setProductSaving(false);
        return;
      }

      const numOrig = productForm.originalPrice ? Number(productForm.originalPrice) : null;
      const numPrice = Number(productForm.price);
      const isSale = Boolean((numOrig && numOrig > numPrice) || productForm.isOnSale);
      const computedDiscount = (numOrig && numOrig > numPrice)
        ? Math.round(((numOrig - numPrice) / numOrig) * 100)
        : (isSale && productForm.discountPercent ? Number(productForm.discountPercent) : 0);

      const payload = {
        title: productForm.title.trim(),
        category: productForm.category,
        categoryLabel: productForm.categoryLabel,
        price: numPrice,
        originalPrice: numOrig || undefined,
        discountPercent: computedDiscount,
        fabric: productForm.fabric.trim(),
        pieces: productForm.pieces.trim(),
        tag: productForm.tag.trim() || (isSale ? `${computedDiscount}% OFF` : 'New Arrival'),
        description: productForm.description.trim(),
        sizes: productForm.sizes,
        colors: productForm.colors,
        images: validImages,
        image: validImages[0],
        isNewArrival: isSale ? false : Boolean(productForm.isNewArrival),
        isOnSale: isSale,
        isTrending: Boolean(productForm.isTrending)
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload, token);
        showToast('Product updated successfully!');
      } else {
        await createProduct(payload, token);
        showToast('Product created successfully!');
      }

      setIsProductModalOpen(false);
      loadDashboardData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      setProductFormError(err.message || 'Error saving product');
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(productId, token);
      showToast('Product deleted successfully');
      loadDashboardData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleImageFileUpload = async (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    // Strict 1 MB per image limit
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
    const oversizedFiles = fileList.filter(f => f.size > MAX_SIZE_BYTES);

    if (oversizedFiles.length > 0) {
      const details = oversizedFiles
        .map(f => `"${f.name}" (${(f.size / (1024 * 1024)).toFixed(2)} MB)`)
        .join(', ');
      setProductFormError(`Image size limit is 1 MB. The following photo(s) exceed 1 MB: ${details}. Please select or compress images under 1 MB.`);
      if (e.target) e.target.value = '';
      return;
    }

    setProductFormError('');
    setUploadingImage(true);

    // Helper to read file as base64 Data URL
    const readFileAsDataUrl = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(f);
      });

    try {
      const uploadedUrls = [];

      for (const file of fileList) {
        try {
          const uploadRes = await uploadImageFile(file, token);
          if (uploadRes && uploadRes.imageUrl) {
            uploadedUrls.push(uploadRes.imageUrl);
          } else {
            const localDataUrl = await readFileAsDataUrl(file);
            uploadedUrls.push(localDataUrl);
          }
        } catch {
          // Fallback to base64 so POST /api/products or PUT /api/products/:id uploads it to Cloudinary on save
          const localDataUrl = await readFileAsDataUrl(file);
          uploadedUrls.push(localDataUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setProductForm(prev => {
          const existingValid = (prev.images || []).map(img => (img || '').trim()).filter(Boolean);
          return {
            ...prev,
            images: [...existingValid, ...uploadedUrls]
          };
        });
        showToast(
          uploadedUrls.length === 1
            ? 'Photo uploaded to Cloudinary!'
            : `${uploadedUrls.length} photos uploaded to Cloudinary!`
        );
      }
    } catch (err) {
      setProductFormError(err.message || 'Failed to attach images');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Order Operations
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, token);
      showToast(`Order status updated to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Storefront Settings Operations (Sale %, Marquee, Hero Slides)
  const handleSaveStoreSettings = async (newSettingsPayload) => {
    try {
      const res = await updateSiteSettings(newSettingsPayload, token);
      if (res && res.settings) {
        setLocalSettings(res.settings);
        if (onSettingsUpdated) onSettingsUpdated(res.settings);
      }
      showToast('Storefront Banners, Sale % & Marquee updated!');
    } catch (err) {
      showToast('Error saving settings: ' + (err.message || 'Unknown error'));
    }
  };

  // Message Operations
  const handleUpdateMessageStatus = async (id, status) => {
    try {
      await updateMessageStatus(id, status, token);
      setMessagesList(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      showToast(`Inquiry marked as ${status}`);
    } catch (err) {
      showToast(err.message || 'Failed to update message status');
    }
  };

  const handleToggleStarMessage = async (id) => {
    try {
      const res = await toggleStarMessage(id, token);
      const isStarred = res.data?.starred;
      setMessagesList(prev => prev.map(m => m._id === id ? { ...m, starred: isStarred } : m));
      showToast(isStarred ? 'Message starred' : 'Message unstarred');
    } catch (err) {
      showToast(err.message || 'Failed to update message');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      await deleteMessage(id, token);
      setMessagesList(prev => prev.filter(m => m._id !== id));
      showToast('Message deleted successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to delete message');
    }
  };

  const unreadMessagesCount = useMemo(() => {
    return messagesList.filter(m => m.status === 'unread').length;
  }, [messagesList]);

  // Revenue Calculation
  const totalRevenue = useMemo(() => {
    return ordersList.reduce((acc, order) => acc + (order.grandTotal || 0), 0);
  }, [ordersList]);

  if (!isOpen) return null;

  const isAnySubModalOpen = isProductModalOpen || Boolean(selectedOrderDetails);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#070607] text-[#EDE8E3] font-body w-full max-w-full">
      {/* Toast Feedback */}
      {panelToast && (
        <div className="fixed top-5 right-5 z-[70] bg-[#1A181C] text-white px-5 py-3 rounded-2xl border border-[#D4AF37]/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-2.5 text-xs font-semibold animate-reveal-up">
          <SparklesIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>{panelToast}</span>
        </div>
      )}

      {/* VIEW: AUTHENTICATION (Login or Register) */}
      {view === 'auth' ? (
        <AdminAuthModal 
          isOpen={isOpen}
          onClose={handleClose}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : (
        /* VIEW: EXECUTIVE DASHBOARD */
        <div className="w-full h-full flex overflow-hidden">
          {/* Mobile Overlay */}
          {mobileSidebarOpen && (
            <div 
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity cursor-pointer"
            />
          )}

          {/* Desktop & Mobile Responsive Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 md:static md:z-auto transition-transform duration-300 transform ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              productsCount={productsList.length}
              ordersCount={ordersList.length}
              messagesCount={messagesList.length}
              unreadMessagesCount={unreadMessagesCount}
              adminUser={adminUser}
              onClose={handleClose}
              onLogout={handleLogout}
              onCloseDrawer={() => setMobileSidebarOpen(false)}
            />
          </div>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A080D] relative">
            <AdminHeader
              activeTab={activeTab}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              onRefresh={() => loadDashboardData()}
              dataLoading={dataLoading}
              onOpenAddProduct={handleOpenAddProduct}
              onClose={handleClose}
            />

            {/* Scrollable Tab Canvas with safe bottom padding for mobile tab bar */}
            <main className={`flex-1 ${isAnySubModalOpen ? 'overflow-hidden' : 'overflow-y-auto'} admin-scrollbar pb-24 md:pb-8`}>
              {activeTab === 'overview' && (
                <AdminOverview
                  totalRevenue={totalRevenue}
                  ordersList={ordersList}
                  productsList={productsList}
                  messagesList={messagesList}
                  unreadMessagesCount={unreadMessagesCount}
                  onOpenAddProduct={handleOpenAddProduct}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onSelectOrder={(order) => setSelectedOrderDetails(order)}
                />
              )}

              {activeTab === 'products' && (
                <AdminProducts
                  products={productsList}
                  categories={STOREFRONT_CATEGORIES}
                  activeCategory={productCategoryFilter}
                  setActiveCategory={setProductCategoryFilter}
                  catalogSearch={globalSearch}
                  setCatalogSearch={setGlobalSearch}
                  viewMode={catalogViewMode}
                  setViewMode={setCatalogViewMode}
                  onOpenAddModal={handleOpenAddProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === 'orders' && (
                <AdminOrders
                  orders={ordersList}
                  statusFilter={orderStatusFilter}
                  setStatusFilter={setOrderStatusFilter}
                  onStatusChange={handleStatusChange}
                  onSelectOrder={(order) => setSelectedOrderDetails(order)}
                />
              )}

              {activeTab === 'messages' && (
                <AdminMessages
                  messagesList={messagesList}
                  onUpdateStatus={handleUpdateMessageStatus}
                  onToggleStar={handleToggleStarMessage}
                  onDeleteMessage={handleDeleteMessage}
                  dataLoading={dataLoading}
                  showToast={showToast}
                />
              )}

              {activeTab === 'settings' && (
                <AdminStoreSettings
                  siteSettings={localSettings || siteSettings}
                  onSaveSettings={handleSaveStoreSettings}
                  token={token}
                  showToast={showToast}
                />
              )}
            </main>

            {/* Mobile Bottom Navigation Bar (Instant Thumb Tab Switching) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#110E14]/95 backdrop-blur-lg border-t border-[#26202C] px-2 py-1.5 flex items-center justify-around shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
              {[
                { id: 'overview', label: 'Dashboard', icon: DashboardIcon },
                { id: 'products', label: 'Products', icon: PackageIcon, badge: productsList.length },
                { id: 'orders', label: 'Orders', icon: ReceiptIcon, badge: ordersList.length },
                { 
                  id: 'messages', 
                  label: 'Messages', 
                  icon: MailIcon, 
                  badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
                  isUnread: unreadMessagesCount > 0 
                },
                { id: 'settings', label: 'Banners', icon: SlidersIcon }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer relative min-w-[54px] ${
                      isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-[#D4AF37] scale-110' : 'text-gray-400'}`} />
                      {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                        <span className={`absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-3.5 rounded-full text-[8px] font-mono font-bold flex items-center justify-center ${
                          item.isUnread ? 'bg-amber-400 text-black animate-pulse' : 'bg-[#D4AF37] text-black'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-[#D4AF37]' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProductId={editingProductId}
        productForm={productForm}
        setProductForm={setProductForm}
        productFormError={productFormError}
        productSaving={productSaving}
        uploadingImage={uploadingImage}
        onSave={handleSaveProduct}
        onImageFileUpload={handleImageFileUpload}
        categories={STOREFRONT_CATEGORIES}
      />

      {/* Order Details Dossier Modal */}
      <AdminOrderDetailsModal
        selectedOrder={selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

