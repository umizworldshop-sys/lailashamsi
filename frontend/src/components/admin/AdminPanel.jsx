import { useState, useEffect, useCallback, useMemo } from 'react';
import { SparklesIcon } from '../Icons';
import AdminAuthModal from './AdminAuthModal';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminStoreSettings from './AdminStoreSettings';
import AdminProductModal from './AdminProductModal';
import AdminOrderDetailsModal from './AdminOrderDetailsModal';
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
  updateSiteSettings
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
      const [productsRes, ordersRes, settingsRes] = await Promise.all([
        fetchProducts().catch(() => ({ products: [] })),
        fetchOrders(activeToken).catch(() => ({ orders: [] })),
        fetchSiteSettings().catch(() => ({ settings: null }))
      ]);

      if (productsRes && productsRes.products) setProductsList(productsRes.products);
      if (ordersRes && ordersRes.orders) setOrdersList(ordersRes.orders);
      if (settingsRes && settingsRes.settings) setLocalSettings(settingsRes.settings);
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
        setProductFormError('Please upload a product photo from your device or paste an Image URL before saving.');
        setProductSaving(false);
        return;
      }

      const payload = {
        title: productForm.title.trim(),
        category: productForm.category,
        categoryLabel: productForm.categoryLabel,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        fabric: productForm.fabric.trim(),
        pieces: productForm.pieces.trim(),
        tag: productForm.tag.trim(),
        description: productForm.description.trim(),
        sizes: productForm.sizes,
        colors: productForm.colors,
        images: validImages,
        image: validImages[0],
        isNewArrival: Boolean(productForm.isNewArrival),
        isOnSale: Boolean(productForm.isOnSale || (productForm.originalPrice && Number(productForm.originalPrice) > Number(productForm.price))),
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

  // Revenue Calculation
  const totalRevenue = useMemo(() => {
    return ordersList.reduce((acc, order) => acc + (order.grandTotal || 0), 0);
  }, [ordersList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-[#070607] text-[#EDE8E3] font-body w-full max-w-full">
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
              adminUser={adminUser}
              onClose={handleClose}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Dashboard Canvas */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A080D]">
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

            {/* Scrollable Tab Canvas */}
            <main className="flex-1 overflow-y-auto admin-scrollbar">
              {activeTab === 'overview' && (
                <AdminOverview
                  totalRevenue={totalRevenue}
                  ordersList={ordersList}
                  productsList={productsList}
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

              {activeTab === 'settings' && (
                <AdminStoreSettings
                  siteSettings={localSettings || siteSettings}
                  onSaveSettings={handleSaveStoreSettings}
                  token={token}
                  showToast={showToast}
                />
              )}
            </main>
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

