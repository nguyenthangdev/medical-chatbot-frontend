import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminChat } from "../../../hooks/Admin/useAdminChat";

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const { messages, loading, error, selectConversation } = useAdminChat();
  const [search, setSearch] = useState("");
  const [conversationData, setConversationData] = useState(null);

  useEffect(() => {
    // Load messages cho conversation này
    selectConversation(id);
  }, [id, selectConversation]);

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="flex h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">

      {/* CHAT AREA */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-black"
            >
              ← Quay lại
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Chi tiết Conversation
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            ID: {id} • {messages.length} tin nhắn
          </div>

        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b bg-white">
          <input
            type="text"
            placeholder="Tìm tin nhắn..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 space-y-6">

          {filteredMessages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg._id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""
                  }`}
              >

                {/* Avatar */}
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-800">
                  {isUser ? "U" : "🤖"}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[65%] px-4 py-3 rounded-xl shadow-sm
                  ${isUser
                      ? "bg-blue-500 text-white"
                      : "bg-white border text-gray-800"
                    }`}
                >

                  <p className="text-sm leading-relaxed">{msg.content}</p>

                  <div
                    className={`text-[11px] mt-2 opacity-70 ${isUser ? "text-right" : ""
                      }`}
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