import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminChat } from "../../../hooks/Admin/useAdminChat";

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const { messages, loading, error, selectConversation } = useAdminChat();
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Tải lịch sử tin nhắn
    selectConversation(id);
  }, [id, selectConversation]);

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  if (loading) return <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Lỗi: {error}</div>;

  return (
    <div className="flex h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">

      {/* KHU VỰC CHAT */}
      <div className="flex flex-col flex-1">

        {/* Tiêu đề */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              ← Quay lại
            </button>

            <h2 className="text-lg font-bold text-gray-800">
              Chi tiết Cuộc hội thoại
            </h2>
          </div>

          <div className="text-sm font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            Mã ID: <span className="text-gray-700">{id}</span> • {messages.length} tin nhắn
          </div>
        </div>

        {/* Tìm kiếm tin nhắn */}
        <div className="px-6 py-3 border-b bg-white">
          <input
            type="text"
            placeholder="Tìm kiếm nội dung tin nhắn..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 space-y-6">
          {filteredMessages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              Không tìm thấy tin nhắn nào khớp với kết quả tìm kiếm.
            </div>
          )}

          {filteredMessages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg._id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
              >
                {/* Ảnh đại diện */}
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold shadow-sm
                    ${isUser ? "bg-gray-200 text-gray-700" : "bg-blue-100 text-blue-600"}`}>
                  {isUser ? "U" : "🤖"}
                </div>

                {/* Bong bóng tin nhắn */}
                <div
                  className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm
                  ${isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  <div
                    className={`text-[11px] mt-2 opacity-70 ${isUser ? "text-right text-blue-100" : "text-gray-400"}`}
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