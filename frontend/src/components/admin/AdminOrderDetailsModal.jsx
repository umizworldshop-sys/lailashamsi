import { CloseIcon } from '../Icons';

export default function AdminOrderDetailsModal({
  selectedOrder,
  onClose,
  onStatusChange
}) {
  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-xl bg-[#141117] text-white rounded-2xl border border-[#D4AF37]/40 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto admin-scrollbar space-y-5">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#26202C] pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
              Order Details
            </span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold text-white mt-0.5">
              {selectedOrder.orderNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full bg-[#1F1924] hover:bg-[#2B2332] transition-colors cursor-pointer"
            title="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Customer Information Card */}
          <div className="bg-[#19141F] p-5 rounded-2xl border border-[#2A2332] space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
              Customer Information
            </span>
            <p className="text-base font-bold text-white">{selectedOrder.customer?.fullName || 'Guest Customer'}</p>
            <p className="text-gray-300">📧 {selectedOrder.customer?.email || 'N/A'}</p>
            <p className="text-gray-300">📞 {selectedOrder.customer?.phone || 'N/A'}</p>
            <p className="text-gray-300">
              📍 {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.country || 'Pakistan'}
            </p>
            {selectedOrder.customer?.deliveryNotes && (
              <p className="text-amber-300 italic pt-2 border-t border-[#2A2332]">
                Delivery Notes: "{selectedOrder.customer.deliveryNotes}"
              </p>
            )}
          </div>

          {/* Ordered Items List */}
          <div className="bg-[#19141F] p-5 rounded-2xl border border-[#2A2332] space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
              Ordered Items
            </span>
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b border-[#251E2B] last:border-0">
                {item.image && (
                  <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-xl border border-[#3E324B]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.title}</p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Size: {item.selectedSize} {item.selectedColor?.name ? `• Color: ${item.selectedColor.name}` : ''} • Qty: {item.quantity || 1}
                  </p>
                  <p className="text-xs font-mono font-bold text-[#E6B8BF]">
                    Rs. {item.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-2 flex justify-between font-mono text-sm font-bold text-white border-t border-[#2A2332]">
              <span>Total Payable:</span>
              <span className="text-[#E6B8BF]">Rs. {selectedOrder.grandTotal?.toLocaleString()}</span>
            </div>
          </div>

          {/* Status Changer & WhatsApp Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#19141F] p-4 rounded-2xl border border-[#2A2332]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-300">Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => onStatusChange(selectedOrder._id || selectedOrder.id, e.target.value)}
                className="bg-[#141118] border border-[#3A3044] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {selectedOrder.customer?.phone && (
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customer.fullName || 'Customer')},%20this%20is%20Laila%20Shamsi%20regarding%20your%20order%20${selectedOrder.orderNumber}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

