import { 
  DashboardIcon, 
  PackageIcon, 
  ReceiptIcon, 
  SlidersIcon,
  MailIcon,
  ExternalLinkIcon, 
  LogOutIcon 
} from '../Icons';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  productsCount = 0, 
  ordersCount = 0, 
  messagesCount = 0,
  unreadMessagesCount = 0,
  adminUser, 
  onClose, 
  onLogout 
}) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: DashboardIcon },
    { id: 'products', label: 'Products', icon: PackageIcon, badge: productsCount },
    { id: 'orders', label: 'Orders', icon: ReceiptIcon, badge: ordersCount },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MailIcon, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : messagesCount,
      isUnreadBadge: unreadMessagesCount > 0 
    },
    { id: 'settings', label: 'Banners & Slider', icon: SlidersIcon }
  ];

  return (
    <aside className="w-64 bg-[#110E14] border-r border-[#26202C] flex flex-col justify-between shrink-0 h-full">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-[#26202C] flex items-center gap-3">
          <img 
            src="/Logo.jpeg" 
            alt="Laila Shamsi" 
            className="w-10 h-10 rounded-xl object-contain border border-[#D4AF37]/40 shadow-md"
          />
          <div className="min-w-0">
            <h2 className="font-cinzel text-sm font-bold text-white tracking-widest uppercase truncate">
              Laila Shamsi
            </h2>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold truncate">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B76E79]/20 to-[#8E4453]/10 text-white border border-[#B76E79]/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    item.isUnreadBadge
                      ? 'bg-amber-400 text-black font-bold'
                      : isActive ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-[#26202C] space-y-3">
        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-[#18141D] rounded-xl border border-[#2B2433]">
          <div className="w-7 h-7 rounded-lg bg-[#B76E79]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold font-cinzel">
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{adminUser?.name || 'Administrator'}</p>
            <p className="text-[10px] text-gray-400 truncate">{adminUser?.email || 'admin@lailashamsi.com'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-[11px] font-medium border border-white/5 transition-colors cursor-pointer"
            title="Return to Storefront"
          >
            <ExternalLinkIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Storefront</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center justify-center p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-[11px] border border-rose-900/40 transition-colors cursor-pointer"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

