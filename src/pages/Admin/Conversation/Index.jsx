import React from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../../components/Admin/DataTable';

export default function ConversationIndex() {
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Người dùng', accessor: 'user' },
        { header: 'Chủ đề', accessor: 'topic' },
        { header: 'Cập nhật cuối', accessor: 'last_updated' },
    ];

    const mockData = [
        { id: 'C001', user: 'Nguyễn Văn A', topic: 'Hỏi về triệu chứng sốt', last_updated: '10 phút trước' },
        { id: 'C002', user: 'Trần Thị B', topic: 'Tư vấn thuốc dạ dày', last_updated: '1 giờ trước' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Hội thoại</h1>
            {/* Tạm thời có thể dùng Link thủ công ở Action cột trong file DataTable, hoặc bạn bọc toàn bộ row bằng Link. */}
            <DataTable title="Danh sách cuộc trò chuyện" columns={columns} data={mockData} />
            <p className="mt-4 text-sm text-gray-500">*Gợi ý: Nhấn vào chi tiết hội thoại để xem log tin nhắn.</p>
        </div>
    );
}