import { 
  MenuIcon, 
  SearchIcon 
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
    products: 'Products',
    orders: 'Orders',
    messages: 'Customer Messages & Inquiries',
    settings: 'Storefront Banners & Hero Slider'
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#130F17] border-b border-[#26202C] flex items-center justify-between gap-4 shrink-0">
      {/* Left: Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
          title="Open Menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wide truncate">
            {titles[activeTab] || 'Admin Panel'}
          </h1>
          <p className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
            Laila Shamsi Luxury Eastern Wear
          </p>
        </div>
      </div>

      {/* Right: Global Search */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden lg:block w-56">
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search catalog or orders..."
            className="w-full bg-[#1A1521] border border-[#2E2636] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <SearchIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </header>
  );
}

