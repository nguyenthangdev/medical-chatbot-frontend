/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/Client/ClientAuthContext.jsx';
import {
  ChevronRight,
  ExternalLink,
  FileText,
  LogOut,
  MessageSquarePlus,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { getConversations, deleteConversationAPI, renameConversationAPI } from '../../apis/Client/chat.api';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog.jsx';

const Sidebar = ({
  currentConversationId,
  refreshTrigger,
  onRefreshSidebar,
  onCloseMobile,
  onNewChat,
  collapsed = false,
  onToggleCollapsed,
  isDarkMode = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const menuRef = useRef(null);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
        setLearnMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?._id) return;
      try {
        const res = await getConversations(user._id);
        setConversations(res);
      } catch (error) {
        console.error('Lỗi tải conversations:', error);
      }
    };
    fetchConversations();
  }, [user, refreshTrigger]);

  const filtered = conversations?.filter((c) =>
    c.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const groupByDate = (list) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const groups = { 'Hôm nay': [], 'Hôm qua': [], 'Trước đó': [] };

    list?.forEach((c) => {
      const d = new Date(c.updatedAt);
      if (d.toDateString() === today.toDateString()) {
        groups['Hôm nay'].push(c);
      } else if (d.toDateString() === yesterday.toDateString()) {
        groups['Hôm qua'].push(c);
      } else {
        groups['Trước đó'].push(c);
      }
    });

    return groups;
  };

  const grouped = groupByDate(filtered);
  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  const handleSelectConversation = (id) => {
    navigate(`/chat/${id}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      navigate('/');
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleDelete = (e, conversation) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteTarget(conversation);
  };

  const confirmDeleteConversation = async () => {
    if (!deleteTarget?._id) return;

    setIsDeleting(true);
    try {
      const res = await deleteConversationAPI(deleteTarget._id);
      if (res.code === 200) {
        toast.success(res.message || 'Đã xóa hội thoại');
        const isActiveChat = location.pathname.includes(deleteTarget._id) || currentConversationId === deleteTarget._id;
        if (isActiveChat) {
          onNewChat?.();
        }
        onRefreshSidebar();
        setDeleteTarget(null);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Xóa thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRename = async (e, id, currentTitle) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const newTitle = prompt('Nhập tên mới cho cuộc hội thoại:', currentTitle);
    if (newTitle && newTitle.trim() !== currentTitle) {
      try {
        const res = await renameConversationAPI(id, newTitle);
        if (res.code === 200) {
          toast.success(res.message || 'Đã đổi tên thành công');
          onRefreshSidebar();
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error('Đổi tên thất bại');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const goTo = (path) => {
    navigate(path);
    setAccountMenuOpen(false);
    setLearnMoreOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const shellClass = isDarkMode
    ? 'bg-[#1f1f1f] border-white/10 text-gray-100'
    : 'bg-[#f7f7f5] border-gray-200 text-gray-800';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const hoverItem = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/60';
  const activeItem = isDarkMode ? 'bg-white/10' : 'bg-gray-200/70';

  if (collapsed) {
    return (
      <div className={`h-full w-[72px] border-r ${shellClass} flex flex-col items-center py-4 shadow-sm`}>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${hoverItem}`}
          title="Mở thanh bên"
        >
          <PanelLeftOpen size={20} />
        </button>

        <button
          type="button"
          onClick={handleNewChat}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#da7756] text-white shadow-sm transition hover:bg-[#c96648]"
          title="Bắt đầu khám mới"
        >
          <MessageSquarePlus size={20} />
        </button>

        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => goTo('/settings')}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${location.pathname === '/settings' ? activeItem : hoverItem}`}
            title="Cài đặt"
          >
            <Settings size={20} />
          </button>
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-black text-sm font-bold text-white"
            title={user?.fullName || 'Tài khoản'}
          >
            {userInitial}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full md:w-[300px] h-full border-r ${shellClass} flex flex-col p-3 shadow-sm relative`}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handleNewChat}
          className={`flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-left font-bold ${hoverItem}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#da7756] text-sm text-white">M</span>
          <span className="truncate text-lg">MedBot</span>
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`hidden h-9 w-9 items-center justify-center rounded-xl md:flex ${hoverItem}`}
          title="Thu gọn thanh bên"
        >
          <PanelLeftClose size={19} />
        </button>
      </div>

      <button
        onClick={handleNewChat}
        className={`w-full border font-semibold py-3 px-3 rounded-xl flex items-center gap-2 transition-all shadow-sm ${
          isDarkMode
            ? 'border-white/10 bg-white/5 hover:bg-white/10'
            : 'border-gray-200 bg-white hover:bg-gray-50'
        }`}
      >
        <MessageSquarePlus size={18} />
        <span>Bắt đầu khám mới</span>
      </button>

      <div className="mt-4 relative">
        <span className={`absolute left-3 top-2.5 ${mutedText}`}><Search size={18} /></span>
        <input
          type="text"
          placeholder="Tìm lịch sử khám..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`w-full border rounded-xl py-2 pl-9 pr-3 text-sm outline-none transition-colors ${
            isDarkMode
              ? 'bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 focus:border-[#da7756]'
              : 'bg-white border-gray-200 text-gray-800 focus:border-blue-400'
          }`}
        />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        {!conversations || conversations.length === 0 ? (
          <p className={`${mutedText} text-sm text-center mt-8`}>Chưa có lịch sử khám</p>
        ) : (
          Object.entries(grouped).map(([label, items]) =>
            items.length === 0 ? null : (
              <div key={label} className="mb-4">
                <h3 className={`${mutedText} font-semibold mb-1 text-[11px] uppercase tracking-wider ml-1`}>
                  {label}
                </h3>
                <div className="space-y-0.5">
                  {items.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => handleSelectConversation(conv._id)}
                      className={`relative w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors group cursor-pointer ${
                        currentConversationId === conv._id ? activeItem : hoverItem
                      }`}
                    >
                      <span className="truncate text-sm font-medium pr-7">
                        {conv.title || 'Cuộc hội thoại mới'}
                      </span>

                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === conv._id ? null : conv._id); }}
                        className={`absolute right-2 p-1 rounded-md transition-opacity ${openMenuId === conv._id || currentConversationId === conv._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${hoverItem} ${mutedText}`}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === conv._id && (
                        <div ref={menuRef} className="absolute right-4 top-8 w-40 bg-[#2d2d2d] text-[#ececec] rounded-xl shadow-xl border border-gray-700 z-50 py-1 overflow-hidden">
                          <button onClick={(e) => handleRename(e, conv._id, conv.title)} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-[#3d3d3d] transition">
                            <Pencil size={14} /> Đổi tên
                          </button>
                          <button onClick={(e) => handleDelete(e, conv)} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-[#3d3d3d] text-red-400 hover:text-red-300 transition">
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>

      <div className="mt-auto pt-3" ref={accountMenuRef}>
        {accountMenuOpen && (
          <div className={`absolute bottom-[76px] left-3 right-3 z-50 rounded-2xl border p-2 shadow-2xl ${
            isDarkMode ? 'border-white/10 bg-[#32322f] text-gray-100' : 'border-gray-200 bg-white text-gray-800'
          }`}>
            <div className={`truncate px-3 py-2 text-sm ${mutedText}`}>
              {user?.email || user?.phone || 'Tài khoản MedBot'}
            </div>

            <button onClick={() => goTo('/settings')} className={`w-full rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 ${hoverItem}`}>
              <Settings size={17} /> Cài đặt
              <span className={`ml-auto text-xs ${mutedText}`}>Ctrl,</span>
            </button>
            <button onClick={() => goTo('/upgrade')} className={`w-full rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 ${hoverItem}`}>
              <Sparkles size={17} /> Nâng cấp gói
            </button>

            <div className={`my-2 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

            <div className="relative">
              <button
                onClick={() => setLearnMoreOpen(prev => !prev)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 ${hoverItem}`}
              >
                <ShieldCheck size={17} /> Tìm hiểu thêm
                <ChevronRight size={16} className="ml-auto" />
              </button>

              {learnMoreOpen && (
                <div className={`absolute bottom-0 left-[calc(100%+10px)] w-56 rounded-2xl border p-2 shadow-2xl ${
                  isDarkMode ? 'border-white/10 bg-[#32322f]' : 'border-gray-200 bg-white'
                }`}>
                  <button onClick={() => goTo('/usage-policy')} className={`w-full rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 ${hoverItem}`}>
                    <FileText size={16} /> Chính sách sử dụng <ExternalLink size={14} className="ml-auto" />
                  </button>
                  <button onClick={() => goTo('/privacy-policy')} className={`w-full rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 ${hoverItem}`}>
                    <ShieldCheck size={16} /> Chính sách quyền riêng tư <ExternalLink size={14} className="ml-auto" />
                  </button>
                </div>
              )}
            </div>

            <div className={`my-2 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

            <button onClick={handleLogout} className={`w-full rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 ${hoverItem}`}>
              <LogOut size={17} /> Đăng xuất
            </button>
          </div>
        )}

        <button
          onClick={() => setAccountMenuOpen(prev => !prev)}
          className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 ${
            accountMenuOpen ? activeItem : hoverItem
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#e7e0d4] text-gray-800 flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 flex flex-col items-start overflow-hidden">
            <span className="font-semibold text-sm truncate w-full text-left">
              {user?.fullName || 'Đang tải...'}
            </span>
            <span className={`${mutedText} text-[11px]`}>Gói miễn phí</span>
          </div>
          <ChevronRight size={16} className={`${mutedText} rotate-[-90deg]`} />
        </button>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa đoạn hội thoại?"
        description={`"${deleteTarget?.title || 'Cuộc hội thoại mới'}" sẽ bị xóa khỏi lịch sử khám của bạn. Hành động này không thể hoàn tác.`}
        confirmText="Xóa hội thoại"
        loading={isDeleting}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteConversation}
      />
    </div>
  );
};

export default Sidebar;
