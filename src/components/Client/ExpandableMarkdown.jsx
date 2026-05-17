import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

const ExpandableMarkdown = ({ content, isStreaming, isDarkMode = false, textSizeClass = 'text-base' }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 600; // Giới hạn ký tự trước khi thu gọn
  const markdownClassName = `prose prose-sm max-w-none min-w-0 ${textSizeClass} leading-7 markdown-body break-words [overflow-wrap:anywhere] [&_*]:break-words [&_*]:[overflow-wrap:anywhere] [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:whitespace-pre-wrap [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto ${isDarkMode ? 'text-gray-200 prose-invert' : 'text-gray-800'}`;

  // Nếu đang stream hoặc chữ ngắn thì hiện toàn bộ
  if (isStreaming || content.length <= limit) {
    return (
      <div className={markdownClassName}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    );
  }

  // Nếu chữ dài thì cắt bớt
  const displayContent = expanded ? content : content.slice(0, limit) + '...';

  return (
    <div className={markdownClassName}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
      <button 
        onClick={() => setExpanded(!expanded)} 
        className={`${isDarkMode ? 'text-[#f1c7b7] hover:text-white' : 'text-blue-600 hover:text-blue-800'} text-sm font-semibold mt-2 underline outline-none cursor-pointer`}
      >
        {expanded ? 'Ẩn bớt' : 'Hiển thị thêm'}
      </button>
    </div>
  );
};

export default ExpandableMarkdown
