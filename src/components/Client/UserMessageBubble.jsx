import formatTime from "../../helpers/formatTime"
import { useState } from 'react';
import { Edit2, Copy, RotateCcw, Check } from "lucide-react";

const UserMessageBubble = ({ msg, onResend }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(msg.content);
  const [copied, setCopied] = useState(false);

  // Xử lý Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEditing) {
    return (
      <div className="w-full md:max-w-[80%] bg-white border border-gray-300 rounded-2xl p-3 shadow-sm ml-auto">
        <textarea 
          value={editValue} 
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full bg-transparent outline-none resize-none min-h-[80px] text-gray-800 text-[15px]"
          autoFocus
        />
        <div className="flex justify-between items-center mt-2 border-t pt-2">
           <span className="text-xs text-gray-400">Việc chỉnh sửa tin nhắn này sẽ gửi một tin nhắn mới.</span>
           <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Hủy</button>
              <button 
                onClick={() => {
                  onResend(editValue);
                  setIsEditing(false);
                }} 
                className="px-3 py-1.5 rounded-lg text-sm bg-black text-white hover:bg-gray-800 transition"
              >
                Lưu & Gửi
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col items-end w-full">
      <div className="bg-gray-100 px-5 py-3 rounded-2xl text-gray-800 text-[15px] leading-relaxed max-w-[85%] md:max-w-[80%]">
        {msg.imageUrl && (
          <img src={msg.imageUrl} alt="Uploaded" className="max-w-full rounded-xl mb-2 border border-gray-200" style={{ maxHeight: '300px', objectFit: 'contain' }} />
        )}
        <p className="whitespace-pre-wrap">{msg.content}</p>
      </div>
      
      <div className="flex items-center gap-3 mt-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400">
        <span className="text-xs">{formatTime(msg.createdAt)}</span>
        <button onClick={() => onResend(msg.content)} title="Retry" className="hover:text-gray-700 transition"><RotateCcw size={14} /></button>
        <button onClick={() => setIsEditing(true)} title="Edit" className="hover:text-gray-700 transition"><Edit2 size={14} /></button>
        <button onClick={handleCopy} title="Copy" className="hover:text-gray-700 transition">
          {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

export default UserMessageBubble;