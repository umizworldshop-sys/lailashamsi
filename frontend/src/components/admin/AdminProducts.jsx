import { 
  PlusIcon, 
  SearchIcon, 
  EditIcon, 
  TrashIcon,
  GridIcon,
  ListIcon
} from '../Icons';

export default function AdminProducts({
  products = [],
  categories = [],
  activeCategory,
  setActiveCategory,
  catalogSearch,
  setCatalogSearch,
  viewMode,
  setViewMode,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onToggleStock
}) {
  const filteredProducts = products.filter(p => {
    let matchesCat;
    if (activeCategory === 'all') {
      matchesCat = true;
    } else if (activeCategory === 'female') {
      matchesCat = p.category === 'female' || (!['babies', 'kids', 'baby-clothes'].includes(p.category) && p.stitchType !== 'babies');
    } else if (activeCategory === 'babies') {
      matchesCat = p.category === 'babies' || p.category === 'kids' || p.category === 'baby-clothes' || p.stitchType === 'babies';
    } else if (activeCategory === 'unstitched') {
      matchesCat = p.category === 'unstitched' || p.stitchType === 'unstitched' || p.categoryLabel?.toLowerCase().includes('unstitched');
    } else if (activeCategory === 'stitched') {
      matchesCat = p.category === 'stitched' || p.stitchType === 'stitched' || p.category === 'ready-to-wear';
    } else {
      matchesCat = p.category === activeCategory;
    }

    const matchesQuery = !catalogSearch || 
      p.title?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.tag?.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Header */}
      <div className="bg-[#141117] p-3 sm:p-4 rounded-2xl border border-[#27212E] space-y-3">
        {/* Category Pills (Horizontal swipe on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#D4AF37] text-black font-semibold shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, View Mode & Add */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search by title, fabric or tag..."
              className="w-full bg-[#1C1722] border border-[#2F2637] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Grid vs Table toggle */}
            <div className="flex items-center bg-[#1C1722] border border-[#2F2637] rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <GridIcon className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer shrink-0"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Content: Grid or Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#141117] border border-[#27212E] rounded-2xl p-8 sm:p-12 text-center text-gray-500 text-xs">
          No products found matching this filter or search.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {filteredProducts.map((p) => {
            const primaryImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.image || '/Logo.jpeg');
            const pid = p._id || p.id;
            const isOut = Boolean(p.isOutOfStock) || (p.stock !== undefined && Number(p.stock) <= 0);
            const stockCount = p.stock !== undefined ? p.stock : 25;

            return (
              <div 
                key={pid}
                className={`bg-[#151119] border rounded-2xl overflow-hidden transition-all group flex flex-col justify-between shadow-lg ${
                  isOut ? 'border-rose-900/40 hover:border-rose-600/60' : 'border-[#27212E] hover:border-[#D4AF37]/50'
                }`}
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[3/4] bg-[#1E1924] overflow-hidden">
                    <img 
                      src={primaryImg} 
                      alt={p.title} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOut ? 'opacity-75' : ''}`}
                    />
                    {/* Stock Status Badge */}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold backdrop-blur-md flex items-center gap-1 border shadow-sm ${
                      isOut
                        ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                        : 'bg-black/75 text-emerald-300 border-emerald-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`}></span>
                      <span>{isOut ? 'OUT OF STOCK' : `${stockCount} in stock`}</span>
                    </span>

                    {p.tag && !isOut && (
                      <span className="absolute bottom-2 left-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] uppercase font-mono font-bold bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm truncate max-w-[70%]">
                        {p.tag}
                      </span>
                    )}

                    <span className="absolute bottom-2 right-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-mono bg-black/80 text-gray-300 backdrop-blur-sm truncate max-w-[70%]">
                      {p.categoryLabel || p.category}
                    </span>
                  </div>

                  {/* Info Box */}
                  <div className="p-2.5 sm:p-4 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate flex-1" title={p.title}>
                        {p.title}
                      </h3>
                      {isOut && (
                        <span className="text-[9px] font-bold font-mono text-rose-400 uppercase tracking-tight shrink-0">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{p.fabric || 'Fabric details'}</p>
                    {/* Price display with PKR scaling */}
                    <div className="pt-1 flex flex-wrap items-baseline gap-1.5">
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#E6B8BF]">
                        Rs. {(p.price < 200 ? p.price * 100 : p.price)?.toLocaleString()}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="font-mono text-[9px] sm:text-[10px] text-gray-500 line-through">
                          Rs. {(p.originalPrice < 200 ? p.originalPrice * 100 : p.originalPrice)?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-2 sm:p-2.5 bg-[#110E14] border-t border-[#231C29] flex flex-col gap-1.5">
                  {/* 1-Click Out of Stock Toggle Button (outside on the card as requested) */}
                  <button
                    type="button"
                    onClick={() => onToggleStock && onToggleStock(p)}
                    className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      isOut
                        ? 'bg-rose-950/70 hover:bg-emerald-950/80 text-rose-200 hover:text-emerald-300 border-rose-700/60 hover:border-emerald-500/60 shadow-sm'
                        : 'bg-[#18131F] hover:bg-rose-950/60 text-gray-300 hover:text-rose-200 border-[#2E2538] hover:border-rose-700/50'
                    }`}
                    title={isOut ? 'Click to Restock (Mark In Stock)' : 'Click to Mark Out of Stock'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
                    <span>{isOut ? 'Mark In Stock' : 'Out of Stock'}</span>
                  </button>

                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer"
                    >
                      <EditIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteProduct(pid)}
                      className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Delete Product"
                    >
                      <TrashIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141117] border border-[#27212E] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#26202C] bg-[#19141D] text-gray-400 uppercase text-[10px] font-mono tracking-wider">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Fabric</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock Status</th>
                  <th className="py-3 px-4 font-semibold">Badge</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231C29]">
                {filteredProducts.map((p) => {
                  const pid = p._id || p.id;
                  const primaryImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.image || '/Logo.jpeg');
                  const isOut = Boolean(p.isOutOfStock) || (p.stock !== undefined && Number(p.stock) <= 0);
                  const stockCount = p.stock !== undefined ? p.stock : 25;

                  return (
                    <tr key={pid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={primaryImg} alt="" className="w-9 h-11 object-cover rounded-lg border border-[#2F2536]" />
                        <span className="font-semibold text-white truncate max-w-xs">{p.title}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{p.categoryLabel || p.category}</td>
                      <td className="py-3 px-4 text-gray-400 truncate max-w-[150px]">{p.fabric}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#E6B8BF]">
                        Rs. {(p.price < 1000 ? p.price * 100 : p.price)?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleStock && onToggleStock(p)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
                            isOut
                              ? 'bg-rose-950/70 text-rose-300 border-rose-700/60 hover:bg-rose-900'
                              : 'bg-emerald-950/50 text-emerald-300 border-emerald-700/40 hover:bg-emerald-900/60'
                          }`}
                          title={isOut ? 'Click to Restock (Mark In Stock)' : 'Click to Mark Out of Stock'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
                          <span>{isOut ? 'Out of Stock' : `${stockCount} in stock`}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        {p.tag ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                            {p.tag}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteProduct(pid)}
                          className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          Delete
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

