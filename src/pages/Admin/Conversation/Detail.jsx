import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, MessageCircle, Search, ShieldAlert, UserRound } from "lucide-react";
import { useAdminChat } from "../../../hooks/Admin/useAdminChat";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; 

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const { messages, loading: hookLoading, error, selectConversation } = useAdminChat();
  const [search, setSearch] = useState("");

  const { user: adminUser, isLoading: authLoading } = useAuth();

  const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('conversations_view');

  useEffect(() => {
      if (!authLoading && !hasPermission) {
          const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
          return () => clearTimeout(timer);
      }
  }, [authLoading, hasPermission, navigate]);

  useEffect(() => {
    if (authLoading || !hasPermission) return;
    selectConversation(id);
  }, [id, selectConversation, authLoading, hasPermission]);

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  if (authLoading || hookLoading) {
    return (
        <div className="h-[85vh] rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
          <div className="flex h-full flex-col gap-4">
            <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="flex-1 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
    );
  }

  if (!hasPermission) {
    return (
        <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <ShieldAlert size={26} />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền truy cập trang này</p>
            <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về trang tổng quan.</p>
        </div>
    );
  }

  if (error) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center font-semibold text-rose-700">Lỗi: {error}</div>;

  return (
    <div className="flex h-[85vh] overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-sm">

      {/* KHU VỰC CHAT */}
      <div className="flex flex-col flex-1">

        {/* Tiêu đề */}
        <div className="flex flex-col gap-4 border-b border-slate-300 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              aria-label="Quay lại"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                <MessageCircle size={16} />
                Chi tiết cuộc hội thoại
              </div>
              <h2 className="mt-1 truncate text-xl font-semibold text-slate-950">
                Phiên trao đổi với trợ lý AI
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
            <span className="text-slate-400">Mã hội thoại:</span> <span className="font-mono text-slate-800">{id}</span> · {messages.length} tin nhắn
          </div>
        </div>

        {/* Tìm kiếm tin nhắn */}
        <div className="border-b border-slate-300 bg-white px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung tin nhắn..."
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          </div>
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-[#f5f9fc] px-5 py-6">
          {filteredMessages.length === 0 && (
            <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-slate-300 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">Không tìm thấy tin nhắn phù hợp</p>
              <p className="mt-1 text-sm text-slate-400">Thử nhập từ khóa khác để kiểm tra nội dung hội thoại.</p>
            </div>
          )}

          {filteredMessages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div key={msg._id} className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                {/* Ảnh đại diện */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold shadow-sm
                    ${isUser ? "bg-slate-200 text-slate-700" : "bg-sky-100 text-sky-700"}`}>
                  {isUser ? <UserRound size={18} /> : <Bot size={18} />}
                </div>

                {/* Bong bóng tin nhắn */}
                <div
                  className={`max-w-[78%] rounded-3xl px-5 py-3 shadow-sm
                  ${isUser
                      ? "bg-sky-600 text-white rounded-tr-md"
                      : "border border-slate-300 bg-white text-slate-800 rounded-tl-md"
                    }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  <div
                    className={`mt-2 text-[11px] font-medium opacity-75 ${isUser ? "text-right text-sky-100" : "text-slate-400"}`}
                  >
                    {new Date(msg.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
