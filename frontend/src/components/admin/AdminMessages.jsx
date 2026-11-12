import { useState } from 'react';
import { 
  MailIcon, 
  PhoneIcon, 
  WhatsAppIcon, 
  StarIcon, 
  CheckIcon, 
  TrashIcon, 
  SearchIcon, 
  ClockIcon, 
  SparklesIcon, 
  ExternalLinkIcon 
} from '../Icons';

export default function AdminMessages({
  messagesList = [],
  onUpdateStatus,
  onToggleStar,
  onDeleteMessage,
  dataLoading = false,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unread' | 'read' | 'replied' | 'starred'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  // Statistics
  const totalCount = messagesList.length;
  const unreadCount = messagesList.filter(m => m.status === 'unread').length;
  const todayCount = messagesList.filter(m => {
    if (!m.createdAt) return false;
    const msgDate = new Date(m.createdAt).toDateString();
    return msgDate === new Date().toDateString();
  }).length;
  const starredCount = messagesList.filter(m => m.starred).length;

  // Filter messages
  const filteredMessages = messagesList.filter((msg) => {
    // Status filter
    if (statusFilter === 'unread' && msg.status !== 'unread') return false;
    if (statusFilter === 'read' && msg.status !== 'read') return false;
    if (statusFilter === 'replied' && msg.status !== 'replied') return false;
    if (statusFilter === 'starred' && !msg.starred) return false;

    // Category filter
    if (categoryFilter !== 'all' && msg.inquiryType !== categoryFilter) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const nameMatch = (msg.name || '').toLowerCase().includes(q);
      const emailMatch = (msg.email || '').toLowerCase().includes(q);
      const phoneMatch = (msg.phone || '').toLowerCase().includes(q);
      const messageMatch = (msg.message || '').toLowerCase().includes(q);
      const categoryMatch = (msg.inquiryType || '').toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || messageMatch || categoryMatch;
    }

    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ' • ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header & Stats Cards (2x2 on Mobile, 4 cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Total Inquiries */}
        <div className="bg-[#141018] p-3 sm:p-4 rounded-2xl border border-[#2B2332] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gray-400 block truncate">
              Total Messages
            </span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-white mt-0.5 block">
              {totalCount}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <MailIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="bg-[#141018] p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/40 flex items-center justify-between shadow-lg shadow-amber-500/5">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold block truncate">
                Unread
              </span>
              {unreadCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
              )}
            </div>
            <span className="text-lg sm:text-2xl font-bold font-mono text-amber-300 mt-0.5 block">
              {unreadCount}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Today's Inquiries */}
        <div className="bg-[#141018] p-3 sm:p-4 rounded-2xl border border-[#2B2332] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gray-400 block truncate">
              Today
            </span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-white mt-0.5 block">
              {todayCount}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Starred Inquiries */}
        <div className="bg-[#141018] p-3 sm:p-4 rounded-2xl border border-[#2B2332] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gray-400 block truncate">
              Starred
            </span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-white mt-0.5 block">
              {starredCount}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400/20" />
          </div>
        </div>

      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-[#141018] p-3 sm:p-4 rounded-2xl border border-[#2B2332] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, phone, or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-[#1A1521] border border-[#2F2638] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-[#1A1521] border border-[#2F2638] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Track Order">Track Order</option>
              <option value="Size Guide">Size Guide</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="14-Day Exchanges">14-Day Exchanges</option>
              <option value="Styling Assistance">Styling Assistance</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>
          </div>

        </div>

        {/* Status Filter Tabs (Horizontal swipe on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none pt-1 border-t border-[#231B29]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mr-1 shrink-0">
            Status:
          </span>
          {[
            { id: 'all', label: 'All', count: totalCount },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'read', label: 'Read', count: messagesList.filter(m => m.status === 'read').length },
            { id: 'replied', label: 'Replied', count: messagesList.filter(m => m.status === 'replied').length },
            { id: 'starred', label: 'Starred', count: starredCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#1A1521] text-gray-400 hover:text-white border border-[#2B2332]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                statusFilter === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages List Canvas */}
      <div className="space-y-3">
        {dataLoading ? (
          <div className="text-center py-12 bg-[#141018] rounded-2xl border border-[#2B2332] space-y-2">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400 font-mono">Loading inquiries...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16 bg-[#141018] rounded-2xl border border-[#2B2332] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
              <MailIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">No Messages Found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No inquiries match the current search or filter criteria.'
                  : 'Customer inquiries sent through the Contact Us page will automatically appear here.'}
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isUnread = msg.status === 'unread';
            const isReplied = msg.status === 'replied';
            const cleanPhone = (msg.phone || '').replace(/\D/g, '');
            const isExpanded = expandedMessageId === msg._id;

            return (
              <div
                key={msg._id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isUnread
                    ? 'bg-[#18131E] border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'bg-[#141018] border-[#2A2231] hover:border-[#382E42]'
                }`}
              >
                {/* Message Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#251D2C]">
                  
                  {/* Sender Info & Badges */}
                  <div className="flex items-start sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleStar(msg._id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        msg.starred
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-gray-600 hover:text-gray-300 bg-white/5'
                      }`}
                      title={msg.starred ? 'Starred' : 'Mark as important'}
                    >
                      <StarIcon className={`w-4 h-4 ${msg.starred ? 'fill-amber-400' : ''}`} />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {msg.name || 'Anonymous User'}
                        </h4>
                        
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-black">
                            New
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#B76E79]/20 text-[#E6B8BF] border border-[#B76E79]/30">
                          {msg.inquiryType || 'General'}
                        </span>

                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                          isReplied
                            ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50'
                            : isUnread
                            ? 'bg-amber-900/40 text-amber-300 border border-amber-700/50'
                            : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/40'
                        }`}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                        <a
                          href={`mailto:${msg.email}`}
                          className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
                        >
                          <MailIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{msg.email}</span>
                        </a>

                        <a
                          href={`tel:${msg.phone}`}
                          className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
                        >
                          <PhoneIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{msg.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Date & Quick Action Icons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-400 shrink-0">
                    <span className="font-mono text-[11px] text-gray-400">
                      {formatDate(msg.createdAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteMessage(msg._id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Message Body Box */}
                <div className="mt-3.5 bg-[#0E0B12] p-3.5 rounded-xl border border-[#231A29]">
                  <p className="text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {isExpanded || (msg.message && msg.message.length <= 260)
                      ? msg.message
                      : `${msg.message.slice(0, 260)}...`}
                  </p>
                  {msg.message && msg.message.length > 260 && (
                    <button
                      type="button"
                      onClick={() => setExpandedMessageId(isExpanded ? null : msg._id)}
                      className="mt-2 text-[11px] text-[#D4AF37] hover:underline font-semibold cursor-pointer block"
                    >
                      {isExpanded ? 'Show less' : 'Read full message'}
                    </button>
                  )}
                </div>

                {/* Bottom Interactive Toolbar */}
                <div className="mt-3.5 pt-3 border-t border-[#231A29] flex flex-wrap items-center justify-between gap-2.5">
                  
                  {/* Status Switcher Buttons */}
                  <div className="flex items-center gap-2">
                    {msg.status !== 'read' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(msg._id, 'read')}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-white/5"
                      >
                        <CheckIcon className="w-3 h-3 text-emerald-400" />
                        <span>Mark as Read</span>
                      </button>
                    )}

                    {msg.status !== 'unread' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(msg._id, 'unread')}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-white/5"
                      >
                        <MailIcon className="w-3 h-3 text-amber-400" />
                        <span>Mark as Unread</span>
                      </button>
                    )}

                    {msg.status !== 'replied' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(msg._id, 'replied')}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-white/5"
                      >
                        <span>Mark as Replied</span>
                      </button>
                    )}
                  </div>

                  {/* External Communication Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=Hello%20${encodeURIComponent(msg.name || 'Customer')},%20this%20is%20Laila%20Shamsi%20Atelier%20regarding%20your%20inquiry%20about%20${encodeURIComponent(msg.inquiryType || 'our collection')}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (msg.status === 'unread') {
                            onUpdateStatus(msg._id, 'replied');
                          }
                        }}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=Regarding%20your%20inquiry%20at%20Laila%20Shamsi&body=Dear%20${encodeURIComponent(msg.name || 'Customer')},%0D%0A%0D%0AThank%20you%20for%20contacting%20Laila%20Shamsi%20Atelier.%0D%0A%0D%0ABest%20regards,%0D%0ALaila%20Shamsi`}
                      onClick={() => {
                        if (msg.status === 'unread') {
                          onUpdateStatus(msg._id, 'replied');
                        }
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    >
                      <ExternalLinkIcon className="w-3 h-3" />
                      <span>Email</span>
                    </a>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

