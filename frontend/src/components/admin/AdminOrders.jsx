export default function AdminOrders({
  orders = [],
  statusFilter,
  setStatusFilter,
  onStatusChange,
  onSelectOrder
}) {
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141117] p-4 rounded-2xl border border-[#27212E]">
        <div className="flex flex-wrap items-center gap-1.5">
          {statuses.map(st => {
            const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#B76E79] text-white font-semibold shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                  isActive ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#141117] border border-[#27212E] rounded-2xl p-12 text-center text-gray-500 text-xs">
          No orders found matching status "{statusFilter}".
        </div>
      ) : (
        <div className="bg-[#141117] border border-[#27212E] rounded-2xl overflow-hidden shadow-lg">
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
                          className="px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

