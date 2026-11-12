import { 
  BanknotesIcon, 
  ReceiptIcon, 
  PackageIcon, 
  TrendingUpIcon, 
  PlusIcon, 
  SlidersIcon, 
  ChevronRightIcon,
  EyeIcon,
  MailIcon 
} from '../Icons';

export default function AdminOverview({
  totalRevenue,
  ordersList = [],
  productsList = [],
  messagesList = [],
  unreadMessagesCount = 0,
  onOpenAddProduct,
  onNavigateTab,
  onSelectOrder
}) {
  const averageOrderValue = ordersList.length > 0 ? Math.round(totalRevenue / ordersList.length) : 0;
  const recentOrders = ordersList.slice(0, 5);

  const pendingOrders = ordersList.filter(o => o.status === 'Pending').length;

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* 4 Metric Cards (2x2 on Mobile, 4 cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D4AF37] font-semibold truncate">
              Total Revenue
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <BanknotesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-mono text-base sm:text-2xl font-bold text-white tracking-tight truncate">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 truncate">Cash on Delivery</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#B76E79]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#B76E79] font-semibold truncate">
              Total Orders
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79] shrink-0">
              <ReceiptIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-mono text-base sm:text-2xl font-bold text-white tracking-tight">
            {ordersList.length}
          </p>
          <p className="text-[9px] sm:text-[10px] text-amber-300/90 mt-0.5 truncate">
            {pendingOrders} awaiting fulfillment
          </p>
        </div>

        {/* Active Products */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D4AF37] font-semibold truncate">
              Total Outfits
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <PackageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-mono text-base sm:text-2xl font-bold text-white tracking-tight">
            {productsList.length}
          </p>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 truncate">Catalog items</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-3.5 sm:p-5 relative overflow-hidden group hover:border-[#B76E79]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#B76E79] font-semibold truncate">
              Avg. Order Value
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79] shrink-0">
              <TrendingUpIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-mono text-base sm:text-2xl font-bold text-white tracking-tight truncate">
            Rs. {averageOrderValue.toLocaleString()}
          </p>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 truncate">Per order</p>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3.5">
        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#D4AF37] transition-all text-left cursor-pointer group shadow-sm col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">+ Add Outfit</h4>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">New product modal</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('products')}
          className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#D4AF37] transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PackageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Catalog</h4>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">{productsList.length} items</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#B76E79] transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#B76E79]/15 text-[#B76E79] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ReceiptIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Orders</h4>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">{ordersList.length} total</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('messages')}
          className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-amber-500/50 transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MailIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-bold text-white truncate">Inquiries</h4>
              {unreadMessagesCount > 0 && (
                <span className="px-1 py-0.2 rounded-full text-[8px] font-mono font-bold bg-amber-400 text-black">
                  {unreadMessagesCount}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">{messagesList.length} messages</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('settings')}
          className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#D4AF37] transition-all text-left cursor-pointer group shadow-sm col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <SlidersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Banners & Sale</h4>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">Hero slides & %</p>
          </div>
        </button>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-4 sm:p-5 space-y-3.5 sm:space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Recent Orders
            </h3>
            <p className="text-[10px] text-gray-400">Latest customer orders</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            No customer orders placed yet. Orders will appear here in real time.
          </div>
        ) : (
          <>
            {/* Mobile Cards (Visible only on screens < 640px) */}
            <div className="sm:hidden space-y-2.5">
              {recentOrders.map((order) => (
                <div 
                  key={order._id || order.id} 
                  className="bg-[#1A1521] border border-[#2E2536] rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                      order.status === 'Pending' ? 'bg-amber-950/60 text-amber-300 border border-amber-800' :
                      order.status === 'Processing' ? 'bg-blue-950/60 text-blue-300 border border-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-950/60 text-purple-300 border border-purple-800' :
                      order.status === 'Delivered' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' :
                      'bg-rose-950/60 text-rose-300 border border-rose-800'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium truncate max-w-[160px]">
                      {order.customer?.fullName || 'Customer'}
                    </span>
                    <span className="text-gray-400 font-mono text-[11px]">
                      {order.customer?.city || 'Pakistan'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#261E2E]">
                    <span className="font-mono font-bold text-xs text-[#E6B8BF]">
                      Rs. {order.grandTotal?.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <EyeIcon className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (Hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#282130] text-gray-400 uppercase text-[10px] font-mono tracking-wider">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">City</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#241D2B]">
                  {recentOrders.map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono font-semibold text-white">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-gray-200">
                        {order.customer?.fullName || 'Guest'}
                      </td>
                      <td className="py-3 text-gray-400 font-mono">
                        {order.customer?.city || 'Pakistan'}
                      </td>
                      <td className="py-3 font-mono font-bold text-[#E6B8BF]">
                        Rs. {order.grandTotal?.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          order.status === 'Pending' ? 'bg-amber-950/60 text-amber-300 border border-amber-800' :
                          order.status === 'Processing' ? 'bg-blue-950/60 text-blue-300 border border-blue-800' :
                          order.status === 'Shipped' ? 'bg-purple-950/60 text-purple-300 border border-purple-800' :
                          order.status === 'Delivered' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' :
                          'bg-rose-950/60 text-rose-300 border border-rose-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          <EyeIcon className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

