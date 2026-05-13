import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

const ExpandableMarkdown = ({ content, isStreaming }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 600; // Giới hạn ký tự trước khi thu gọn

  // Nếu đang stream hoặc chữ ngắn thì hiện toàn bộ
  if (isStreaming || content.length <= limit) {
    return (
      <div className="prose prose-sm max-w-none text-[15px] text-gray-800 markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    );
  }

  // Nếu chữ dài thì cắt bớt
  const displayContent = expanded ? content : content.slice(0, limit) + '...';

  return (
    <div className="prose prose-sm max-w-none text-[15px] text-gray-800 markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2 underline outline-none"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};

export default ExpandableMarkdown