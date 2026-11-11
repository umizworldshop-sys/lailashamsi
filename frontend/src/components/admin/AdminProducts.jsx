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
  onDeleteProduct
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141117] p-4 rounded-2xl border border-[#27212E]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
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
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1C1722] border border-[#2F2637] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Grid vs Table toggle */}
          <div className="flex items-center bg-[#1C1722] border border-[#2F2637] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <GridIcon className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer shrink-0"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Content: Grid or Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#141117] border border-[#27212E] rounded-2xl p-12 text-center text-gray-500 text-xs">
          No products found matching this filter or search.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((p) => {
            const primaryImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.image || '/Logo.jpeg');
            const pid = p._id || p.id;
            return (
              <div 
                key={pid}
                className="bg-[#151119] border border-[#27212E] rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[3/4] bg-[#1E1924] overflow-hidden">
                    <img 
                      src={primaryImg} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-black/70 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm">
                        {p.tag}
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-mono bg-black/80 text-gray-300 backdrop-blur-sm">
                      {p.categoryLabel || p.category}
                    </span>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-xs font-bold text-white truncate" title={p.title}>
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">{p.fabric || 'Fabric details'}</p>
                    {/* Price display with PKR scaling */}
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="font-mono text-sm font-bold text-[#E6B8BF]">
                        Rs. {(p.price < 1000 ? p.price * 100 : p.price)?.toLocaleString()}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="font-mono text-[10px] text-gray-500 line-through">
                          Rs. {(p.originalPrice < 1000 ? p.originalPrice * 100 : p.originalPrice)?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-[#110E14] border-t border-[#231C29] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteProduct(pid)}
                    className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900 rounded-lg transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
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
                  <th className="py-3 px-4 font-semibold">Badge</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231C29]">
                {filteredProducts.map((p) => {
                  const pid = p._id || p.id;
                  const primaryImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.image || '/Logo.jpeg');
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

