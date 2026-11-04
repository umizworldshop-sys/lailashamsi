import { 
  TrendingUpIcon, 
  ReceiptIcon, 
  PackageIcon, 
  PlusIcon, 
  SparklesIcon,
  ChevronRightIcon 
} from '../Icons';

export default function AdminOverview({
  totalRevenue,
  ordersList = [],
  productsList = [],
  onOpenAddProduct,
  onNavigateTab,
  onSelectOrder
}) {
  const averageOrderValue = ordersList.length > 0 ? Math.round(totalRevenue / ordersList.length) : 0;
  const recentOrders = ordersList.slice(0, 5);

  const pendingOrders = ordersList.filter(o => o.status === 'Pending').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <TrendingUpIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-white tracking-tight">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Cash on Delivery across Pakistan</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-5 relative overflow-hidden group hover:border-[#B76E79]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B76E79] font-semibold">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79]">
              <ReceiptIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-white tracking-tight">
            {ordersList.length}
          </p>
          <p className="text-[10px] text-amber-300/90 mt-1">
            {pendingOrders} awaiting fulfillment
          </p>
        </div>

        {/* Active Products */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <PackageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-white tracking-tight">
            {productsList.length}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Active products in catalog</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-5 relative overflow-hidden group hover:border-[#B76E79]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B76E79] font-semibold">
              Average Order Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#B76E79]/10 flex items-center justify-center text-[#B76E79]">
              <TrendingUpIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-white tracking-tight">
            Rs. {averageOrderValue.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Average per order</p>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-4 p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#D4AF37] transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PlusIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Add New Product</h4>
            <p className="text-[10px] text-gray-400">Add images, details, and pricing</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('settings')}
          className="flex items-center gap-4 p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#D4AF37] transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Banners, Sale % & Slider</h4>
            <p className="text-[10px] text-gray-400">Edit Sale %, Hero Slides & Marquee</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('products')}
          className="flex items-center gap-4 p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#D4AF37] transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PackageIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Products Inventory</h4>
            <p className="text-[10px] text-gray-400">Manage products, prices, and categories</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="flex items-center gap-4 p-4 bg-[#18131C] border border-[#2B2332] rounded-2xl hover:border-[#B76E79] transition-all text-left cursor-pointer group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#B76E79]/15 text-[#B76E79] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ReceiptIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Customer Orders</h4>
            <p className="text-[10px] text-gray-400">Update delivery statuses & order details</p>
          </div>
        </button>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#151119] border border-[#27212F] rounded-2xl p-5 space-y-4 shadow-lg">
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
          <div className="overflow-x-auto">
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
                        className="px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

