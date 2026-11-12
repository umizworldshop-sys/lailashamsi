import { 
  ReceiptIcon, 
  ClockIcon, 
  RefreshCwIcon, 
  TruckIcon, 
  CheckIcon, 
  CloseIcon, 
  EyeIcon 
} from '../Icons';

export default function AdminOrders({
  orders = [],
  statusFilter,
  setStatusFilter,
  onStatusChange,
  onSelectOrder
}) {
  const statuses = [
    { label: 'All', icon: ReceiptIcon },
    { label: 'Pending', icon: ClockIcon },
    { label: 'Processing', icon: RefreshCwIcon },
    { label: 'Shipped', icon: TruckIcon },
    { label: 'Delivered', icon: CheckIcon },
    { label: 'Cancelled', icon: CloseIcon }
  ];

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Status Filter Tabs (Horizontal swipe on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141117] p-3 sm:p-4 rounded-2xl border border-[#27212E]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statuses.map(st => {
            const count = st.label === 'All' ? orders.length : orders.filter(o => o.status === st.label).length;
            const isActive = statusFilter === st.label;
            const Icon = st.icon;
            return (
              <button
                key={st.label}
                onClick={() => setStatusFilter(st.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#B76E79] text-white font-semibold shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{st.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                  isActive ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-gray-400 self-end sm:self-auto">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#141117] border border-[#27212E] rounded-2xl p-8 sm:p-12 text-center text-gray-500 text-xs">
          No orders found matching status "{statusFilter}".
        </div>
      ) : (
        <>
          {/* Mobile Orders Card View (Visible only on screens < 640px) */}
          <div className="sm:hidden space-y-3">
            {filteredOrders.map((order) => {
              const oid = order._id || order.id;
              const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
              return (
                <div 
                  key={oid}
                  className="bg-[#151119] border border-[#27212E] rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  {/* Top Bar: Order ID + Status Select */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#231C29]">
                    <div>
                      <span className="font-mono font-bold text-sm text-white">
                        {order.orderNumber}
                      </span>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {totalItems} item{totalItems !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => onStatusChange(oid, e.target.value)}
                      className="bg-[#1D1723] border border-[#3A3044] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200 font-semibold">{order.customer?.fullName || 'Customer'}</span>
                      <span className="text-gray-400 font-mono text-[11px]">{order.customer?.city || 'Pakistan'}</span>
                    </div>

                    {order.customer?.phone && (
                      <div className="pt-0.5">
                        <a 
                          href={`tel:${order.customer.phone}`}
                          className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                        >
                          📞 {order.customer.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Total & View Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#231C29]">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-400 block">Total</span>
                      <span className="font-mono font-bold text-sm text-[#E6B8BF]">
                        Rs. {order.grandTotal?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>Order Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Orders Table View (Hidden on mobile) */}
          <div className="hidden sm:block bg-[#141117] border border-[#27212E] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#26202C] bg-[#19141D] text-gray-400 uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">City</th>
                    <th className="py-3 px-4 font-semibold">Items</th>
                    <th className="py-3 px-4 font-semibold">Total</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231C29]">
                  {filteredOrders.map((order) => {
                    const oid = order._id || order.id;
                    const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
                    return (
                      <tr key={oid} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-white">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-200">
                          {order.customer?.fullName || 'Customer'}
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                          {order.customer?.phone || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                          {order.customer?.city || 'Pakistan'}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-300">
                          {totalItems} item{totalItems !== 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#E6B8BF]">
                          Rs. {order.grandTotal?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => onStatusChange(oid, e.target.value)}
                            className="bg-[#1D1723] border border-[#3A3044] rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            <EyeIcon className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

