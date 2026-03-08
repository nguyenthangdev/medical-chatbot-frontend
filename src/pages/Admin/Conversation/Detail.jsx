import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ConversationDetail() {
  const { id } = useParams(); // Lấy ID từ URL (VD: C001)
  const navigate = useNavigate();

  // Mock tin nhắn
  const messages = [
    { id: 1, sender: 'user', text: 'Chào bác sĩ bot, tôi bị đau đầu chóng mặt từ sáng nay.', time: '08:00 AM' },
    { id: 2, sender: 'bot', text: 'Chào bạn, bạn có kèm theo buồn nôn hay sốt không?', time: '08:01 AM' },
    { id: 3, sender: 'user', text: 'Tôi hơi buồn nôn một chút.', time: '08:03 AM' },
  ];

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black">← Quay lại</button>
        <h2 className="text-xl font-bold">Chi tiết hội thoại: {id}</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm">{msg.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block text-right">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}