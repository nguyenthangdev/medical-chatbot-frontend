/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/Client/ClientAuthContext.jsx';
import { Search } from "lucide-react";
import { getConversations, deleteConversationAPI, renameConversationAPI } from '../../apis/Client/chat.api';
import { MoreVertical, Star, Pencil, Trash2 } from "lucide-react";
import { toast } from 'react-toastify';

const Sidebar = ({ currentConversationId, refreshTrigger, onRefreshSidebar, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { user } = useAuth();

  // State quản lý Menu 3 chấm
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // const handleSelectConversation = (conv) => {
  //   // Không cần set local state nữa, gọi thẳng hàm của Cha
  //   onSelectConversation?.(conv._id);
  // };

  const handleSelectConversation = (id) => {
    navigate(`/chat/${id}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChat = () => {
    navigate('/');
    if (onCloseMobile) onCloseMobile();
  };

  // const handleNewChat = () => {
  //   // Không cần set local state nữa
  //   onNewChat?.();
  //   navigate('/');
  // };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Ngăn việc click trúng thẻ bao ngoài
    setOpenMenuId(null);
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch sử đoạn chat này không?")) {
      try {
        await deleteConversationAPI(id);
        if (currentConversationId === id) navigate('/'); // Đang xem mà xóa thì về trang chủ
        onRefreshSidebar();
      } catch (err) {
        toast.error("Xóa thất bại");
      }
    }
  };

  const handleRename = async (e, id, currentTitle) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const newTitle = prompt("Nhập tên mới cho cuộc hội thoại:", currentTitle);
    if (newTitle && newTitle.trim() !== currentTitle) {
      try {
        await renameConversationAPI(id, newTitle);
        onRefreshSidebar();
      } catch (err) {
        toast.error("Đổi tên thất bại");
      }
    }
  };

  return (
    <div className="w-full md:w-[300px] h-full bg-[#f9f9f9] border-r border-gray-200 flex flex-col p-4 shadow-sm relative">

      <button
        onClick={handleNewChat}
        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">+</span> Bắt đầu khám mới
        </span>
      </button>

      <div className="mt-4 relative">
        <span className="absolute left-3 top-2.5 text-gray-400"><Search size={18} /></span>
        <input
          type="text"
          placeholder="Tìm lịch sử khám..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        {!conversations || conversations.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-8">Chưa có lịch sử khám</p>
        ) : (
          Object.entries(grouped).map(([label, items]) =>
            items.length === 0 ? null : (
              <div key={label} className="mb-4">
                <h3 className="text-gray-400 font-semibold mb-1 text-[11px] uppercase tracking-wider ml-1">
                  {label}
                </h3>
                <div className="space-y-0.5">
                  {items.map((conv) => (
                    <div 
                      key={conv._id}
                      onClick={() => handleSelectConversation(conv._id)}
                      className={`relative w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors group cursor-pointer ${
                        currentConversationId === conv._id
                          ? 'bg-gray-200/60'
                          : 'hover:bg-gray-200/40'
                      }`}
                    >
                      <span className="truncate text-sm font-medium text-gray-700 pr-6">
                        {conv.title || 'Cuộc hội thoại mới'}
                      </span>

                      {/* NÚT 3 CHẤM GIỐNG CLAUDE */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === conv._id ? null : conv._id); }}
                        className={`absolute right-2 p-1 rounded-md transition-opacity ${openMenuId === conv._id || currentConversationId === conv._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-gray-300 text-gray-500`}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* DROPDOWN MENU */}
                      {openMenuId === conv._id && (
                        <div ref={menuRef} className="absolute right-4 top-8 w-40 bg-[#2d2d2d] text-[#ececec] rounded-xl shadow-xl border border-gray-700 z-50 py-1 overflow-hidden">
                           <button className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-[#3d3d3d] transition">
                              <Star size={14} /> Star
                           </button>
                           <button onClick={(e) => handleRename(e, conv._id, conv.title)} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-[#3d3d3d] transition">
                              <Pencil size={14} /> Rename
                           </button>
                           <button onClick={(e) => handleDelete(e, conv._id)} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-[#3d3d3d] text-red-400 hover:text-red-300 transition">
                              <Trash2 size={14} /> Delete
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

      {/* Cài đặt & Profile */}
      <div className="mt-auto pt-3 border-t border-gray-200">
        <button
          onClick={() => { navigate('/settings'); if (onCloseMobile) onCloseMobile(); }}
          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
            location.pathname === '/settings' ? 'bg-gray-200/60' : 'hover:bg-gray-200/40'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 flex flex-col items-start overflow-hidden">
            <span className="text-gray-800 font-semibold text-sm truncate w-full text-left">
              {user?.fullName || 'Đang tải...'}
            </span>
            <span className="text-gray-500 text-[11px]">Tài khoản miễn phí</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;