import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [search, setSearch] = useState("");

  const messages = [
    {
      id: 1,
      sender: "user",
      text: "Hello doctor bot, I have had a headache and dizziness since this morning.",
      time: "08:00 AM",
    },
    {
      id: 2,
      sender: "bot",
      text: "Hello, do you also feel nausea or fever?",
      time: "08:01 AM",
    },
    {
      id: 3,
      sender: "user",
      text: "I feel slightly nauseous.",
      time: "08:03 AM",
    },
    {
      id: 4,
      sender: "bot",
      text: "You should rest and drink more water.",
      time: "08:05 AM",
    },
  ];

  const userInfo = {
    name: "Nguyen Van A",
    email: "user@email.com",
    joined: "2025-10-12",
    status: "Active",
  };

  const filteredMessages = messages.filter((m) =>
    m.text.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  return (
    <div className="flex h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">

      {/* CHAT AREA */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-black text-white"
            >
              ← Back
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Conversation Log
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            ID: {id} • {messages.length} messages
          </div>

        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b bg-white">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 space-y-6">

          {filteredMessages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""
                  }`}
              >

                {/* Avatar */}
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
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

                  <p className="text-sm leading-relaxed">{msg.text}</p>

                  <div
                    className={`text-[11px] mt-2 opacity-70 ${isUser ? "text-right" : ""
                      }`}
                  >
                    {msg.time}
                  </div>

                </div>

              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>

      </div>

      {/* USER INFO PANEL
      <div className="w-72 border-l bg-gray-50 p-6">

        <h3 className="font-semibold text-gray-800 mb-4">
          User Information
        </h3>

        <div className="space-y-3 text-sm">

          <div>
            <span className="text-gray-500">Name</span>
            <div className="font-medium">{userInfo.name}</div>
          </div>

          <div>
            <span className="text-gray-500">Email</span>
            <div className="font-medium">{userInfo.email}</div>
          </div>

          <div>
            <span className="text-gray-500">Joined</span>
            <div className="font-medium">{userInfo.joined}</div>
          </div>

          <div>
            <span className="text-gray-500">Status</span>
            <div className="text-green-600 font-medium">
              {userInfo.status}
            </div>
          </div>

        </div>

      </div> */}

    </div>
  );
}