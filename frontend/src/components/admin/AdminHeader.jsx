import { 
  MenuIcon, 
  SearchIcon,
  PlusIcon,
  RefreshCwIcon,
  CloseIcon
} from '../Icons';

export default function AdminHeader({
  activeTab,
  onOpenMobileSidebar,
  globalSearch,
  setGlobalSearch,
  onRefresh,
  dataLoading,
  onOpenAddProduct,
  onClose
}) {
  const titles = {
    overview: 'Dashboard Overview',
    products: 'Products Inventory',
    orders: 'Customer Orders',
    messages: 'Customer Messages',
    settings: 'Banners & Slider'
  };

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#130F17] border-b border-[#26202C] flex items-center justify-between gap-3 shrink-0">
      {/* Left: Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-gray-300 hover:text-white rounded-xl bg-white/5 border border-white/5 cursor-pointer shrink-0 transition-colors"
          title="Open Admin Menu"
          aria-label="Open Admin Menu"
        >
          <MenuIcon className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <h1 className="font-cinzel text-xs sm:text-base font-bold text-white tracking-wide truncate">
            {titles[activeTab] || 'Admin Panel'}
          </h1>
          <p className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
            Laila Shamsi Luxury Eastern Wear
          </p>
        </div>
      </div>

      {/* Right: Actions & Global Search */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Desktop Global Search */}
        <div className="relative hidden lg:block w-52 xl:w-60">
          <input
            type="text"
            value={globalSearch || ''}
            onChange={(e) => setGlobalSearch && setGlobalSearch(e.target.value)}
            placeholder="Search catalog or orders..."
            className="w-full bg-[#1A1521] border border-[#2E2636] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <SearchIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Quick Add Product Button */}
        {onOpenAddProduct && (
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
            title="Add New Product"
          >
            <PlusIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">+ Product</span>
            <span className="sm:hidden text-[11px]">+ Add</span>
          </button>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={dataLoading}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCwIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${dataLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>
        )}

        {/* Exit / Return to Storefront */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white/5 hover:bg-rose-950/40 text-gray-300 hover:text-rose-200 border border-white/10 hover:border-rose-800/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
            title="Exit Admin Panel & Return to Storefront"
          >
            <CloseIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        )}
      </div>
    </header>
  );
}

